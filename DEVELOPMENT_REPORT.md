# AFI development report

## Delivered foundation

Professional charcoal signals-only terminal with eleven research sections, sign-in and recovery. Four canonical instruments and seven timeframes; historical CSV mapping, timezone/OHLC/duplicate/chronology validation, preview, atomic owner-scoped import and historical candle chart. Working risk sizing research calculator. Empty prices, macro fields and model metrics are intentional: no real market feed exists.

Cloud email/password, Google and Lovable sign-in are enabled. Email confirmation remains enabled. Roles are protected separately; no self-assignment of admin privileges exists. Thirty-two public tables have RLS. Two migrations applied: `drizzle/migrations/0000_afi_research_foundation.sql` and `0001_restrict_role_function.sql`. Instruments, datasets, bars, models, predictions and settings have typed schemas; other domain/execution tables are minimal UUID/context foundations, not complete domain implementations. Anonymous role-helper execution was revoked; authenticated execution is intentional for permission checks.

Independent FastAPI service supports authenticated CSV upload, causal features, conservative volatility-barrier labels, purged chronological walk-forward evaluation, random forest/XGBoost candidate training and durable local SQLite/joblib artifacts. Candidates always return WAIT; no production promotion or live signals exist. Dockerfile, requirements, environment template and deployment README included.

Read-only MQL4 indicator source has buffers 0 bullish, 1 bearish, 2 regime, 3 buy arrow, 4 sell arrow. Separate EA health bridge, header-only prediction CSV template and read-only Windows MT5 connector source included.

## Files

Web: `src/components/afi/`, `src/lib/afi/`, all content files in `src/routes/`, global styles and root workspace wiring.
Python: `backend/app/{main,data,intelligence,learning,repository}.py`, tests, Dockerfile, requirements, README and environment template.
Integrations: `integrations/mt4/`, `integrations/mt5/`, downloadable source under `public/downloads/`.

## Tests actually executed

- Vitest: 9 passing routing, instruments, aliases, timeframes, CSV and risk tests.
- pytest: 10 passing data/feature/label/probability/regime/health/auth-boundary tests, plus upload/train/local-persistence readback. Explicit synthetic test fixtures and auth dependency overrides do not prove hosted authentication or financial profitability.
- Browser: all research sections and sign-in page, CSV upload/validation preview (2 bars), signed-out save protection, risk results ($100 and 0.500 lots), 390px layout/navigation. No runtime errors or mobile horizontal overflow observed.
- Latest application diagnostics: build OK.

## Deployment and verification status

Web works in preview but has not been published. Cloud connection was observed in the UI and migrations were applied. Independent Python service is NOT externally deployed; Docker image has not been built. Python tests ran locally in the sandbox.

No auth users exist yet. Managed session minting failed because there is no account. Authenticated Cloud import/readback, real signup/email/social flows and password recovery remain unverified. Sign in through AFI before the next verification turn.

MQL4 has NOT been compiled in MetaEditor or tested in Strategy Tester. MT5 has NOT run against a Windows terminal. Offline scores are baseline scores, not model probabilities.

## Remaining requirements

- External Python HTTPS host, persistent /data volume, Cloud public connection settings and private `AFI_ML_SERVICE_URL`; an explicitly authorized admin account for training. The Python service needs no privileged Cloud key.
- Genuine historical datasets and eventual market feed; none have been supplied.
- PostgreSQL/SQLAlchemy adapter and Alembic migrations; local SQLite/joblib currently persists Python candidates and predictions but not Cloud model rows. The web registry/history/metrics do not yet read local candidates.
- Calibration, authorized model promotion, outcome tracking, background adaptive cycles, cost-aware backtesting/equity curves, session/DST classification and complete strategy evaluation.
- MT4 local prediction CSV import/endpoint, MT5 incremental ingestion/reconnection and MetaTrader tests.
- Restore saved preferences and apply timezone across all displays.

This is a tested modular research foundation, not the completed acceptance-criteria release. No trade execution exists.

## Next sprint

Create the first account, authorize the correct administrator explicitly, supply genuine historical data, deploy the Python host and verify authenticated saved-data readback. Then wire Cloud candidate persistence and registry/history, calibrated promotion, outcome tracking and cost-aware backtesting before live observation.
