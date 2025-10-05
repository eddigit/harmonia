#!/usr/bin/env python3
"""
Script de transformation audio pour Harmonia
Applique les transformations demandées (pitch, tempo, fréquences thérapeutiques)
"""

import sys
import json
import os
import numpy as np
from pydub import AudioSegment
from pydub.effects import normalize
import librosa
import soundfile as sf

def transform_audio(input_path, output_path, settings):
    """
    Transforme un fichier audio selon les paramètres fournis
    """
    try:
        # Charger le fichier audio
        audio = AudioSegment.from_file(input_path)

        # Appliquer les transformations selon les paramètres
        transformed_audio = audio

        # 1. Ajustement du pitch (accordage)
        if 'tuning' in settings:
            tuning = settings['tuning']
            if tuning != 440:  # Si différent du standard 440Hz
                # Calcul du ratio de changement de pitch
                pitch_ratio = tuning / 440.0

                # Appliquer le pitch shift avec librosa
                y, sr = librosa.load(input_path, sr=None)

                # Calculer le nouveau nombre d'échantillons après pitch shift
                y_shifted = librosa.effects.pitch_shift(y, sr=sr, n_steps=12 * np.log2(pitch_ratio))

                # Sauvegarder temporairement
                temp_path = input_path.replace('.mp3', '_temp.wav').replace('.wav', '_temp.wav')
                sf.write(temp_path, y_shifted, sr)

                # Recharger avec pydub
                transformed_audio = AudioSegment.from_file(temp_path)

                # Nettoyer le fichier temporaire
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        # 2. Ajustement du tempo (BPM)
        if 'tempo' in settings:
            target_bpm = settings['tempo']
            original_bpm = settings.get('original_bpm', 120)  # Défaut si non fourni

            if target_bpm != original_bpm:
                tempo_ratio = target_bpm / original_bpm

                # Appliquer le changement de tempo
                y, sr = librosa.load(input_path if 'tuning' not in settings else temp_path, sr=None)

                # Time stretching avec librosa
                y_stretched = librosa.effects.time_stretch(y, rate=tempo_ratio)

                # Sauvegarder temporairement pour le traitement suivant
                temp_path = input_path.replace('.mp3', '_temp_stretch.wav').replace('.wav', '_temp_stretch.wav')
                sf.write(temp_path, y_stretched, sr)

                transformed_audio = AudioSegment.from_file(temp_path)

                # Nettoyer
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        # 3. Ajout de battements binauraux (optionnel)
        if settings.get('add_binaural_beats', False):
            binaural_settings = settings.get('binaural_beats', {})
            target_frequency = binaural_settings.get('frequency', 8)  # Hz

            # Générer les battements binauraux
            transformed_audio = add_binaural_beats(transformed_audio, target_frequency,
                                                 volume_ratio=binaural_settings.get('volume', 0.3))

        # 4. Normalisation finale
        transformed_audio = normalize(transformed_audio)

        # 5. Exporter le résultat
        # Déterminer le format d'export depuis les settings ou utiliser le format d'origine
        export_format = settings.get('export_format', 'mp3')
        export_bitrate = settings.get('export_bitrate', '320k')

        if export_format == 'mp3':
            transformed_audio.export(output_path, format='mp3',
                                   bitrate=export_bitrate.replace('k', ''))
        elif export_format == 'wav':
            transformed_audio.export(output_path, format='wav')
        else:
            # Format par défaut
            transformed_audio.export(output_path, format='mp3', bitrate='320')

        return {
            'success': True,
            'output_path': output_path,
            'duration': len(transformed_audio) / 1000.0,
            'settings_applied': settings
        }

    except Exception as e:
        return {
            'success': False,
            'error': f'Erreur lors de la transformation: {str(e)}'
        }

def add_binaural_beats(audio, target_frequency, volume_ratio=0.3, duration_ms=None):
    """
    Ajoute des battements binauraux à un fichier audio
    """
    try:
        # Si aucune durée spécifiée, utiliser la durée de l'audio
        if duration_ms is None:
            duration_ms = len(audio)

        # Paramètres des battements binauraux
        sample_rate = audio.frame_rate
        left_frequency = 200  # Fréquence de base pour l'oreille gauche
        right_frequency = 200 + target_frequency  # Fréquence pour l'oreille droite

        # Générer les ondes sinusoïdales
        duration_seconds = duration_ms / 1000.0
        t = np.linspace(0, duration_seconds, int(sample_rate * duration_seconds), False)

        # Générer les deux canaux
        left_channel = np.sin(2 * np.pi * left_frequency * t)
        right_channel = np.sin(2 * np.pi * right_frequency * t)

        # Combiner en stéréo
        binaural_beats = np.column_stack((left_channel, right_channel))

        # Normaliser et ajuster le volume
        binaural_beats = binaural_beats * volume_ratio

        # Créer un AudioSegment à partir des battements binauraux
        # Convertir en 16-bit PCM
        binaural_beats_int16 = (binaural_beats * 32767).astype(np.int16)

        # Créer l'audio des battements binauraux
        binaural_audio = AudioSegment(
            binaural_beats_int16.tobytes(),
            frame_rate=sample_rate,
            sample_width=2,  # 16-bit
            channels=2
        )

        # Ajuster la durée si nécessaire
        if len(binaural_audio) > duration_ms:
            binaural_audio = binaural_audio[:duration_ms]
        elif len(binaural_audio) < duration_ms:
            # Répéter si trop court (simplification)
            silence = AudioSegment.silent(duration=duration_ms - len(binaural_audio))
            binaural_audio += silence

        # Mélanger avec l'audio original
        # Baisser légèrement le volume de l'audio original pour faire place aux battements
        original_reduced = audio.apply_gain(-3)  # -3dB

        # Mélanger les deux pistes
        combined_audio = original_reduced.overlay(binaural_audio)

        return combined_audio

    except Exception as e:
        print(f"Erreur lors de l'ajout des battements binauraux: {e}", file=sys.stderr)
        return audio  # Retourner l'audio original en cas d'erreur

def get_frequency_settings(intent):
    """
    Retourne les paramètres de fréquence recommandés selon l'intention
    """
    frequency_map = {
        'healing': {'frequency': 174, 'description': 'Soulagement de la douleur'},
        'regeneration': {'frequency': 285, 'description': 'Régénération cellulaire'},
        'sleep': {'frequency': '1-3', 'wave_type': 'delta', 'description': 'Sommeil profond'},
        'relaxation': {'frequency': '8-12', 'wave_type': 'alpha', 'description': 'Relaxation éveillée'},
        'stress_relief': {'frequency': 528, 'description': 'Réduction du stress'},
        'creativity': {'frequency': 417, 'description': 'Stimulation créative'},
        'focus': {'frequency': '16-18', 'wave_type': 'beta', 'description': 'Concentration'},
        'spiritual': {'frequency': 963, 'description': 'Conscience supérieure'}
    }

    return frequency_map.get(intent, {})

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python transform_audio.py <input_path> <output_path> <settings_json>", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    settings = json.loads(sys.argv[3])

    result = transform_audio(input_path, output_path, settings)

    if result['success']:
        print(json.dumps(result))
    else:
        print(json.dumps(result), file=sys.stderr)
        sys.exit(1)