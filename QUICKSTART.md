# 🚀 Quick Start Guide - Harmonia

Démarrez avec Harmonia en moins de 5 minutes !

---

## ⚡ Option 1 : Démarrage Rapide avec Script

La méthode la plus simple pour commencer :

```bash
# 1. Cloner le projet
git clone https://github.com/your-org/harmonia.git
cd harmonia

# 2. Exécuter le script de setup
chmod +x setup.sh
./setup.sh

# 3. Démarrer le backend
cd backend
source venv/bin/activate
python run.py

# 4. Dans un nouveau terminal, démarrer le frontend
cd frontend
npm run dev
```

✅ **C'est tout !** Ouvrez http://localhost:3000 dans votre navigateur.

---

## 🐳 Option 2 : Avec Docker (Encore plus simple)

Si vous avez Docker installé :

```bash
# 1. Cloner le projet
git clone https://github.com/your-org/harmonia.git
cd harmonia

# 2. Démarrer avec Docker Compose
docker-compose up
```

✅ **Terminé !** L'application sera accessible sur http://localhost:3000

---

## 📝 Option 3 : Installation Manuelle

### Prérequis
- Node.js 18+ et npm
- Python 3.9+
- FFmpeg et Rubberband

### Installation des dépendances système

**Ubuntu/Debian :**
```bash
sudo apt-get update
sudo apt-get install -y libsndfile1 ffmpeg rubberband-cli
```

**macOS :**
```bash
brew install libsndfile ffmpeg rubberband
```

### Installation Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend démarré sur http://localhost:3000

### Installation Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
mkdir -p uploads outputs
python run.py
```

Backend démarré sur http://localhost:5000

---

## 🎵 Premiers Pas

### 1. Uploader un fichier audio

1. Glissez-déposez un fichier MP3, WAV, FLAC ou AAC
2. Ou cliquez sur "Parcourir les fichiers"
3. Taille max : 100 Mo

### 2. Définir votre intention

**Étape 1** - Choisissez votre objectif :
- 🫀 Guérison et Récupération
- ✨ Bien-être et Équilibre
- ⚡ Énergie et Motivation
- 👁️ Exploration Spirituelle

**Étape 2** - Affinez votre intention spécifique

### 3. Ajuster les paramètres (optionnel)

Le préréglage automatique est déjà optimal, mais vous pouvez :
- Modifier l'accordage (432 Hz, 440 Hz, 444 Hz)
- Ajuster le tempo (-20% à +20%)
- Activer/désactiver les battements binauraux
- Changer le type d'onde cérébrale
- Ajuster le volume des battements

### 4. Transformer et télécharger

1. Cliquez sur "Appliquer la Transformation"
2. Attendez quelques secondes (10-30s pour 5 min d'audio)
3. Pré-écoutez le résultat
4. Cliquez sur "Télécharger"
5. Choisissez votre format (MP3 ou WAV)

---

## 🎓 Exemples d'Usage

### Exemple 1 : Musique de Méditation

**Objectif :** Créer une musique pour méditation profonde

```
1. Upload : Votre morceau ambient/chill
2. Objectif : Bien-être et Équilibre
3. Intention : Relaxation consciente
4. Paramètres auto :
   - Accordage : 432 Hz
   - Tempo : -10%
   - Battements : Ondes Alpha (10 Hz)
5. Transformer et télécharger
```

### Exemple 2 : Musique pour Concentration

**Objectif :** Musique pour étudier/travailler

```
1. Upload : Votre playlist lofi/instrumental
2. Objectif : Énergie et Motivation
3. Intention : Concentration intense
4. Paramètres auto :
   - Accordage : 440 Hz
   - Tempo : +5%
   - Battements : Ondes Beta (18 Hz)
5. Transformer et télécharger
```

### Exemple 3 : Musique pour Sommeil

**Objectif :** Faciliter l'endormissement

```
1. Upload : Musique douce/nature sounds
2. Objectif : Guérison et Récupération
3. Intention : Sommeil profond et réparateur
4. Paramètres auto :
   - Accordage : 432 Hz
   - Tempo : -20%
   - Battements : Ondes Delta (2 Hz)
5. Transformer et télécharger
```

---

## 🔍 Explorer la Base de Connaissances

Cliquez sur "Base de connaissances" en haut à droite pour découvrir :

### 📖 Onglet Solfège Sacré
Découvrez les 9 fréquences thérapeutiques et leurs effets spécifiques.

### 🧠 Onglet Ondes Cérébrales
Apprenez comment les battements binauraux influencent votre état mental.

### 🎼 Onglet Accordages
Comprenez la différence entre 432 Hz, 440 Hz et 444 Hz.

### 💡 Onglet Guide Pratique
Obtenez des recommandations précises selon votre objectif.

---

## ❓ FAQ Rapide

### Q : Quel format de fichier dois-je utiliser ?
**R :** MP3, WAV, FLAC ou AAC. MP3 320kbps ou WAV pour la meilleure qualité.

### Q : Combien de temps prend la transformation ?
**R :** 10-30 secondes pour un fichier de 5 minutes.

### Q : Puis-je transformer plusieurs fichiers ?
**R :** Pour l'instant, un fichier à la fois. Le mode batch arrivera en v1.1.

### Q : Les effets sont-ils vraiment réels ?
**R :** Les fréquences thérapeutiques et battements binauraux sont étudiés scientifiquement. Les effets varient selon les personnes.

### Q : Puis-je utiliser un casque ?
**R :** Oui ! Un casque est même recommandé pour les battements binauraux (effet stéréo).

### Q : C'est gratuit ?
**R :** Oui, le MVP est totalement gratuit. Un modèle premium sera introduit plus tard.

---

## 🎯 Conseils pour Débuter

### ✅ DO
- Utilisez un casque pour une meilleure expérience
- Commencez avec les préréglages automatiques
- Expérimentez avec différentes intentions
- Notez vos ressentis après chaque écoute
- Lisez la base de connaissances

### ❌ DON'T
- N'augmentez pas trop le volume des battements binauraux au début
- N'utilisez pas d'ondes Delta en conduisant (sommeil)
- Ne transformez pas de fichiers protégés par droits d'auteur
- N'attendez pas de miracles instantanés

---

## 🐛 Problèmes Courants

### Le fichier ne s'uploade pas
- Vérifiez le format (MP3, WAV, FLAC, AAC)
- Vérifiez la taille (< 100 Mo)
- Essayez avec un autre navigateur

### La transformation est lente
- Normal pour des fichiers longs
- Vérifiez votre connexion internet
- Attendez quelques secondes de plus

### Le son est distordu
- Réduisez le volume des battements binauraux
- Essayez un ajustement de tempo moins important
- Vérifiez votre fichier source

### L'interface ne charge pas
- Vérifiez que le backend est démarré (http://localhost:5000/api/health)
- Vérifiez que le frontend est démarré (http://localhost:3000)
- Rechargez la page

---

## 📚 Ressources Supplémentaires

### Documentation
- [README complet](README.md)
- [Guide des fréquences](docs/FREQUENCIES.md)
- [Documentation API](docs/API.md)
- [Guide de déploiement](docs/DEPLOYMENT.md)

### Support
- GitHub Issues : https://github.com/your-org/harmonia/issues
- Documentation en ligne : https://harmonia.app/docs

---

## 🎉 Prêt à Commencer !

Vous avez maintenant tout ce qu'il faut pour utiliser Harmonia !

**N'oubliez pas :** L'objectif d'Harmonia est d'enrichir votre expérience musicale et de vous aider à atteindre des états de conscience spécifiques. Expérimentez, explorez, et trouvez ce qui fonctionne le mieux pour vous !

---

## 💡 Pro Tips

1. **Créez des playlists thématiques** : Une pour méditation, une pour travail, une pour sommeil
2. **Combinez avec d'autres pratiques** : Yoga, respiration, journaling
3. **Utilisez régulièrement** : Les effets s'amplifient avec le temps
4. **Partagez vos créations** : Avec votre communauté (avec permission)
5. **Tenez un journal** : Notez les effets de chaque fréquence sur vous

---

**Bon voyage sonore avec Harmonia ! 🎵✨**

Des questions ? Consultez la [FAQ complète](docs/FAQ.md) ou ouvrez une issue sur GitHub.
