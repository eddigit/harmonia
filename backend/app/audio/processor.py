import os
import subprocess
from typing import Optional

FFMPEG_BIN = os.environ.get("FFMPEG_BIN", "ffmpeg")

BINAURAL_BANDS = {
    "delta": 2.0,
    "theta": 6.0,
    "alpha": 10.0,
    "beta": 18.0,
    "gamma": 40.0,
}


def run_ffmpeg_command(args: list[str]) -> None:
    completed = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if completed.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {completed.stderr.decode('utf-8', errors='ignore')}")


def process_audio(
    input_path: str,
    output_path: str,
    tempo_change_pct: float = 0.0,
    semitone_shift: float = 0.0,
    binaural_enabled: bool = False,
    binaural_band: Optional[str] = None,
    binaural_gain_db: float = -18.0,
) -> None:
    # Build ffmpeg filter chain
    filters: list[str] = []

    # Tempo change using atempo (supports 0.5x-2.0x per filter); chain if large
    atempo = max(0.25, min(4.0, 1.0 + tempo_change_pct / 100.0))
    filters.append(f"atempo={atempo}")

    # Pitch shift (semitones) using asetrate + aresample (approximate)
    if abs(semitone_shift) > 1e-6:
        rate_factor = 2 ** (semitone_shift / 12.0)
        filters.append(f"asetrate=sr*{rate_factor}")
        filters.append("aresample=sr")

    filter_str = ",".join(filters) if filters else "anull"

    cmd = [
        FFMPEG_BIN,
        "-y",
        "-i",
        input_path,
        "-filter:a",
        filter_str,
        "-ac",
        "2",
        "-ar",
        "44100",
        "-f",
        "wav",
        output_path,
    ]

    if not binaural_enabled:
        run_ffmpeg_command(cmd)
        return

    # If binaural is enabled, we synthesize tones and mix
    binaural_freq = BINAURAL_BANDS.get((binaural_band or "").lower())
    if not binaural_freq:
        run_ffmpeg_command(cmd)
        return

    # First create the processed base audio
    temp_path = output_path + ".base.wav"
    run_ffmpeg_command(cmd[:-2] + [temp_path])

    # Generate two close sine tones with difference = binaural_freq and merge to stereo
    mixed_tone = output_path + ".tone.wav"
    run_ffmpeg_command([
        FFMPEG_BIN,
        "-y",
        "-f",
        "lavfi",
        "-i",
        f"sine=frequency=440:sample_rate=44100:duration=36000",
        "-f",
        "lavfi",
        "-i",
        f"sine=frequency={440 + binaural_freq}:sample_rate=44100:duration=36000",
        "-filter_complex",
        f"[0:a][1:a]amerge=inputs=2,volume={binaural_gain_db}dB",
        mixed_tone,
    ])

    # Finally, mix base audio with the tone bed
    run_ffmpeg_command([
        FFMPEG_BIN,
        "-y",
        "-i",
        temp_path,
        "-i",
        mixed_tone,
        "-filter_complex",
        "[0:a][1:a]amix=inputs=2:duration=longest:normalize=0",
        output_path,
    ])

    for p in [temp_path, mixed_tone]:
        try:
            os.remove(p)
        except OSError:
            pass
