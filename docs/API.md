# API Documentation

Documentation de l'API REST du backend Harmonia.

## Base URL

```
http://localhost:5000/api
```

En production : `https://api.votre-domaine.com/api`

---

## Endpoints

### Health Check

Vérifier l'état du service.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "Harmonia Audio API"
}
```

---

### Upload Audio File

Uploader un fichier audio pour traitement.

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `audio` (file, required) : Fichier audio (MP3, WAV, FLAC, AAC)

**Response:**
```json
{
  "success": true,
  "filename": "my-song.mp3",
  "filepath": "/path/to/uploads/my-song.mp3"
}
```

**Error Responses:**
- `400 Bad Request` : Fichier manquant ou format invalide
- `413 Payload Too Large` : Fichier trop volumineux (> 100 Mo)
- `500 Internal Server Error` : Erreur serveur

---

### Analyze Audio

Analyser un fichier audio pour détecter le BPM et autres métadonnées.

**Endpoint:** `POST /analyze`

**Content-Type:** `application/json`

**Body:**
```json
{
  "filepath": "/path/to/uploads/my-song.mp3"
}
```

**Response:**
```json
{
  "success": true,
  "bpm": 120.5,
  "duration": 245.3,
  "sample_rate": 44100
}
```

**Error Responses:**
- `404 Not Found` : Fichier non trouvé
- `500 Internal Server Error` : Erreur d'analyse

---

### Process Audio

Appliquer les transformations audio (pitch, tempo, battements binauraux).

**Endpoint:** `POST /process`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `audio` (file, required) : Fichier audio à traiter
- `settings` (string, required) : Objet JSON stringifié avec les paramètres

**Settings Object:**
```json
{
  "tuning": 432,
  "tempoAdjustment": -10,
  "targetFrequency": 528,
  "binauralBeatEnabled": true,
  "binauralBeatType": "alpha",
  "binauralBeatVolume": 30,
  "exportFormat": "mp3"
}
```

**Settings Parameters:**

| Parameter | Type | Description | Default | Range/Values |
|-----------|------|-------------|---------|--------------|
| `tuning` | integer | Fréquence d'accordage (La4) | 432 | 430-450 Hz |
| `tempoAdjustment` | integer | Ajustement du tempo en % | 0 | -20 à +20 |
| `targetFrequency` | integer | Fréquence cible (Solfège) | 528 | 174, 285, 396, 417, 528, 639, 741, 852, 963 |
| `binauralBeatEnabled` | boolean | Activer les battements binauraux | false | true/false |
| `binauralBeatType` | string | Type d'onde cérébrale | "alpha" | delta, theta, alpha, beta, gamma |
| `binauralBeatVolume` | integer | Volume des battements en % | 30 | 0-100 |
| `exportFormat` | string | Format d'export | "mp3" | mp3, mp3-192, wav |

**Response:**
```json
{
  "success": true,
  "output_filename": "my-song_harmonia_528Hz.mp3",
  "message": "Audio processed successfully"
}
```

**Error Responses:**
- `400 Bad Request` : Paramètres invalides
- `500 Internal Server Error` : Erreur de traitement

**Processing Time:**
Environ 10-30 secondes pour un fichier de 5 minutes, selon les paramètres.

---

### Download Processed File

Télécharger le fichier audio traité.

**Endpoint:** `GET /download/{filename}`

**Parameters:**
- `filename` (path, required) : Nom du fichier à télécharger

**Response:**
Fichier audio en téléchargement

**Error Responses:**
- `404 Not Found` : Fichier non trouvé

---

## Examples

### cURL

**Upload & Process:**
```bash
curl -X POST http://localhost:5000/api/process \
  -F "audio=@/path/to/song.mp3" \
  -F 'settings={"tuning":432,"tempoAdjustment":-10,"targetFrequency":528,"binauralBeatEnabled":true,"binauralBeatType":"alpha","binauralBeatVolume":30,"exportFormat":"mp3"}'
```

**Download:**
```bash
curl -O http://localhost:5000/api/download/my-song_harmonia_528Hz.mp3
```

### JavaScript (Axios)

```javascript
import axios from 'axios'

// Process audio
const processAudio = async (file, settings) => {
  const formData = new FormData()
  formData.append('audio', file)
  formData.append('settings', JSON.stringify(settings))
  
  try {
    const response = await axios.post('http://localhost:5000/api/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 300000 // 5 minutes
    })
    return response.data
  } catch (error) {
    console.error('Processing failed:', error)
    throw error
  }
}

// Usage
const file = document.getElementById('fileInput').files[0]
const settings = {
  tuning: 432,
  tempoAdjustment: -10,
  targetFrequency: 528,
  binauralBeatEnabled: true,
  binauralBeatType: 'alpha',
  binauralBeatVolume: 30,
  exportFormat: 'mp3'
}

processAudio(file, settings)
  .then(result => {
    console.log('Success:', result)
    // Download the file
    window.location.href = `http://localhost:5000/api/download/${result.output_filename}`
  })
  .catch(error => console.error('Error:', error))
```

### Python

```python
import requests
import json

def process_audio(file_path, settings):
    url = 'http://localhost:5000/api/process'
    
    with open(file_path, 'rb') as f:
        files = {'audio': f}
        data = {'settings': json.dumps(settings)}
        
        response = requests.post(url, files=files, data=data, timeout=300)
        
    return response.json()

# Usage
settings = {
    'tuning': 432,
    'tempoAdjustment': -10,
    'targetFrequency': 528,
    'binauralBeatEnabled': True,
    'binauralBeatType': 'alpha',
    'binauralBeatVolume': 30,
    'exportFormat': 'mp3'
}

result = process_audio('/path/to/song.mp3', settings)
print(result)

# Download
if result['success']:
    download_url = f"http://localhost:5000/api/download/{result['output_filename']}"
    response = requests.get(download_url)
    
    with open(result['output_filename'], 'wb') as f:
        f.write(response.content)
```

---

## Error Handling

Toutes les réponses d'erreur suivent le format :

```json
{
  "error": "Description de l'erreur"
}
```

### Codes HTTP

- `200 OK` : Succès
- `400 Bad Request` : Paramètres invalides
- `404 Not Found` : Ressource non trouvée
- `413 Payload Too Large` : Fichier trop volumineux
- `500 Internal Server Error` : Erreur serveur
- `503 Service Unavailable` : Service temporairement indisponible

---

## Rate Limiting

En production, des limites de taux sont appliquées :
- 100 requêtes par heure par IP
- 10 requêtes par minute pour `/process`

Dépassement de limite : `429 Too Many Requests`

---

## CORS

Le backend accepte les requêtes cross-origin depuis :
- `http://localhost:3000` (développement)
- Votre domaine configuré (production)

---

## File Management

### Upload
Les fichiers uploadés sont stockés temporairement dans `/backend/uploads/`

### Output
Les fichiers traités sont stockés dans `/backend/outputs/`

### Cleanup
Les fichiers sont automatiquement supprimés après 24 heures.

---

## Supported Audio Formats

### Input
- **MP3** : MPEG Audio Layer 3
- **WAV** : Waveform Audio File Format
- **FLAC** : Free Lossless Audio Codec
- **AAC** : Advanced Audio Coding
- **M4A** : MPEG-4 Audio

### Output
- **MP3 320kbps** : Haute qualité avec compression
- **MP3 192kbps** : Qualité standard
- **WAV** : Sans perte, qualité maximale

---

## Performance

### Processing Times (approximate)

| Duration | Standard | With Binaural |
|----------|----------|---------------|
| 3 min | 5-10s | 10-15s |
| 5 min | 10-20s | 20-30s |
| 10 min | 20-40s | 40-60s |

*Times may vary based on server specifications and settings complexity.*

---

## Webhooks (Future Feature)

À venir : Support des webhooks pour les notifications de traitement terminé.

```json
{
  "event": "processing.completed",
  "file_id": "abc123",
  "output_url": "https://...",
  "timestamp": "2025-10-05T10:30:00Z"
}
```

---

## SDK (Future Feature)

À venir : SDKs officiels pour :
- JavaScript/Node.js
- Python
- PHP
- Ruby

---

## Support

Questions sur l'API :
- GitHub Issues
- Documentation : https://github.com/your-org/harmonia
- Email : api@harmonia.app

---

**Version API : 1.0.0**  
**Dernière mise à jour : 5 octobre 2025**
