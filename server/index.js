const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(processedDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP3, WAV, FLAC, and AAC files are allowed.'));
    }
  }
});

// Routes
app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      id: uuidv4(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    // Clean up file after 24 hours
    setTimeout(() => {
      fs.remove(req.file.path).catch(console.error);
    }, 24 * 60 * 60 * 1000);

    res.json({ success: true, file: fileInfo });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/process', async (req, res) => {
  try {
    const { fileId, settings } = req.body;
    
    if (!fileId || !settings) {
      return res.status(400).json({ error: 'Missing fileId or settings' });
    }

    // Find the uploaded file
    const files = await fs.readdir(uploadsDir);
    const file = files.find(f => f.includes(fileId));
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const inputPath = path.join(uploadsDir, file);
    const outputPath = path.join(processedDir, `processed-${file}`);

    // Call Python audio processing script
    const pythonProcess = require('child_process').spawn('python3', [
      path.join(__dirname, 'audio_processor.py'),
      inputPath,
      outputPath,
      JSON.stringify(settings)
    ]);

    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process error:', error);
        return res.status(500).json({ error: 'Audio processing failed' });
      }

      // Clean up processed file after 1 hour
      setTimeout(() => {
        fs.remove(outputPath).catch(console.error);
      }, 60 * 60 * 1000);

      res.json({ 
        success: true, 
        processedFile: `processed-${file}`,
        downloadUrl: `/api/download/${encodeURIComponent(`processed-${file}`)}`
      });
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/download/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(processedDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Download failed' });
    }
  });
});

app.get('/api/frequencies', (req, res) => {
  const frequencies = {
    solfeggio: {
      174: { name: "Foundation", description: "Soul healing, pain relief", emotion: "Healing" },
      285: { name: "Quantum Cognition", description: "Tissue regeneration, cell healing", emotion: "Healing" },
      396: { name: "Liberation", description: "Release fear, guilt, trauma", emotion: "Balance" },
      417: { name: "Facilitation", description: "Undo situations, facilitate change", emotion: "Energy" },
      528: { name: "Transformation", description: "DNA repair, love frequency", emotion: "Balance" },
      639: { name: "Connection", description: "Relationships, harmony", emotion: "Balance" },
      741: { name: "Expression", description: "Intuition, self-expression", emotion: "Spiritual" },
      852: { name: "Intuition", description: "Spiritual awakening, inner strength", emotion: "Spiritual" },
      963: { name: "Connection", description: "Connection to universe, divine", emotion: "Spiritual" }
    },
    brainwaves: {
      delta: { range: "1-3 Hz", description: "Deep sleep, healing", emotion: "Healing" },
      theta: { range: "4-7 Hz", description: "Meditation, creativity", emotion: "Balance" },
      alpha: { range: "8-12 Hz", description: "Relaxed awareness", emotion: "Balance" },
      beta: { range: "13-30 Hz", description: "Focus, concentration", emotion: "Energy" },
      gamma: { range: "30-100 Hz", description: "High consciousness", emotion: "Energy" }
    },
    tuning: {
      432: { name: "Verdi's A", description: "Natural tuning, harmonic with nature" },
      440: { name: "Standard A", description: "International standard tuning" },
      528: { name: "Love Frequency", description: "Miracle tone, DNA repair" }
    }
  };

  res.json(frequencies);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Harmonia server running on port ${PORT}`);
});