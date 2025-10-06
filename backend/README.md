# Harmonia Backend

## Run locally

```bash
# using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints
- GET `/health`
- POST `/api/upload`
- POST `/api/preset`
- POST `/api/transform`
- GET `/api/download/{filename}`
