"""Read-only Windows connector. Install official MetaTrader5 package on Windows."""
from datetime import datetime, timezone
from contextlib import contextmanager

@contextmanager
def terminal(path=None):
    import MetaTrader5 as mt5
    if not (mt5.initialize(path) if path else mt5.initialize()):
        raise ConnectionError('MT5 initialization failed; inspect terminal locally')
    try: yield mt5
    finally: mt5.shutdown()

def account_metadata(mt5):
    info=mt5.account_info()
    if info is None: raise ConnectionError('No terminal account available')
    return {'currency':info.currency,'balance':info.balance,'equity':info.equity,'leverage':info.leverage}

def discover_symbols(mt5):
    return [{'broker_symbol':s.name,'description':s.description} for s in (mt5.symbols_get() or [])]

def historical_bars(mt5,broker_symbol,timeframe,start,end):
    if start.tzinfo is None or end.tzinfo is None: raise ValueError('UTC-aware times required')
    if not mt5.symbol_select(broker_symbol,True): raise ValueError('Broker symbol unavailable')
    rows=mt5.copy_rates_range(broker_symbol,timeframe,start.astimezone(timezone.utc),end.astimezone(timezone.utc))
    if rows is None: raise ConnectionError('Historical bars unavailable')
    return [{'timestamp':datetime.fromtimestamp(int(r['time']),timezone.utc).isoformat(),'open':float(r['open']),'high':float(r['high']),'low':float(r['low']),'close':float(r['close']),'volume':int(r['tick_volume'])} for r in rows]

def latest_tick(mt5,broker_symbol):
    tick=mt5.symbol_info_tick(broker_symbol)
    if tick is None: return None
    return {'timestamp':datetime.fromtimestamp(tick.time,timezone.utc).isoformat(),'bid':tick.bid,'ask':tick.ask}
