from fastapi import APIRouter, HTTPException
from ..models.schemas import IntentionRequest, PresetResponse, Preset, BinauralSettings

router = APIRouter()


BAND_TO_BEAT = {
    "delta": 2.0,
    "theta": 5.0,
    "alpha": 10.0,
    "beta": 18.0,
    "gamma": 40.0,
}


PRIMARY_KEYS = {"heal", "balance", "energy", "spirit"}


@router.post("/preset", response_model=PresetResponse)
async def get_preset(intent: IntentionRequest):
    if intent.primary not in PRIMARY_KEYS:
        raise HTTPException(status_code=400, detail="Invalid primary intent")

    name = "Custom"
    target_a4 = None
    snap_freq = None
    tempo_percent = 0.0
    binaural = BinauralSettings(enabled=False)

    if intent.primary == "heal":
        name = "Guérison & Récupération"
        if intent.secondary == "pain_relief":
            snap_freq = 174.0
        elif intent.secondary == "cell_regen":
            snap_freq = 285.0
        elif intent.secondary == "deep_sleep":
            binaural = BinauralSettings(enabled=True, band="delta", beat_hz=BAND_TO_BEAT["delta"], volume=0.2)
            tempo_percent = -10.0
    elif intent.primary == "balance":
        name = "Bien-être & Équilibre"
        if intent.secondary == "release_fear":
            snap_freq = 396.0
        elif intent.secondary == "relations":
            snap_freq = 639.0
        elif intent.secondary == "alpha_relaxed":
            target_a4 = 432.0
            binaural = BinauralSettings(enabled=True, band="alpha", beat_hz=BAND_TO_BEAT["alpha"], volume=0.1)
        elif intent.secondary == "stress":
            snap_freq = 528.0
            binaural = BinauralSettings(enabled=True, band="theta", beat_hz=BAND_TO_BEAT["theta"], volume=0.15)
    elif intent.primary == "energy":
        name = "Énergie & Motivation"
        if intent.secondary == "focus":
            binaural = BinauralSettings(enabled=True, band="beta", beat_hz=BAND_TO_BEAT["beta"], volume=0.15)
            tempo_percent = +5.0
        elif intent.secondary == "creativity":
            snap_freq = 417.0
            binaural = BinauralSettings(enabled=True, band="theta", beat_hz=BAND_TO_BEAT["theta"], volume=0.12)
        elif intent.secondary == "euphoria":
            snap_freq = 528.0
            binaural = BinauralSettings(enabled=True, band="gamma", beat_hz=BAND_TO_BEAT["gamma"], volume=0.08)
            tempo_percent = +6.0
    elif intent.primary == "spirit":
        name = "Exploration Spirituelle"
        if intent.secondary == "intuition":
            snap_freq = 741.0
            # 852 also noted; keep single snap for MVP
        elif intent.secondary == "higher_conscious":
            snap_freq = 963.0

    return PresetResponse(
        preset=Preset(
            name=name,
            target_a4_hz=target_a4,
            snap_to_freq_hz=snap_freq,
            tempo_change_percent=tempo_percent,
            binaural=binaural,
        )
    )
