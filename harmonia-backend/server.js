const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const { PythonShell } = require('python-shell');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limite
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers audio sont autorisés'));
    }
  }
});

// Créer le dossier uploads s'il n'existe pas
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API Harmonia - Transformation Audio Thérapeutique',
    version: '1.0.0'
  });
});

// Route d'upload
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' });
  }

  // Analyser le fichier avec Python
  const options = {
    mode: 'text',
    pythonPath: path.join(__dirname, '../harmonia-audio-processor/venv/bin/python3') || 'python3',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, '../harmonia-audio-processor'),
    args: [req.file.path, req.file.filename]
  };

  PythonShell.run('analyze_audio.py', options, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'analyse audio:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'analyse du fichier' });
    }

    const analysis = JSON.parse(results[0]);
    res.json({
      message: 'Fichier uploadé et analysé avec succès',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: req.file.path
      },
      analysis: analysis
    });
  });
});

// Route de transformation audio
app.post('/transform', (req, res) => {
  const { filename, settings } = req.body;

  if (!filename || !settings) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  const inputPath = path.join(__dirname, 'uploads', filename);
  const outputFilename = `transformed-${Date.now()}-${filename}`;
  const outputPath = path.join(__dirname, 'outputs', outputFilename);

  // Créer le dossier outputs s'il n'existe pas
  if (!fs.existsSync('outputs')) {
    fs.mkdirSync('outputs');
  }

  const options = {
    mode: 'text',
    pythonPath: path.join(__dirname, '../harmonia-audio-processor/venv/bin/python3') || 'python3',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, '../harmonia-audio-processor'),
    args: [inputPath, outputPath, JSON.stringify(settings)]
  };

  PythonShell.run('transform_audio.py', options, (err, results) => {
    if (err) {
      console.error('Erreur lors de la transformation:', err);
      return res.status(500).json({ error: 'Erreur lors de la transformation audio' });
    }

    res.json({
      message: 'Transformation réussie',
      outputFile: outputFilename,
      downloadUrl: `/download/${outputFilename}`
    });
  });
});

// Route de téléchargement
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'outputs', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Fichier non trouvé' });
  }
});

// Route pour obtenir les presets de fréquences
app.get('/presets', (req, res) => {
  const presets = {
    "guérison": {
      "174": { frequency: 174, description: "Soulager la douleur physique" },
      "285": { frequency: 285, description: "Régénération cellulaire" },
      "delta": { frequency: "1-3", waveType: "delta", description: "Sommeil profond" }
    },
    "bien-être": {
      "396": { frequency: 396, description: "Libérer les peurs" },
      "528": { frequency: 528, description: "Réduire le stress" },
      "639": { frequency: 639, description: "Harmoniser les relations" },
      "alpha": { frequency: "8-12", waveType: "alpha", description: "Relaxation éveillée" }
    },
    "énergie": {
      "417": { frequency: 417, description: "Stimuler la créativité" },
      "528": { frequency: 528, description: "Euphorie et joie" },
      "beta": { frequency: "16-18", waveType: "beta", description: "Concentration" },
      "gamma": { frequency: "30-100", waveType: "gamma", description: "Performance" }
    },
    "spirituel": {
      "741": { frequency: 741, description: "Développer l'intuition" },
      "852": { frequency: 852, description: "Intuition avancée" },
      "963": { frequency: 963, description: "Conscience supérieure" }
    }
  };

  res.json(presets);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Harmonia démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
});