### Harmonia – Application Web de Transformation Audio (MVP)

Cette version met en place un backend FastAPI pour le traitement audio (pitch, tempo, battements binauraux, preview) et un frontend React (Vite + Tailwind) pour le flux en 4 étapes: Upload → Intention → Personnaliser → Exporter.

### Prérequis
- Node.js 18+
- Python 3.10+ (avec `venv` et compilateurs nécessaires pour `librosa` / `soundfile`)

### Backend (FastAPI)
1) Créer l'environnement Python et installer les dépendances:
```bash
python3 -m venv .venv
. .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r backend/requirements.txt
```
2) Lancer l'API:
```bash
uvicorn backend.app.main:app --reload --port 8000
```
3) Endpoints clés:
- `POST /api/upload`: upload + analyse (durée, BPM)
- `POST /api/preset`: génère un preset à partir de l'intention
- `POST /api/process`: applique pitch/tempo/binaural (option `preview_seconds`)
- `GET  /api/download/{job_id}`: récupère l'audio transformé
- `GET  /api/original/{file_id}`: sert le fichier original

Dossiers:
- `backend/data/uploads` et `backend/data/outputs`

### Frontend (Vite + React + Tailwind)
1) Installer les dépendances:
```bash
cd frontend
npm install
```
2) Lancer le serveur de dev:
```bash
npm run dev
```
Par défaut, l'app attend l'API sur `http://localhost:8000`. Vous pouvez définir `VITE_API_BASE` dans un fichier `.env` du frontend.

### Notes audio
- Le traitement utilise `librosa` + `soundfile`. Le pitch/tempo est de qualité MVP. Pour une meilleure qualité, intégrer Rubber Band (`pyrubberband`) ou `soundstretch` à l'avenir.
- Les battements binauraux sont générés et mixés en stéréo avec fondu d'attaque/relâchement simples.

### Roadmap prochaine
- Export MP3 final et options de bitrate
- Presets enrichis et UX A/B instantané
- Authentification et gestion d'abonnements (premium)
