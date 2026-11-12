"""Durable local artifacts and authenticated Cloud REST persistence, without privileged keys."""
import json, os, sqlite3
from pathlib import Path
from uuid import uuid4
import httpx

class Repository:
    def __init__(self,path):
        self.path=Path(path); self.path.mkdir(parents=True,exist_ok=True)
        with self.connection() as db:
            db.execute('CREATE TABLE IF NOT EXISTS datasets(id TEXT PRIMARY KEY, user_id TEXT NOT NULL, symbol TEXT NOT NULL, timeframe TEXT NOT NULL, filename TEXT NOT NULL, bars TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)')
            db.execute('CREATE TABLE IF NOT EXISTS models(id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dataset_id TEXT NOT NULL, version TEXT NOT NULL, metrics TEXT NOT NULL, prediction TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)')
    def connection(self): return sqlite3.connect(self.path/'afi.sqlite3')
    def save_dataset(self,user_id,symbol,timeframe,filename,bars):
        identifier=str(uuid4())
        with self.connection() as db: db.execute('INSERT INTO datasets(id,user_id,symbol,timeframe,filename,bars) VALUES(?,?,?,?,?,?)',(identifier,user_id,symbol,timeframe,filename,bars))
        return identifier
    def dataset(self,identifier,user_id):
        with self.connection() as db:
            db.row_factory=sqlite3.Row
            row=db.execute('SELECT * FROM datasets WHERE id=? AND user_id=?',(identifier,user_id)).fetchone()
            return dict(row) if row else None
    def save_model(self,user_id,dataset_id,metrics,prediction):
        identifier=str(uuid4()); version='candidate-'+identifier[:8]
        with self.connection() as db: db.execute('INSERT INTO models(id,user_id,dataset_id,version,metrics,prediction) VALUES(?,?,?,?,?,?)',(identifier,user_id,dataset_id,version,json.dumps(metrics),json.dumps(prediction)))
        return identifier,version
    def models(self,user_id):
        with self.connection() as db:
            db.row_factory=sqlite3.Row
            return [{**dict(r),'metrics':json.loads(r['metrics']),'prediction':json.loads(r['prediction'])} for r in db.execute('SELECT * FROM models WHERE user_id=? ORDER BY created_at DESC',(user_id,))]

async def cloud_dataset(identifier,user_id,authorization):
    url=os.environ.get('AFI_CLOUD_URL');key=os.environ.get('AFI_CLOUD_PUBLISHABLE_KEY')
    if not url or not key or not authorization: return None
    async with httpx.AsyncClient(timeout=15) as client:
        headers={'apikey':key,'Authorization':authorization}
        response=await client.get(url+'/rest/v1/dataset_versions',params={'id':'eq.'+identifier,'user_id':'eq.'+user_id,'select':'*'},headers=headers);response.raise_for_status()
        rows=response.json()
        if not rows: return None
        bars=[]
        for offset in range(0,rows[0]['row_count'],1000):
            result=await client.get(url+'/rest/v1/market_bars',params={'dataset_id':'eq.'+identifier,'user_id':'eq.'+user_id,'select':'timestamp,open,high,low,close,volume','order':'timestamp.asc','offset':offset,'limit':1000},headers=headers);result.raise_for_status();bars.extend(result.json())
        return {**rows[0],'bars':json.dumps(bars)}
