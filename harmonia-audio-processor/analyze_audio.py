#!/usr/bin/env python3
"""
Script d'analyse audio pour Harmonia
Analyse les caractéristiques d'un fichier audio uploadé
"""

import sys
import json
import os
from pydub import AudioSegment
import librosa
import numpy as np

def analyze_audio(file_path, filename):
    """
    Analyse un fichier audio et retourne ses caractéristiques
    """
    try:
        # Charger le fichier avec pydub pour les métadonnées de base
        audio = AudioSegment.from_file(file_path)

        # Extraire les informations de base
        duration_seconds = len(audio) / 1000.0
        sample_rate = audio.frame_rate
        channels = audio.channels
        format_info = {
            'duration': duration_seconds,
            'sample_rate': sample_rate,
            'channels': channels,
            'bitrate': getattr(audio, 'bitrate', 'unknown')
        }

        # Analyser avec librosa pour des caractéristiques avancées
        try:
            # Charger l'audio avec librosa (convertir en mono pour l'analyse)
            y, sr = librosa.load(file_path, sr=None, mono=True)

            # Détection du BPM
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)

            # Détection de la tonalité
            chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
            key = detect_key(chroma)

            # Analyse du spectre fréquentiel
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)

            advanced_info = {
                'tempo': float(tempo),
                'estimated_key': key,
                'spectral_centroid_mean': float(np.mean(spectral_centroid)),
                'spectral_rolloff_mean': float(np.mean(spectral_rolloff)),
                'rms_energy': float(np.mean(librosa.feature.rms(y=y)))
            }

        except Exception as e:
            print(f"Erreur lors de l'analyse avancée: {e}", file=sys.stderr)
            advanced_info = {'error': 'Analyse avancée non disponible'}

        # Résultat complet
        result = {
            'filename': filename,
            'original_filename': os.path.basename(file_path),
            'format': format_info,
            'analysis': advanced_info,
            'file_size': os.path.getsize(file_path)
        }

        return result

    except Exception as e:
        return {'error': f'Erreur lors de l\'analyse: {str(e)}'}

def detect_key(chroma):
    """
    Détecte la tonalité approximative basée sur les chromagrammes
    """
    try:
        # Liste des notes
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

        # Calculer la moyenne des chromas
        chroma_mean = np.mean(chroma, axis=1)

        # Trouver la note la plus proéminente
        max_index = np.argmax(chroma_mean)
        detected_note = notes[max_index]

        # Déterminer si c'est majeur ou mineur (approximation simple)
        # En pratique, il faudrait une analyse plus sophistiquée
        mode = 'major'  # Simplification

        return f'{detected_note} {mode}'

    except:
        return 'unknown'

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python analyze_audio.py <file_path> <filename>", file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    filename = sys.argv[2]

    result = analyze_audio(file_path, filename)
    print(json.dumps(result, indent=2))