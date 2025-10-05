import os
import numpy as np
import librosa
import soundfile as sf
from pydub import AudioSegment
import pyrubberband as pyrb
from scipy import signal
import logging

logger = logging.getLogger(__name__)

class AudioProcessor:
    """
    Main audio processing class for Harmonia
    Handles pitch shifting, tempo changes, and binaural beat generation
    """
    
    def __init__(self, input_path):
        self.input_path = input_path
        self.audio_data = None
        self.sample_rate = None
        self.duration = None
        self.bpm = None
        
    def analyze(self):
        """Analyze audio file to extract basic information"""
        try:
            # Load audio file
            self.audio_data, self.sample_rate = librosa.load(self.input_path, sr=None, mono=False)
            
            # If stereo, convert to mono for analysis
            if len(self.audio_data.shape) > 1:
                audio_mono = librosa.to_mono(self.audio_data)
            else:
                audio_mono = self.audio_data
            
            # Detect BPM
            tempo, _ = librosa.beat.beat_track(y=audio_mono, sr=self.sample_rate)
            self.bpm = float(tempo)
            
            # Get duration
            self.duration = librosa.get_duration(y=audio_mono, sr=self.sample_rate)
            
            return {
                'bpm': round(self.bpm, 2),
                'duration': round(self.duration, 2),
                'sample_rate': self.sample_rate
            }
        
        except Exception as e:
            logger.error(f"Analysis error: {str(e)}")
            raise
    
    def pitch_shift_to_tuning(self, audio, current_tuning=440, target_tuning=432):
        """
        Shift pitch to match target tuning
        """
        # Calculate the pitch shift in semitones
        # Formula: semitones = 12 * log2(target_freq / current_freq)
        semitones = 12 * np.log2(target_tuning / current_tuning)
        
        # Apply pitch shift
        shifted_audio = pyrb.pitch_shift(audio, self.sample_rate, semitones)
        
        return shifted_audio
    
    def change_tempo(self, audio, tempo_adjustment_percent):
        """
        Change tempo without affecting pitch
        tempo_adjustment_percent: percentage change (positive to speed up, negative to slow down)
        """
        if tempo_adjustment_percent == 0:
            return audio
        
        # Calculate rate
        # If tempo_adjustment is -10%, rate should be 0.9 (slower)
        # If tempo_adjustment is +10%, rate should be 1.1 (faster)
        rate = 1 + (tempo_adjustment_percent / 100)
        
        # Apply time stretching
        stretched_audio = pyrb.time_stretch(audio, self.sample_rate, rate)
        
        return stretched_audio
    
    def generate_binaural_beat(self, duration, base_freq, beat_freq, sample_rate):
        """
        Generate binaural beat
        duration: in seconds
        base_freq: base frequency (e.g., 200 Hz)
        beat_freq: desired binaural beat frequency (e.g., 10 Hz for Alpha)
        """
        t = np.linspace(0, duration, int(sample_rate * duration))
        
        # Left channel: base frequency
        left = np.sin(2 * np.pi * base_freq * t)
        
        # Right channel: base frequency + beat frequency
        right = np.sin(2 * np.pi * (base_freq + beat_freq) * t)
        
        # Combine into stereo
        binaural = np.vstack([left, right])
        
        return binaural
    
    def add_binaural_beat(self, audio, beat_type='alpha', volume_percent=30):
        """
        Add binaural beat to audio
        """
        # Define binaural beat frequencies
        beat_frequencies = {
            'delta': 2,    # 0.5-4 Hz
            'theta': 6,    # 4-8 Hz
            'alpha': 10,   # 8-14 Hz
            'beta': 18,    # 14-30 Hz
            'gamma': 40    # 30-100 Hz
        }
        
        beat_freq = beat_frequencies.get(beat_type, 10)
        base_freq = 200  # Base carrier frequency
        
        # Get duration
        if len(audio.shape) > 1:
            duration = audio.shape[1] / self.sample_rate
        else:
            duration = len(audio) / self.sample_rate
        
        # Generate binaural beat
        binaural = self.generate_binaural_beat(duration, base_freq, beat_freq, self.sample_rate)
        
        # Normalize volume
        volume_factor = volume_percent / 100
        binaural = binaural * volume_factor
        
        # Ensure audio is stereo
        if len(audio.shape) == 1:
            audio = np.vstack([audio, audio])
        
        # Mix binaural beat with audio
        # Ensure same length
        min_length = min(audio.shape[1], binaural.shape[1])
        audio = audio[:, :min_length]
        binaural = binaural[:, :min_length]
        
        # Mix
        mixed_audio = audio + binaural
        
        # Normalize to prevent clipping
        max_val = np.max(np.abs(mixed_audio))
        if max_val > 1.0:
            mixed_audio = mixed_audio / max_val
        
        return mixed_audio
    
    def process(self, tuning=432, tempo_adjustment=0, target_frequency=528,
                binaural_enabled=False, binaural_type='alpha', binaural_volume=30,
                output_path=None, output_format='mp3'):
        """
        Main processing function
        """
        try:
            # Load audio if not already loaded
            if self.audio_data is None:
                self.audio_data, self.sample_rate = librosa.load(self.input_path, sr=None, mono=False)
            
            audio = self.audio_data.copy()
            
            # Convert to mono for processing, then back to stereo
            if len(audio.shape) > 1:
                audio_mono = librosa.to_mono(audio)
            else:
                audio_mono = audio
            
            # Apply pitch shift for tuning
            if tuning != 440:
                logger.info(f"Applying pitch shift from 440 Hz to {tuning} Hz")
                audio_mono = self.pitch_shift_to_tuning(audio_mono, 440, tuning)
            
            # Apply tempo change
            if tempo_adjustment != 0:
                logger.info(f"Applying tempo adjustment: {tempo_adjustment}%")
                audio_mono = self.change_tempo(audio_mono, tempo_adjustment)
            
            # Convert back to stereo
            audio_stereo = np.vstack([audio_mono, audio_mono])
            
            # Add binaural beats if enabled
            if binaural_enabled:
                logger.info(f"Adding binaural beats: {binaural_type} waves")
                audio_stereo = self.add_binaural_beat(audio_stereo, binaural_type, binaural_volume)
            
            # Ensure output path
            if output_path is None:
                output_path = os.path.join(
                    os.path.dirname(self.input_path),
                    f"processed_{os.path.basename(self.input_path)}"
                )
            
            # Export audio
            logger.info(f"Exporting to {output_path}")
            
            # Transpose for soundfile (channels last)
            audio_export = audio_stereo.T
            
            # Save as WAV first (lossless)
            temp_wav = output_path.rsplit('.', 1)[0] + '.wav'
            sf.write(temp_wav, audio_export, self.sample_rate)
            
            # Convert to desired format if not WAV
            if output_format.lower() != 'wav':
                audio_segment = AudioSegment.from_wav(temp_wav)
                
                # Export with appropriate settings
                if output_format.lower() == 'mp3':
                    audio_segment.export(output_path, format='mp3', bitrate='320k')
                elif output_format.lower() == 'mp3-192':
                    audio_segment.export(output_path, format='mp3', bitrate='192k')
                else:
                    audio_segment.export(output_path, format=output_format)
                
                # Remove temp WAV file
                if os.path.exists(temp_wav) and temp_wav != output_path:
                    os.remove(temp_wav)
            else:
                # If WAV is the desired format, rename temp file
                if temp_wav != output_path:
                    os.rename(temp_wav, output_path)
            
            logger.info("Processing complete")
            return output_path
        
        except Exception as e:
            logger.error(f"Processing error: {str(e)}")
            raise
