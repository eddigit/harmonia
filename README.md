# Harmonia - Application Web de Transformation Audio Thérapeutique

## 🌟 Vue d'ensemble

Harmonia est une application web innovante conçue pour transformer vos créations musicales en y intégrant des fréquences thérapeutiques et des effets psychoacoustiques. Basée sur les principes des fréquences de Solfège Sacré et des ondes cérébrales, cette application permet aux DJs, producteurs musicaux et sonothérapeutes de créer des expériences audio personnalisées et intentionnelles.

## ✨ Fonctionnalités Principales

- **Upload et Analyse Audio** : Support des formats MP3, WAV, FLAC, AAC
- **Questionnaire d'Intention** : Interface intuitive pour définir l'objectif thérapeutique
- **Personnalisation Avancée** :
  - Accordage fréquentiel (432Hz, 440Hz, 528Hz, etc.)
  - Ajustement du tempo (BPM)
  - Intégration de battements binauraux (Delta, Theta, Alpha, Beta, Gamma)
- **Transformation en Temps Réel** : Pré-écoute des modifications
- **Export de Qualité** : Formats MP3 et WAV avec différents niveaux de qualité
- **Base de Connaissances** : Documentation complète sur les fréquences thérapeutiques

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v16 ou supérieur)
- Python 3.8+
- npm ou yarn

### Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd harmonia
   ```

2. **Backend Node.js**
   ```bash
   cd harmonia-backend
   npm install
   npm start
   ```
   Le serveur démarre sur http://localhost:3001

3. **Frontend React**
   ```bash
   cd harmonia-frontend
   npm install
   npm start
   ```
   L'application démarre sur http://localhost:3000

4. **Processeur Audio Python** (optionnel pour le développement)
   ```bash
   cd harmonia-audio-processor
   pip install -r requirements.txt
   ```

## 📁 Structure du Projet

```
harmonia/
├── harmonia-frontend/          # Application React
│   ├── src/
│   │   ├── components/         # Composants React
│   │   ├── App.js             # Composant principal
│   │   └── index.js           # Point d'entrée
│   └── package.json
├── harmonia-backend/           # API Node.js/Express
│   ├── server.js              # Serveur principal
│   ├── uploads/               # Fichiers uploadés
│   └── outputs/               # Fichiers transformés
└── harmonia-audio-processor/   # Scripts Python de traitement
    ├── analyze_audio.py       # Analyse des fichiers audio
    ├── transform_audio.py     # Transformation audio
    └── requirements.txt       # Dépendances Python
```

## 🛠 Technologies Utilisées

### Frontend
- **React 18** - Interface utilisateur moderne
- **CSS3** - Design responsive et animations fluides
- **React Dropzone** - Upload de fichiers par glisser-déposer

### Backend
- **Node.js/Express** - API REST robuste
- **Multer** - Gestion des uploads de fichiers
- **Python Shell** - Intégration avec les scripts Python

### Traitement Audio
- **Python** - Langage principal pour le traitement
- **Librosa** - Analyse audio avancée (BPM, tonalité)
- **PyDub** - Manipulation audio haute performance
- **SoundFile** - Export audio de qualité

## 🎯 Parcours Utilisateur

1. **Upload** : L'utilisateur importe son fichier audio
2. **Analyse** : Le système analyse automatiquement le BPM, la tonalité et les caractéristiques
3. **Intention** : Questionnaire guidé pour définir l'objectif thérapeutique
4. **Personnalisation** : Interface de contrôle pour affiner les paramètres
5. **Pré-écoute** : Test en temps réel des modifications
6. **Export** : Téléchargement du fichier transformé

## 🔧 Configuration Avancée

### Variables d'environnement

Créer un fichier `.env` dans le dossier backend :

```env
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=104857600
```

### Formats Audio Supportés

- **MP3** : Compression avec perte, taille réduite
- **WAV** : Qualité sans perte, fichiers volumineux
- **FLAC** : Compression sans perte, haute qualité
- **AAC** : Format moderne, bonne compression

## 📚 Base de Connaissances Intégrée

L'application inclut une documentation complète sur :

- **Fréquences Solfège Sacré** (174Hz à 963Hz)
- **Ondes Cérébrales** (Delta, Theta, Alpha, Beta, Gamma)
- **Accordages Thérapeutiques** (432Hz, 440Hz, 528Hz)
- **Applications Pratiques** pour différents objectifs

## 🚧 Développement

### Ajout de Nouvelles Fonctionnalités

1. Créer une branche feature
2. Développer la fonctionnalité
3. Tester avec des fichiers audio de test
4. Soumettre une Pull Request

### Tests

```bash
# Frontend
cd harmonia-frontend
npm test

# Linting
npm run lint
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🙏 Remerciements

- **Communauté Open Source** pour les librairies utilisées
- **Chercheurs en Sonothérapie** pour les connaissances sur les fréquences
- **Équipe de Développement** pour leur dévouement

---

**Harmonia** - Transformez votre musique, touchez les âmes 🎵✨