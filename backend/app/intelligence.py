"""Closed-bar, causal features; liquidity levels are price-derived proxies."""
import numpy as np
import pandas as pd


def features(bars: pd.DataFrame) -> pd.DataFrame:
    b = bars.copy()
    c, h, l, o = (b[k].astype(float) for k in ['close', 'high', 'low', 'open'])
    f = pd.DataFrame(index=b.index)
    f['returns'] = c.pct_change()
    f['body'] = (c-o)/c
    f['upper_wick'] = (h-np.maximum(o,c))/c
    f['lower_wick'] = (np.minimum(o,c)-l)/c
    f['range'] = (h-l)/c
    tr = pd.concat([h-l, (h-c.shift()).abs(), (l-c.shift()).abs()], axis=1).max(axis=1)
    f['atr'] = tr.rolling(14).mean()
    f['relative_range'] = (h-l)/f.atr.replace(0,np.nan)
    f['momentum'] = c.pct_change(5)
    f['acceleration'] = f.momentum.diff()
    f['realized_volatility'] = f.returns.rolling(20).std()
    f['relative_volatility'] = f.realized_volatility/f.realized_volatility.rolling(50).mean()
    f['ema_fast'] = c.ewm(span=12, adjust=False).mean()/c-1
    f['ema_slow'] = c.ewm(span=26, adjust=False).mean()/c-1
    f['macd'] = f.ema_fast-f.ema_slow
    delta = c.diff()
    gain, loss = delta.clip(lower=0).ewm(alpha=1/14,adjust=False).mean(), -delta.clip(upper=0).ewm(alpha=1/14,adjust=False).mean()
    f['rsi'] = 100-100/(1+gain/loss.replace(0,np.nan))
    f['roc'] = c.pct_change(10)
    mean,std = c.rolling(20).mean(),c.rolling(20).std()
    f['bollinger_position'] = (c-mean)/(2*std.replace(0,np.nan))
    # Lagged reference levels do not read future bars.
    f['prior_high'] = h.shift().rolling(20).max()
    f['prior_low'] = l.shift().rolling(20).min()
    f['breakout_up'] = (c>f.prior_high).astype(int)
    f['breakout_down'] = (c<f.prior_low).astype(int)
    f['sweep_high'] = ((h>f.prior_high)&(c<f.prior_high)).astype(int)
    f['sweep_low'] = ((l<f.prior_low)&(c>f.prior_low)).astype(int)
    f['displacement'] = ((f.relative_range>1.8)&((c-o).abs()/(h-l).replace(0,np.nan)>.65)).astype(int)
    times=pd.to_datetime(b.timestamp,utc=True)
    f['hour_sin']=np.sin(2*np.pi*times.dt.hour/24)
    f['hour_cos']=np.cos(2*np.pi*times.dt.hour/24)
    return f.replace([np.inf,-np.inf],np.nan)


def regime(row: dict) -> str:
    if not np.isfinite(row.get('relative_volatility',np.nan)): return 'UNCERTAIN'
    if row.get('breakout_up') or row.get('breakout_down'): return 'BREAKOUT'
    if row['relative_volatility']>1.5: return 'VOLATILITY_EXPANSION'
    if row['relative_volatility']<.6: return 'VOLATILITY_CONTRACTION'
    if row.get('sweep_high') or row.get('sweep_low'): return 'REVERSAL'
    macd=row.get('macd',0)
    if macd>.0003: return 'TRENDING_UP'
    if macd<-.0003: return 'TRENDING_DOWN'
    return 'RANGING'


def strategy_for(state: str) -> str:
    return {'TRENDING_UP':'Trend continuation','TRENDING_DOWN':'Trend continuation','BREAKOUT':'Breakout','REVERSAL':'Liquidity sweep and reclaim','RANGING':'Range trading'}.get(state,'NO TRADE')


def gold_context() -> dict:
    return {key: None for key in ['dollar_strength','treasury_yields','real_yields','inflation_expectations','geopolitical_risk']}
