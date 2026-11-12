# AFI independent historical-learning service

This Python application runs separately from the web app. It is NOT deployed. No live feed, production model or trade execution exists.

## Run locally

Create a Python 3.12+ virtual environment, install `requirements.txt`, set the variables in `.env.example`, and run `uvicorn app.main:app --host 0.0.0.0 --port 8000` from this folder. Load environment variables through your host or shell; this application does not implicitly read a .env file.

`GET /health` is public and reveals no credentials. `/docs` contains the OpenAPI contract. Upload and private reads require Cloud bearer authentication. Training additionally checks the protected `user_roles` admin role using the requesting user's token. Never copy session tokens into settings or integration files.

## Deploy

Build the Dockerfile on a Python-compatible host and expose port 8000 through HTTPS. Mount a durable volume at `/data`. Configure `AFI_CLOUD_URL` and the publishable (not privileged) key in the host's private environment. A container without a durable volume loses local datasets and models when replaced. For several replicas, replace SQLite with a managed shared persistence adapter; do not deploy multiple replicas against this SQLite repository.

The model repository currently uses local durable SQLite + joblib. It does not write model metadata or predictions back into Cloud. The SQLAlchemy/PostgreSQL adapter, Alembic migrations and background scheduler remain outstanding. Cloud historical bars can be read with the authenticated user's token and are paginated.

The web health check and authenticated training proxy use `AFI_ML_SERVICE_URL`. The proxy forwards the verified request bearer token only to that administrator-configured service URL; this service independently validates the user and checks the admin role. No machine key bypass exists.

## Validation

Run `python -m pytest tests -q`. Tests use explicit synthetic fixtures only, never populate the application's displayed market data. Train features are causal. Chronological folds include a horizon embargo. Ambiguous same-bar touches become neutral. Candidates always return WAIT and require separate validation/promotion. No profitability estimate is fabricated.

## Outstanding

Production model approval, calibration, cloud model persistence, independent outcome tracking, backtest engine, incremental MT5 ingestion, timezone/DST session definitions and worker scheduling are not complete. The baseline features and models are research foundations, not validated trading strategies.
