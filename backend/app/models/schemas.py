from typing import Optional, List
from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    file_id: str
    original_filename: str
    duration_seconds: float
    sample_rate: int
    bpm: Optional[float] = None


class IntentionRequest(BaseModel):
    primary: str = Field(..., description="Primary goal key: heal | balance | energy | spirit")
    secondary: str = Field(..., description="Secondary intent key per primary option")


class BinauralSettings(BaseModel):
    enabled: bool = False
    band: Optional[str] = Field(None, description="delta | theta | alpha | beta | gamma")
    beat_hz: Optional[float] = None
    volume: float = 0.15


class Preset(BaseModel):
    name: str
    target_a4_hz: Optional[float] = None
    snap_to_freq_hz: Optional[float] = None
    tempo_change_percent: float = 0.0
    binaural: BinauralSettings = Field(default_factory=BinauralSettings)


class PresetResponse(BaseModel):
    preset: Preset


class ProcessRequest(BaseModel):
    file_id: str
    target_a4_hz: Optional[float] = None
    snap_to_freq_hz: Optional[float] = None
    tempo_change_percent: float = 0.0
    binaural: Optional[BinauralSettings] = None
    export_format: str = Field("wav", description="wav or mp3")
    preview_seconds: Optional[float] = Field(None, description="If set, limit processing to first N seconds for preview")


class ProcessResponse(BaseModel):
    job_id: str
    output_path: str
    format: str
