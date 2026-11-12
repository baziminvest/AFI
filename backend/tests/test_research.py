import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from app.main import app, identity, administrator
from app.data import validate_csv,canonical_symbol
from app.intelligence import features,regime,gold_context
from app.learning import barrier_labels,validate_prediction,train

CSV='timestamp,open,high,low,close,volume\n2026-01-01T00:00:00Z,100,102,99,101,5\n2026-01-01T01:00:00Z,101,103,100,102,7'
def bars(n=500):
    rng=np.random.default_rng(9);close=100+np.cumsum(rng.normal(0,.4,n));return pd.DataFrame({'timestamp':pd.date_range('2024-01-01',periods=n,freq='h',tz='UTC'),'open':close-rng.normal(0,.1,n),'high':close+1,'low':close-1,'close':close,'volume':100})
def test_csv_timezone_and_duplicates():
    assert str(validate_csv(CSV).timestamp.dt.tz)=='UTC'
    with pytest.raises(ValueError):validate_csv(CSV.replace('01:00:00Z','00:00:00Z'))
    with pytest.raises(ValueError):validate_csv(CSV.replace('Z',''))
def test_aliases():
    assert canonical_symbol('GOLD')=='XAUUSD';assert canonical_symbol('EURUSDm')=='EURUSD'
def test_no_future_feature_leakage():
    b=bars();a=features(b);b.loc[300:,'close']+=50;changed=features(b);pd.testing.assert_frame_equal(a.iloc[:300],changed.iloc[:300])
def test_returns_and_atr():
    b=bars();f=features(b);assert f.returns.iloc[1]==pytest.approx(b.close.iloc[1]/b.close.iloc[0]-1);assert f.atr.iloc[15]>0

def test_ambiguous_barriers_are_neutral():
    b=pd.DataFrame({'close':[100,100,100],'high':[100,103,100],'low':[100,97,100]});assert barrier_labels(b,pd.Series([1,1,1]),horizon=1).iloc[0]==2

def test_probabilities():
    assert validate_prediction(.4,.4,.2).sum()==1
    with pytest.raises(ValueError):validate_prediction(.8,.4,.2)

def test_regimes_and_gold_unavailable():
    assert regime({'relative_volatility':2})=='VOLATILITY_EXPANSION'
    assert regime({})=='UNCERTAIN'
    assert all(v is None for v in gold_context().values())

def test_chronological_training_and_wait():
    _,metrics,p=train(bars());assert metrics['test_samples']>0;assert len(metrics['walk_forward_balanced_accuracy'])==3;assert p['decision']=='WAIT';assert p['candidate_only'];validate_prediction(p['bullish'],p['bearish'],p['neutral'])

def test_health_and_auth_boundary():
    c=TestClient(app);assert c.get('/health').json()['execution_enabled'] is False;assert c.post('/api/v1/learning/train',json={'dataset_id':'x'}).status_code in [401,503]

def test_upload_training_and_persistence(tmp_path,monkeypatch):
    monkeypatch.setenv('AFI_DATA_DIR',str(tmp_path));app.dependency_overrides[identity]=lambda:{'user_id':'test-researcher','authorization':None};app.dependency_overrides[administrator]=lambda:{'user_id':'test-researcher','authorization':None}
    try:
        c=TestClient(app);b=bars();response=c.post('/api/v1/datasets/upload',data={'symbol':'EURUSD','timeframe':'H1'},files={'file':('real-test-fixture.csv',b.to_csv(index=False),'text/csv')});assert response.status_code==200
        trained=c.post('/api/v1/learning/train',json={'dataset_id':response.json()['dataset_id']});assert trained.status_code==200
        assert c.get('/api/v1/models/status').json()['candidates'][0]['prediction']['decision']=='WAIT'
    finally: app.dependency_overrides.clear()
