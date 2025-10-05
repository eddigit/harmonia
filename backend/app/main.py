from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.upload import router as upload_router
from .routers.preset import router as preset_router
from .routers.process import router as process_router

app = FastAPI(title="Harmonia API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(preset_router, prefix="/api")
app.include_router(process_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}

# Run with: uvicorn backend.app.main:app --reload
