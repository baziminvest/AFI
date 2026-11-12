"""Purged chronological validation and conservative volatility-barrier labels."""
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import balanced_accuracy_score, f1_score, precision_score, recall_score
from sklearn.model_selection import TimeSeriesSplit
from .intelligence import features, regime, strategy_for


def barrier_labels(b: pd.DataFrame, atr: pd.Series, horizon=12, multiplier=1.5, cost=0.0) -> pd.Series:
    labels=pd.Series(np.nan,index=b.index)
    for i in range(len(b)-horizon):
        if not np.isfinite(atr.iloc[i]) or atr.iloc[i]<=0: continue
        entry=float(b.close.iloc[i]); upper=entry+float(atr.iloc[i])*multiplier+cost; lower=entry-float(atr.iloc[i])*multiplier-cost
        outcome=2 # Neutral/no resolved barrier.
        for j in range(i+1,i+horizon+1):
            up,down=b.high.iloc[j]>=upper,b.low.iloc[j]<=lower
            if up and down: outcome=2; break # Cannot determine touch order from OHLC.
            if up: outcome=0; break
            if down: outcome=1; break
        labels.iloc[i]=outcome
    return labels


def validate_prediction(bullish,bearish,neutral):
    values=np.asarray([bullish,bearish,neutral],dtype=float)
    if not np.isfinite(values).all() or (values<0).any() or (values>1).any() or abs(values.sum()-1)>.0001: raise ValueError('Invalid directional probabilities')
    return values


def train(bars,model_type='random_forest',horizon=12,cost=0):
    f=features(bars); labels=barrier_labels(bars,f.atr,horizon=horizon,cost=cost)
    valid=f.notna().all(axis=1)&labels.notna()
    x,y=f.loc[valid],labels.loc[valid].astype(int)
    if len(x)<250: raise ValueError('At least 250 fully labelled feature rows are required')
    if y.nunique()<2: raise ValueError('Dataset needs at least two outcome classes')
    def estimator():
        if model_type=='xgboost':
            from xgboost import XGBClassifier
            if set(y.unique())!={0,1,2}: raise ValueError('XGBoost requires all three outcome classes')
            return XGBClassifier(n_estimators=100,max_depth=3,random_state=42,n_jobs=1)
        return RandomForestClassifier(n_estimators=100,max_depth=5,min_samples_leaf=10,class_weight='balanced',random_state=42,n_jobs=1)
    results=[]
    split=int(len(x)*.8)
    development_x,development_y=x.iloc[:split],y.iloc[:split]
    for a,v in TimeSeriesSplit(n_splits=3,gap=horizon).split(development_x):
        m=estimator();m.fit(development_x.iloc[a],development_y.iloc[a]);p=m.predict(development_x.iloc[v])
        results.append(float(balanced_accuracy_score(development_y.iloc[v],p)))
    # Test labels start after a horizon-sized embargo. Never fit on held-out test rows.
    model=estimator();model.fit(x.iloc[:split-horizon],y.iloc[:split-horizon]);test_x,test_y=x.iloc[split:],y.iloc[split:];pred=model.predict(test_x)
    probs=np.zeros((len(test_x),3));raw=model.predict_proba(test_x)
    for k,c in enumerate(model.classes_): probs[:,int(c)]=raw[:,k]
    metrics={'balanced_accuracy':float(balanced_accuracy_score(test_y,pred)),'f1_macro':float(f1_score(test_y,pred,average='macro',zero_division=0)),'precision_macro':float(precision_score(test_y,pred,average='macro',zero_division=0)),'recall_macro':float(recall_score(test_y,pred,average='macro',zero_division=0)),'brier_score':float(np.mean(np.sum((probs-np.eye(3)[test_y])**2,axis=1))),'walk_forward_balanced_accuracy':results,'test_samples':len(test_y),'feature_samples':len(x),'evaluation':'chronological_out_of_sample','horizon_bars':horizon,'promotion':'requires_authorized_validation','profitability':None,'drawdown':None,'calibrated':False}
    latest=f.dropna().iloc[[-1]];p=np.zeros(3)
    for k,c in enumerate(model.classes_): p[int(c)]=model.predict_proba(latest)[0,k]
    validate_prediction(*p)
    state=regime(latest.iloc[0].to_dict())
    # A newly trained candidate cannot produce actionable directional signals.
    prediction={'bullish':float(p[0]),'bearish':float(p[1]),'neutral':float(p[2]),'decision':'WAIT','regime':state,'selected_strategy':strategy_for(state),'feature_context':latest.iloc[0].to_dict(),'candidate_only':True}
    return model,metrics,prediction
