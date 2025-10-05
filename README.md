# Harmonia - Application Web de Transformation Audio

![Harmonia Banner](https://img.shields.io/badge/Harmonia-Audio_Transformation-9b87f5?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

Harmonia est une application web innovante qui permet de transformer vos créations musicales en intégrant des **fréquences thérapeutiques** et des **effets psychoacoustiques** spécifiques. Basée sur les principes du Solfège Sacré, des ondes cérébrales et des fréquences notables comme le 432 Hz, Harmonia offre un outil puissant aux créateurs de contenu audio.

## 🎵 Fonctionnalités Principales

### ✨ Interface Intuitive
- **Upload simple** : Glissez-déposez vos fichiers audio (MP3, WAV, FLAC, AAC)
- **Questionnaire d'intention** : Définissez votre objectif émotionnel ou thérapeutique
- **Préréglages automatiques** : Configuration optimale basée sur votre intention

### 🎛️ Transformations Audio
- **Accordage personnalisé** : Ajustez la fréquence de base (432 Hz, 440 Hz, 444 Hz)
- **Modification du tempo** : Ralentissez ou accélérez votre musique (-20% à +20%)
- **Fréquences du Solfège Sacré** : Intégration de fréquences thérapeutiques (174 Hz à 963 Hz)
- **Battements binauraux** : Génération d'ondes Delta, Theta, Alpha, Beta ou Gamma

### 📚 Base de Connaissances
- Informations détaillées sur les fréquences du Solfège Sacré
- Guide complet des ondes cérébrales
- Explications sur les différents accordages
- Conseils pratiques pour choisir les bonnes fréquences

### 💎 Visualisation et Contrôle
- Visualisation de la forme d'onde en temps réel
- Lecteur audio intégré avec pré-écoute
- Contrôles manuels avancés pour personnalisation
- Export en MP3 ou WAV

## 🏗️ Architecture Technique

### Frontend
- **Framework** : React.js 18 avec Vite
- **Styling** : Tailwind CSS avec design system personnalisé
- **Visualisation** : WaveSurfer.js pour les formes d'onde
- **State Management** : React Hooks
- **Icons** : Lucide React

### Backend
- **Framework** : Flask (Python)
- **Traitement Audio** :
  - `librosa` : Analyse audio (BPM, durée)
  - `pyrubberband` : Time-stretching et pitch-shifting
  - `pydub` : Manipulation audio de haut niveau
  - `soundfile` : Export audio
  - `scipy` : Génération de signaux

### Technologies Audio
- **Pitch Shifting** : Modification de la tonalité sans affecter le tempo
- **Time Stretching** : Modification du tempo sans affecter la tonalité
- **Binaural Beats** : Génération de battements binauraux stéréo
- **Format Support** : MP3, WAV, FLAC, AAC

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ et npm
- Python 3.9+
- pip

### Installation Frontend

```bash
cd frontend
npm install
```

Créez un fichier `.env` :
```bash
cp .env.example .env
```

Démarrez le serveur de développement :
```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

### Installation Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Créez un fichier `.env` :
```bash
cp .env.example .env
```

Démarrez le serveur Flask :
```bash
python run.py
```

Le backend sera accessible sur `http://localhost:5000`

## 📖 Guide d'Utilisation

### 1. Upload de Fichier
- Glissez-déposez votre fichier audio ou cliquez pour parcourir
- Formats supportés : MP3, WAV, FLAC, AAC (max 100 Mo)

### 2. Questionnaire d'Intention
**Étape 1** - Choisissez votre objectif principal :
- 🫀 Guérison et Récupération
- ✨ Bien-être et Équilibre
- ⚡ Énergie et Motivation
- 👁️ Exploration Spirituelle

**Étape 2** - Affinez votre intention spécifique

### 3. Panneau de Contrôle
- Visualisez la forme d'onde de votre audio
- Ajustez les paramètres (accordage, tempo, battements binauraux)
- Pré-écoutez le résultat en temps réel
- Appliquez la transformation

### 4. Export
- Choisissez le format (MP3 320k, MP3 192k, WAV)
- Téléchargez votre création transformée

## 🎯 Cas d'Usage

### Pour les DJs et Producteurs
Créez des sets avec des intentions spécifiques (chill-out, deep meditation, energetic) en intégrant des fréquences thérapeutiques.

### Pour les Sonothérapeutes
Personnalisez des bandes sonores pour vos séances de yoga, méditation ou massage.

### Pour les Créateurs de Contenu
Produisez des contenus audio pour YouTube, podcasts, méditation guidée avec des fréquences optimisées.

### Pour les Musiciens
Explorez les effets des différentes fréquences et accordages sur votre musique.

## 🎨 Design et UX

Harmonia utilise une palette de couleurs apaisantes (violets, bleus, verts pastel) et des animations fluides pour créer une ambiance relaxante en accord avec sa thématique thérapeutique.

### Principes de Design
- **Simplicité** : Interface guidée, l'utilisateur ne se perd jamais
- **Feedback visuel** : Animations et indicateurs de progression
- **Responsive** : Parfaitement utilisable sur mobile et desktop
- **Performance** : Pré-écoute quasi-instantanée

## 🔬 Base Scientifique

### Fréquences du Solfège Sacré
- **174 Hz** : Soulagement de la douleur
- **285 Hz** : Régénération cellulaire
- **396 Hz** : Libération des peurs
- **417 Hz** : Facilitation du changement
- **528 Hz** : Transformation et réparation ADN
- **639 Hz** : Harmonisation des relations
- **741 Hz** : Expression et éveil
- **852 Hz** : Vision spirituelle
- **963 Hz** : Conscience universelle

### Ondes Cérébrales
- **Delta (0.5-4 Hz)** : Sommeil profond, guérison
- **Theta (4-8 Hz)** : Méditation, créativité
- **Alpha (8-14 Hz)** : Relaxation éveillée
- **Beta (14-30 Hz)** : Concentration, éveil
- **Gamma (30-100 Hz)** : Conscience supérieure

## 📝 Roadmap

### Version 1.0 (Actuelle) - MVP
- ✅ Upload et transformation audio de base
- ✅ Questionnaire d'intention
- ✅ Préréglages automatiques
- ✅ Panneau de contrôle manuel
- ✅ Base de connaissances
- ✅ Export MP3/WAV

### Version 1.1 (À venir)
- [ ] Authentification utilisateur
- [ ] Sauvegarde des préréglages personnels
- [ ] Historique des transformations
- [ ] Amélioration de la détection de tonalité
- [ ] Support de plus de formats audio

### Version 2.0 (Future)
- [ ] Isolation de pistes par IA
- [ ] Harmonisation multi-fréquences
- [ ] Mode batch (traitement multiple)
- [ ] API publique
- [ ] Application mobile

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Soumettre des pull requests

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 💬 Support

Pour toute question ou support :
- Ouvrez une issue sur GitHub
- Consultez la base de connaissances intégrée à l'application

## 🙏 Remerciements

Harmonia s'appuie sur des recherches en sonothérapie et psychoacoustique. Merci à la communauté open-source pour les excellentes bibliothèques audio utilisées dans ce projet.

---

**Transformez votre musique, élevez votre conscience** 🎵✨

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react)
