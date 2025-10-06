from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid
import os
from app.audio.processor import process_audio

UPLOAD_DIR = "/workspace/backend/tmp/uploads"
PROCESSED_DIR = "/workspace/backend/tmp/processed"

router = APIRouter()

class PresetRequest(BaseModel):
    goal: str
    detail: Optional[str] = None

class TransformRequest(BaseModel):
    file_id: str
    tuning_hz: Optional[float] = 440.0
    lock_to_frequency_hz: Optional[float] = None
    tempo_change_pct: Optional[float] = 0.0
    binaural_enabled: Optional[bool] = False
    binaural_target: Optional[str] = None  # delta/theta/alpha/beta/gamma
    binaural_gain_db: Optional[float] = -18.0


FREQUENCY_KB: Dict[str, Dict[str, Any]] = {
    "174": {"label": "174 Hz", "usage": "Soulager une douleur physique"},
    "285": {"label": "285 Hz", "usage": "Régénération cellulaire"},
    "396": {"label": "396 Hz", "usage": "Libérer peurs et culpabilité"},
    "417": {"label": "417 Hz", "usage": "Stimuler la créativité"},
    "432": {"label": "432 Hz", "usage": "Relaxation éveillée"},
    "528": {"label": "528 Hz", "usage": "Réduction du stress, joie"},
    "639": {"label": "639 Hz", "usage": "Harmoniser relations"},
    "741": {"label": "741 Hz", "usage": "Développer l'intuition"},
    "852": {"label": "852 Hz", "usage": "Intuition/retour à l'ordre spirituel"},
    "963": {"label": "963 Hz", "usage": "Connexion conscience supérieure"},
}

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".mp3", ".wav", ".flac", ".aac", ".m4a"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")
    file_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    with open(save_path, "wb") as out:
        out.write(await file.read())
    return {"fileId": file_id, "filename": file.filename}

@router.post("/preset")
async def preset(req: PresetRequest):
    # Very simple mapping placeholder
    mapping = {
        "Guérison et Récupération": {"tuning_hz": 432.0, "tempo_change_pct": -10.0},
        "Bien-être et Équilibre": {"tuning_hz": 432.0, "tempo_change_pct": 0.0},
        "Énergie et Motivation": {"tuning_hz": 440.0, "tempo_change_pct": 8.0},
        "Exploration Spirituelle": {"tuning_hz": 432.0, "tempo_change_pct": -2.0},
    }
    base = mapping.get(req.goal, {"tuning_hz": 440.0, "tempo_change_pct": 0.0})
    return {"preset": base, "label": f"Preset pour {req.goal}"}


@router.get("/knowledge/frequencies")
async def knowledge_frequencies():
    return {"items": FREQUENCY_KB}

@router.get("/knowledge/waves")
async def knowledge_waves():
    return {
        "items": {
            "delta": {"range_hz": "0.5-4", "effects": "Sommeil profond, régénération"},
            "theta": {"range_hz": "4-8", "effects": "Méditation, créativité"},
            "alpha": {"range_hz": "8-12", "effects": "Relaxation éveillée"},
            "beta": {"range_hz": "12-30", "effects": "Concentration, attention"},
            "gamma": {"range_hz": "30-100", "effects": "Hautes fonctions cognitives"},
        }
    }

@router.post("/transform")
async def transform(req: TransformRequest):
    input_candidates = [p for p in os.listdir(UPLOAD_DIR) if p.startswith(req.file_id)]
    if not input_candidates:
        raise HTTPException(status_code=404, detail="File not found")
    input_path = os.path.join(UPLOAD_DIR, input_candidates[0])
    out_name = f"{req.file_id}_processed.wav"
    out_path = os.path.join(PROCESSED_DIR, out_name)

    # Compute semitone shift if locking to frequency (approximation)
    semitone_shift = 0.0
    if req.lock_to_frequency_hz:
        try:
            import math
            ratio = float(req.lock_to_frequency_hz) / float(req.tuning_hz or 440.0)
            semitone_shift = 12.0 * math.log2(max(ratio, 1e-9))
        except Exception:
            semitone_shift = 0.0

    try:
        process_audio(
            input_path=input_path,
            output_path=out_path,
            tempo_change_pct=req.tempo_change_pct or 0.0,
            semitone_shift=semitone_shift,
            binaural_enabled=bool(req.binaural_enabled),
            binaural_band=req.binaural_target,
            binaural_gain_db=req.binaural_gain_db or -18.0,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"downloadUrl": f"/download/{out_name}", "out_file": out_name}

@router.get("/download/{filename}")
async def download(filename: str):
    path = os.path.join(PROCESSED_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Processed file not found")
    return FileResponse(path, filename=filename)
