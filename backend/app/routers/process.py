import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..core.config import UPLOAD_DIR, OUTPUT_DIR
from ..models.schemas import ProcessRequest, ProcessResponse
from ..services.audio import process_audio

router = APIRouter()


@router.post("/process", response_model=ProcessResponse)
async def process_endpoint(req: ProcessRequest):
    # locate input
    candidates = list(UPLOAD_DIR.glob(f"{req.file_id}.*"))
    if not candidates:
        raise HTTPException(status_code=404, detail="File not found")
    input_path = candidates[0]

    job_id = str(uuid.uuid4())
    out_wav = OUTPUT_DIR / f"{job_id}.wav"

    try:
        process_audio(
            input_path=input_path,
            output_path=out_wav,
            target_a4_hz=req.target_a4_hz,
            snap_to_freq_hz=req.snap_to_freq_hz,
            tempo_change_percent=req.tempo_change_percent,
            binaural_settings=(req.binaural.dict() if req.binaural else None),
            preview_seconds=req.preview_seconds,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Processing failed: {e}")

    return ProcessResponse(job_id=job_id, output_path=str(out_wav), format="wav")


@router.get("/download/{job_id}")
async def download(job_id: str):
    candidates = list(OUTPUT_DIR.glob(f"{job_id}.*"))
    if not candidates:
        raise HTTPException(status_code=404, detail="Output not found")
    path = candidates[0]
    return FileResponse(path, filename=path.name, media_type="audio/wav")
