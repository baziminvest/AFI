from io import StringIO
import pandas as pd

SYMBOLS = {'EURUSD','GBPUSD','USDJPY','XAUUSD'}
TIMEFRAMES = {'M1','M5','M15','M30','H1','H4','D1'}


def canonical_symbol(raw: str) -> str:
    value=raw.upper()
    if value=='GOLD': return 'XAUUSD'
    for symbol in SYMBOLS:
        if value in {symbol,symbol+'M',symbol+'.A'}: return symbol
    raise ValueError('Unsupported instrument')


def validate_csv(text: str) -> pd.DataFrame:
    b=pd.read_csv(StringIO(text))
    b.columns=[c.strip().lower() for c in b.columns]
    if not {'timestamp','open','high','low','close'}.issubset(b.columns): raise ValueError('Missing timestamp or OHLC columns')
    if not 2<=len(b)<=10000: raise ValueError('Dataset requires 2 to 10000 bars')
    if not b.timestamp.astype(str).str.contains(r'(Z|[+-]\d\d:\d\d)$',regex=True).all(): raise ValueError('Timestamps require explicit timezone')
    b.timestamp=pd.to_datetime(b.timestamp,utc=True)
    if b.timestamp.duplicated().any(): raise ValueError('Duplicate timestamp')
    if not b.timestamp.is_monotonic_increasing: raise ValueError('Bars must be chronological')
    for c in ['open','high','low','close']:
        b[c]=pd.to_numeric(b[c],errors='raise')
        if not ((b[c]>0)&(b[c]<float('inf'))).all(): raise ValueError('Invalid price')
    if (b.high<b[['open','close','low']].max(axis=1)).any() or (b.low>b[['open','close']].min(axis=1)).any(): raise ValueError('Invalid OHLC structure')
    if 'volume' in b:
        b.volume=pd.to_numeric(b.volume,errors='raise')
        if (b.volume.dropna()<0).any(): raise ValueError('Invalid volume')
    return b
