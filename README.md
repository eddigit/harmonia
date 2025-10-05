# Harmonia - Therapeutic Audio Transformation Web App

Transform your music with therapeutic frequencies and binaural beats using Solfeggio frequencies and brainwave entrainment.

## Features

- **Audio Upload**: Drag & drop interface for MP3, WAV, FLAC, and AAC files
- **Intention Questionnaire**: Guided questionnaire to determine therapeutic goals
- **Real-time Audio Processing**: Pitch shifting, tempo adjustment, and binaural beat generation
- **Knowledge Base**: Comprehensive information about therapeutic frequencies
- **Export**: Download processed audio in various formats

## Technology Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- WaveSurfer.js for audio visualization
- Axios for API communication

### Backend
- Node.js with Express
- Python for audio processing
- Librosa for audio analysis and manipulation
- SciPy for signal processing

## Prerequisites

- Node.js 16+ 
- Python 3.8+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd harmonia
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Install Python dependencies**
   ```bash
   cd server
   pip install -r requirements.txt
   cd ..
   ```

## Running the Application

### Development Mode

1. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:5000

2. **Or run them separately**
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend  
   npm run client
   ```

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd server
   npm start
   ```

## Usage

1. **Upload Audio**: Drag and drop or select an audio file (MP3, WAV, FLAC, AAC)
2. **Set Intention**: Complete the questionnaire to define your therapeutic goals
3. **Customize Settings**: Adjust tuning, tempo, and binaural beats
4. **Process & Download**: Generate and download your transformed audio

## API Endpoints

- `POST /api/upload` - Upload audio file
- `POST /api/process` - Process audio with settings
- `GET /api/download/:filename` - Download processed file
- `GET /api/frequencies` - Get frequency data
- `GET /api/health` - Health check

## Therapeutic Frequencies

### Solfeggio Frequencies
- **174 Hz**: Foundation - Soul healing, pain relief
- **285 Hz**: Quantum Cognition - Tissue regeneration
- **396 Hz**: Liberation - Release fear and guilt
- **417 Hz**: Facilitation - Undo situations, facilitate change
- **528 Hz**: Transformation - DNA repair, love frequency
- **639 Hz**: Connection - Relationships, harmony
- **741 Hz**: Expression - Intuition, self-expression
- **852 Hz**: Intuition - Spiritual awakening, inner strength
- **963 Hz**: Connection - Connection to universe, divine

### Brainwave Frequencies
- **Delta (1-3 Hz)**: Deep sleep, healing
- **Theta (4-7 Hz)**: Meditation, creativity
- **Alpha (8-12 Hz)**: Relaxed awareness
- **Beta (13-30 Hz)**: Focus, concentration
- **Gamma (30-100 Hz)**: High consciousness

## File Structure

```
harmonia/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types.ts        # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── audio_processor.py  # Python audio processing
│   ├── requirements.txt    # Python dependencies
│   ├── index.js           # Express server
│   └── package.json
└── package.json           # Root package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub.

---

**Note**: This application is for educational and experimental purposes. The therapeutic effects of frequencies are not scientifically proven and should not replace professional medical advice.