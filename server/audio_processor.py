#!/usr/bin/env python3
"""
Harmonia Audio Processor
Processes audio files with therapeutic frequencies and effects
"""

import sys
import json
import numpy as np
import librosa
import soundfile as sf
from scipy import signal
import argparse
import os

def generate_binaural_beat(frequency, duration, sample_rate=44100, volume=0.1):
    """Generate binaural beats at the specified frequency"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Create carrier frequencies (typically 200Hz and 200Hz + frequency)
    carrier_left = 200
    carrier_right = 200 + frequency
    
    left_ear = np.sin(2 * np.pi * carrier_left * t) * volume
    right_ear = np.sin(2 * np.pi * carrier_right * t) * volume
    
    return np.column_stack((left_ear, right_ear))

def pitch_shift_audio(audio, sample_rate, target_freq, original_freq=440):
    """Shift the pitch of audio to match target frequency"""
    if target_freq == original_freq:
        return audio
    
    # Calculate pitch shift ratio
    pitch_ratio = target_freq / original_freq
    
    # Use librosa's pitch shifting
    shifted_audio = librosa.effects.pitch_shift(
        audio, 
        sr=sample_rate, 
        n_steps=12 * np.log2(pitch_ratio)
    )
    
    return shifted_audio

def change_tempo(audio, sample_rate, tempo_ratio):
    """Change the tempo of audio while preserving pitch"""
    if tempo_ratio == 1.0:
        return audio
    
    # Use librosa's time stretching
    stretched_audio = librosa.effects.time_stretch(audio, rate=tempo_ratio)
    return stretched_audio

def apply_solfeggio_tuning(audio, sample_rate, target_freq):
    """Apply Solfeggio frequency tuning to audio"""
    # Convert target frequency to pitch shift
    if target_freq == 440:
        return audio
    
    # Calculate the pitch shift needed
    pitch_shift = 12 * np.log2(target_freq / 440)
    
    # Apply pitch shift
    tuned_audio = librosa.effects.pitch_shift(
        audio, 
        sr=sample_rate, 
        n_steps=pitch_shift
    )
    
    return tuned_audio

def process_audio(input_path, output_path, settings):
    """Main audio processing function"""
    try:
        # Load audio file
        audio, sample_rate = librosa.load(input_path, sr=None, mono=False)
        
        # Convert to mono if stereo
        if len(audio.shape) > 1:
            audio = librosa.to_mono(audio)
        
        # Apply settings
        processed_audio = audio.copy()
        
        # 1. Apply pitch/tuning changes
        if 'tuning' in settings:
            tuning_freq = settings['tuning']
            if tuning_freq != 440:
                processed_audio = apply_solfeggio_tuning(processed_audio, sample_rate, tuning_freq)
        
        # 2. Apply tempo changes
        if 'tempo' in settings and settings['tempo'] != 1.0:
            processed_audio = change_tempo(processed_audio, sample_rate, settings['tempo'])
        
        # 3. Add binaural beats if enabled
        if settings.get('binauralBeats', {}).get('enabled', False):
            binaural_settings = settings['binauralBeats']
            frequency = binaural_settings.get('frequency', 10)  # Default to Alpha
            volume = binaural_settings.get('volume', 0.1)
            
            # Generate binaural beats
            duration = len(processed_audio) / sample_rate
            binaural_beat = generate_binaural_beat(frequency, duration, sample_rate, volume)
            
            # Mix with original audio
            if len(binaural_beat.shape) == 2:  # Stereo binaural beat
                # Convert processed audio to stereo if needed
                if len(processed_audio.shape) == 1:
                    processed_audio = np.column_stack((processed_audio, processed_audio))
                
                # Mix the audio
                processed_audio = processed_audio + binaural_beat
            else:
                # Mono binaural beat
                processed_audio = processed_audio + binaural_beat
        
        # 4. Normalize audio to prevent clipping
        max_val = np.max(np.abs(processed_audio))
        if max_val > 0:
            processed_audio = processed_audio / max_val * 0.95
        
        # Save processed audio
        sf.write(output_path, processed_audio, sample_rate)
        
        return True
        
    except Exception as e:
        print(f"Error processing audio: {str(e)}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) != 4:
        print("Usage: python audio_processor.py <input_path> <output_path> <settings_json>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    settings_json = sys.argv[3]
    
    try:
        settings = json.loads(settings_json)
    except json.JSONDecodeError as e:
        print(f"Error parsing settings JSON: {str(e)}", file=sys.stderr)
        sys.exit(1)
    
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)
    
    success = process_audio(input_path, output_path, settings)
    
    if success:
        print("Audio processing completed successfully")
        sys.exit(0)
    else:
        print("Audio processing failed", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()