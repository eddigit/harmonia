from __future__ import annotations
import math
from pathlib import Path
from typing import Tuple, Optional

import numpy as np
import librosa
import soundfile as sf


def load_audio_mono(path: Path, target_sr: int = 44100) -> Tuple[np.ndarray, int]:
    y, sr = librosa.load(str(path), sr=target_sr, mono=True)
    return y.astype(np.float32), sr


def load_audio_preserve_channels(path: Path, target_sr: int = 44100, max_seconds: Optional[float] = None) -> Tuple[np.ndarray, int]:
    y, sr = librosa.load(str(path), sr=target_sr, mono=False, duration=max_seconds)
    if y.ndim == 1:
        y = np.stack([y, y], axis=0)  # [2, n]
    return y.astype(np.float32), sr


def estimate_bpm(y: np.ndarray, sr: int) -> Optional[float]:
    try:
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        return float(tempo)
    except Exception:
        return None


def time_stretch(y: np.ndarray, rate: float) -> np.ndarray:
    if np.isclose(rate, 1.0):
        return y
    if y.ndim == 1:
        return librosa.effects.time_stretch(y, rate)
    # stereo or multi-channel: process per channel
    stretched = [librosa.effects.time_stretch(ch, rate) for ch in y]
    # pad/truncate to same length
    min_len = min(map(len, stretched))
    stretched = [ch[:min_len] for ch in stretched]
    return np.stack(stretched, axis=0)


def pitch_shift_semitones(y: np.ndarray, sr: int, semitones: float) -> np.ndarray:
    if np.isclose(semitones, 0.0):
        return y
    if y.ndim == 1:
        return librosa.effects.pitch_shift(y, sr=sr, n_steps=semitones)
    shifted = [librosa.effects.pitch_shift(ch, sr=sr, n_steps=semitones) for ch in y]
    min_len = min(map(len, shifted))
    shifted = [ch[:min_len] for ch in shifted]
    return np.stack(shifted, axis=0)


def to_stereo(y: np.ndarray) -> np.ndarray:
    if y.ndim == 1:
        return np.stack([y, y], axis=0)
    return y


def add_binaural_beat(y: np.ndarray, sr: int, beat_hz: float, volume: float = 0.15, carrier_hz: float = 200.0) -> np.ndarray:
    if beat_hz <= 0 or volume <= 0:
        return to_stereo(y)
    stereo = to_stereo(y)
    n = stereo.shape[1]
    t = np.arange(n) / float(sr)
    left = np.sin(2 * np.pi * (carrier_hz - beat_hz / 2.0) * t)
    right = np.sin(2 * np.pi * (carrier_hz + beat_hz / 2.0) * t)
    tone = np.stack([left, right], axis=0).astype(np.float32)
    # simple fade-in/out to avoid clicks
    fade_len = min(int(sr * 0.02), n // 10)
    if fade_len > 0:
        fade = np.linspace(0.0, 1.0, fade_len)
        tone[:, :fade_len] *= fade
        tone[:, -fade_len:] *= fade[::-1]
    mixed = stereo + volume * tone
    # prevent clipping
    max_abs = np.max(np.abs(mixed))
    if max_abs > 1.0:
        mixed = mixed / max_abs
    return mixed


def save_wav(path: Path, y: np.ndarray, sr: int) -> None:
    if y.ndim == 2:
        y_to_write = y.T  # [n, ch]
    else:
        y_to_write = y
    sf.write(str(path), y_to_write, sr)


def semitones_from_a4_shift(target_a4_hz: float) -> float:
    return 12.0 * math.log(target_a4_hz / 440.0, 2)


def semitones_from_snap_freq(snap_freq_hz: float) -> float:
    return 12.0 * math.log(snap_freq_hz / 440.0, 2)


def process_audio(
    input_path: Path,
    output_path: Path,
    target_a4_hz: Optional[float] = None,
    snap_to_freq_hz: Optional[float] = None,
    tempo_change_percent: float = 0.0,
    binaural_settings: Optional[dict] = None,
    target_sr: int = 44100,
    preview_seconds: Optional[float] = None,
) -> Tuple[Path, int]:
    y, sr = load_audio_preserve_channels(input_path, target_sr=target_sr, max_seconds=preview_seconds)

    # Tempo
    if tempo_change_percent and not np.isclose(tempo_change_percent, 0.0):
        rate = 1.0 + (tempo_change_percent / 100.0)
        y = time_stretch(y, rate)

    # Pitch
    total_semitones = 0.0
    if target_a4_hz:
        total_semitones += semitones_from_a4_shift(float(target_a4_hz))
    if snap_to_freq_hz:
        total_semitones += semitones_from_snap_freq(float(snap_to_freq_hz))
    if not np.isclose(total_semitones, 0.0):
        y = pitch_shift_semitones(y, sr=sr, semitones=total_semitones)

    # Binaural
    if binaural_settings and binaural_settings.get("enabled"):
        beat_hz = float(binaural_settings.get("beat_hz", 0.0) or 0.0)
        volume = float(binaural_settings.get("volume", 0.15) or 0.15)
        y = add_binaural_beat(y, sr=sr, beat_hz=beat_hz, volume=volume)

    save_wav(output_path, y, sr)
    return output_path, sr
