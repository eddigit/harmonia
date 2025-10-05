import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse

from ..core.config import UPLOAD_DIR
from ..models.schemas import UploadResponse
from ..services.audio import load_audio_mono, estimate_bpm

router = APIRouter()


SUPPORTED_EXTS = {".mp3", ".wav", ".flac", ".aac", ".m4a"}
MAX_SIZE_MB = 100


@router.post("/upload", response_model=UploadResponse)
async def upload_audio(file: UploadFile = File(...)):
    original_name = file.filename or "audio"
    suffix = Path(original_name).suffix.lower()
    if suffix not in SUPPORTED_EXTS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {suffix}")

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(status_code=400, detail="File too large")

    file_id = str(uuid.uuid4())
    dest_path = UPLOAD_DIR / f"{file_id}{suffix}"
    with open(dest_path, "wb") as f:
        f.write(contents)

    # Analyze
    try:
        y, sr = load_audio_mono(dest_path)
        duration_seconds = len(y) / sr
        bpm = estimate_bpm(y, sr)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to analyze audio: {e}")

    return UploadResponse(
        file_id=file_id,
        original_filename=original_name,
        duration_seconds=duration_seconds,
        sample_rate=sr,
        bpm=bpm,
    )


@router.get("/original/{file_id}")
async def original(file_id: str):
    candidates = list(UPLOAD_DIR.glob(f"{file_id}.*"))
    if not candidates:
        raise HTTPException(status_code=404, detail="File not found")
    path = candidates[0]
    # naive media_type selection based on suffix
    suffix = path.suffix.lower()
    media = {
        ".wav": "audio/wav",
        ".mp3": "audio/mpeg",
        ".flac": "audio/flac",
        ".m4a": "audio/mp4",
        ".aac": "audio/aac",
    }.get(suffix, "application/octet-stream")
    return FileResponse(path, filename=path.name, media_type=media)
