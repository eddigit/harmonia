# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-10-05

### ✨ Ajouté

#### Frontend
- Interface utilisateur complète avec React 18 et Vite
- Page d'accueil avec upload drag-and-drop
- Questionnaire d'intention en 2 étapes avec 4 catégories principales
- Panneau de contrôle avec réglages audio avancés
- Visualisation de forme d'onde avec WaveSurfer.js
- Base de connaissances interactive avec informations sur :
  - Fréquences du Solfège Sacré (174-963 Hz)
  - Ondes cérébrales (Delta, Theta, Alpha, Beta, Gamma)
  - Accordages (432 Hz, 440 Hz, 444 Hz)
  - Guide pratique d'utilisation
- Design system personnalisé avec Tailwind CSS
- Animations et transitions fluides
- Interface responsive mobile-first
- Support de 12 préréglages d'intention prédéfinis

#### Backend
- API REST Flask pour traitement audio
- Module de traitement audio avec :
  - Pitch shifting vers différents accordages (430-450 Hz)
  - Time stretching pour modification du tempo (-20% à +20%)
  - Génération de battements binauraux (5 types d'ondes)
  - Analyse audio (détection BPM, durée)
- Support de multiples formats audio :
  - Input : MP3, WAV, FLAC, AAC, M4A
  - Output : MP3 (320k, 192k), WAV
- Système de validation des fichiers
- Gestion automatique du stockage temporaire
- Logging et gestion d'erreurs

#### Infrastructure
- Configuration Docker Compose pour développement
- Dockerfiles pour frontend et backend
- Script de setup automatique (setup.sh)
- Configuration Nginx pour production
- Variables d'environnement pour tous les environnements

#### Documentation
- README complet en français
- Guide des fréquences thérapeutiques (FREQUENCIES.md)
- Guide de déploiement (DEPLOYMENT.md)
- Documentation API complète (API.md)
- Guide de contribution (CONTRIBUTING.md)
- Changelog

#### Qualité du Code
- Fichier .gitignore complet
- Structure de projet organisée
- Licence MIT
- Icon et assets de base

### 🎵 Fréquences Supportées

**Solfège Sacré :**
- 174 Hz - Soulagement de la douleur
- 285 Hz - Régénération cellulaire
- 396 Hz - Libération des peurs
- 417 Hz - Facilitation du changement
- 528 Hz - Transformation et amour
- 639 Hz - Harmonisation des relations
- 741 Hz - Expression et intuition
- 852 Hz - Vision spirituelle
- 963 Hz - Conscience universelle

**Ondes Cérébrales :**
- Delta (2 Hz) - Sommeil profond
- Theta (6 Hz) - Méditation profonde
- Alpha (10 Hz) - Relaxation éveillée
- Beta (18 Hz) - Concentration
- Gamma (40 Hz) - Conscience supérieure

### 🎯 Intentions Prédéfinies

**Guérison et Récupération (3) :**
- Soulagement de la douleur
- Régénération cellulaire
- Sommeil profond

**Bien-être et Équilibre (4) :**
- Libération des peurs
- Harmonisation des relations
- Relaxation consciente
- Réduction du stress

**Énergie et Motivation (3) :**
- Concentration intense
- Stimulation créative
- Euphorie et joie

**Exploration Spirituelle (2) :**
- Développement de l'intuition
- Conscience supérieure

### 🔧 Configuration

- Taille maximale de fichier : 100 Mo
- Formats d'entrée : MP3, WAV, FLAC, AAC
- Formats de sortie : MP3 320k, MP3 192k, WAV
- Accordages : 430-450 Hz (avec presets 432, 440, 444)
- Ajustement tempo : -20% à +20%
- Volume battements binauraux : 0-100%

### 📦 Dépendances Principales

**Frontend :**
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.3.5
- WaveSurfer.js 7.4.0
- Axios 1.6.0
- Lucide React 0.292.0

**Backend :**
- Flask 3.0.0
- Librosa 0.10.1
- PyRubberBand 0.3.0
- Pydub 0.25.1
- NumPy 1.24.3
- SciPy 1.11.4

### 🚀 Performance

- Temps de traitement : ~10-30s pour 5 minutes d'audio
- Pré-écoute quasi-instantanée
- Support de fichiers jusqu'à 100 Mo
- Responsive < 1s sur interactions UI

---

## [À venir]

### Version 1.1.0 (Q1 2026)

#### Planifié
- [ ] Authentification utilisateur
- [ ] Sauvegarde des préréglages personnels
- [ ] Historique des transformations
- [ ] Amélioration détection de tonalité
- [ ] Support de plus de formats (OGG, OPUS)
- [ ] Mode sombre
- [ ] Internationalisation (EN, ES)
- [ ] Prévisualisation avant/après améliorée

### Version 2.0.0 (Q3 2026)

#### En réflexion
- [ ] Isolation de pistes par IA
- [ ] Harmonisation multi-fréquences
- [ ] Mode batch (traitement multiple)
- [ ] API publique avec authentification
- [ ] Webhooks pour notifications
- [ ] Application mobile (React Native)
- [ ] Plugin VST/AU pour DAW
- [ ] Abonnements Premium
- [ ] Intégration Spotify/SoundCloud

---

## Notes de Version

### Comment lire ce changelog

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités bientôt supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités

---

## Contributeurs

Merci à tous les contributeurs qui ont participé à ce projet !

---

**Pour plus d'informations, consultez le [README.md](README.md)**
