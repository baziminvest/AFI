import json, os, secrets
from datetime import datetime, timedelta, timezone
from io import StringIO
from pathlib import Path
import pandas as pd
from fastapi import FastAPI, Depends, Header, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from .data import validate_csv, canonical_symbol, TIMEFRAMES
from .intelligence import features, gold_context
from .learning import train
from .repository import Repository, cloud_dataset
import httpx

app=FastAPI(title='AFI Historical Learning Service',version='0.1.0')
def repository(): return Repository(os.environ.get('AFI_DATA_DIR','./data'))

async def identity(authorization: str|None=Header(default=None)):
    url=os.environ.get('AFI_CLOUD_URL');key=os.environ.get('AFI_CLOUD_PUBLISHABLE_KEY')
    if not url or not key: raise HTTPException(503,'Cloud authentication is not configured')
    if not authorization or not authorization.startswith('Bearer '): raise HTTPException(401,'Sign-in required')
    async with httpx.AsyncClient(timeout=10) as client:
        response=await client.get(url+'/auth/v1/user',headers={'apikey':key,'Authorization':authorization})
        if response.status_code!=200: raise HTTPException(401,'Invalid session')
        return {'user_id':response.json()['id'],'authorization':authorization}

async def administrator(user=Depends(identity)):
    async with httpx.AsyncClient(timeout=10) as client:
        response=await client.post(os.environ['AFI_CLOUD_URL']+'/rest/v1/rpc/has_role',headers={'apikey':os.environ['AFI_CLOUD_PUBLISHABLE_KEY'],'Authorization':user['authorization']},json={'_user_id':user['user_id'],'_role':'admin'})
        if response.status_code!=200 or response.json() is not True: raise HTTPException(403,'Administrator authorization required')
    return user

@app.exception_handler(ValueError)
async def invalid_input(request:Request,error:ValueError): return JSONResponse(status_code=422,content={'error':{'code':'validation_error','message':str(error)}})
@app.get('/health')
def health(): return {'status':'ok','service':'AFI historical learning','execution_enabled':False,'market_feed':'not_connected','storage':'local durable SQLite','cloud_auth_configured':bool(os.environ.get('AFI_CLOUD_URL'))}
@app.post('/api/v1/datasets/upload')
async def upload(file:UploadFile=File(...),symbol:str=Form(...),timeframe:str=Form(...),user=Depends(identity)):
    symbol=canonical_symbol(symbol)
    if timeframe not in TIMEFRAMES: raise ValueError('Unsupported timeframe')
    raw=await file.read(20*1024*1024+1)
    if len(raw)>20*1024*1024: raise HTTPException(413,'CSV exceeds 20 MB')
    b=validate_csv(raw.decode('utf-8-sig'));identifier=repository().save_dataset(user['user_id'],symbol,timeframe,file.filename or 'historical.csv',b.to_json(orient='records',date_format='iso'))
    return {'dataset_id':identifier,'rows':len(b),'symbol':symbol,'timeframe':timeframe,'provenance':'user_uploaded_historical_csv'}
class TrainRequest(BaseModel):
    dataset_id:str
    model_type:str=Field(default='random_forest',pattern='^(random_forest|xgboost)$')
    horizon:int=Field(default=12,ge=2,le=100)
    transaction_cost:float=Field(default=0,ge=0)

@app.post('/api/v1/learning/train')
async def training(payload:TrainRequest,user=Depends(administrator)):
    repo=repository();d=repo.dataset(payload.dataset_id,user['user_id']) or await cloud_dataset(payload.dataset_id,user['user_id'],user['authorization'])
    if not d: raise HTTPException(404,'Dataset not found')
    b=pd.read_json(StringIO(d['bars']));b.timestamp=pd.to_datetime(b.timestamp,utc=True)
    model,metrics,prediction=train(b,payload.model_type,payload.horizon,payload.transaction_cost)
    identifier,version=repo.save_model(user['user_id'],payload.dataset_id,metrics,prediction)
    import joblib
    joblib.dump(model,repo.path/(identifier+'.joblib'))
    return {'model_id':identifier,'version':version,'status':'candidate','metrics':metrics,'prediction':prediction,'persisted':'local durable storage','cloud_model_persistence':False}
@app.post('/api/v1/learning/evaluate')
async def evaluate(payload:TrainRequest,user=Depends(administrator)):
    raise HTTPException(409,'Train endpoint performs chronological evaluation. Promotion and separate reevaluation are not yet enabled.')
@app.get('/api/v1/models/status')
async def model_status(user=Depends(identity)): return {'production_model':None,'candidates':repository().models(user['user_id'])}
@app.get('/api/v1/learning/history')
async def history(user=Depends(identity)): return {'runs':repository().models(user['user_id'])}
@app.get('/api/v1/market/overview')
def market_overview(): return {'instruments':[{'symbol':s,'price':None,'regime':None,'data_status':'awaiting_market_data'} for s in ['EURUSD','GBPUSD','USDJPY','XAUUSD']]}
@app.get('/api/v1/market/{symbol}')
def market(symbol:str):
    s=canonical_symbol(symbol);return {'symbol':s,'price':None,'status':'awaiting_market_data','macro':gold_context() if s=='XAUUSD' else None}
@app.get('/api/v1/signals')
def signals(): return {'signals':[],'reason':'No approved production model or live feed'}
@app.get('/api/v1/signals/{symbol}')
def instrument_signals(symbol:str): return {'symbol':canonical_symbol(symbol),'signals':[]}
@app.get('/api/v1/strategies')
def strategies(): return {'strategies':['Trend continuation','Range trading','Breakout','Reversal','Liquidity sweep and reclaim'],'performance':None}
@app.get('/api/v1/backtesting/runs')
async def backtests(user=Depends(identity)): return {'runs':[],'status':'backtesting_engine_not_implemented'}
