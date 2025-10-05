import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Pause,
  Download,
  VolumeUp,
  MusicNote,
  Speed,
  Tune,
} from '@mui/icons-material';
import { AudioFile, ProcessingSettings } from '../types';
import { processAudio, downloadProcessedFile } from '../services/api';

interface AudioControlsProps {
  audioFile: AudioFile;
  initialSettings: ProcessingSettings;
  onBack: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioFile, initialSettings, onBack }) => {
  const [settings, setSettings] = useState<ProcessingSettings>(initialSettings);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const originalAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Create audio elements for A/B comparison
    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(new Blob([''], { type: 'audio/mpeg' }));
    }
  }, []);

  const handleSettingChange = (key: keyof ProcessingSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBinauralSettingChange = (key: keyof ProcessingSettings['binauralBeats'], value: any) => {
    setSettings(prev => ({
      ...prev,
      binauralBeats: {
        ...prev.binauralBeats,
        [key]: value
      }
    }));
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProcessAudio = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await processAudio(audioFile.id, settings);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      // Create download URL for the processed file
      const blob = await downloadProcessedFile(result.processedFile);
      const url = URL.createObjectURL(blob);
      setProcessedFileUrl(url);
      
      // Update audio source
      if (audioRef.current) {
        audioRef.current.src = url;
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedFileUrl) {
      const link = document.createElement('a');
      link.href = processedFileUrl;
      link.download = `${audioFile.originalName.replace(/\.[^/.]+$/, '')}_${settings.preset}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getPresetDescription = () => {
    const tuning = settings.tuning === 432 ? 'Verdi\'s A (432 Hz)' : 
                   settings.tuning === 440 ? 'Standard A (440 Hz)' : 
                   `${settings.tuning} Hz`;
    
    const tempo = settings.tempo !== 1.0 ? `${Math.round(settings.tempo * 100)}%` : 'Original';
    
    const binaural = settings.binauralBeats.enabled ? 
      `${settings.binauralBeats.frequency} Hz ${settings.binauralBeats.frequency <= 3 ? 'Delta' : 
       settings.binauralBeats.frequency <= 7 ? 'Theta' : 
       settings.binauralBeats.frequency <= 12 ? 'Alpha' : 
       settings.binauralBeats.frequency <= 30 ? 'Beta' : 'Gamma'} waves` : 'None';
    
    return `${tuning} • ${tempo} tempo • ${binaural}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mr: 2 }}>
          Back to Questionnaire
        </Button>
        <Typography variant="h5" component="h1">
          Audio Controls
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Audio Player */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Audio Preview
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Original: {audioFile.originalName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Processed: {getPresetDescription()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton onClick={handlePlayPause} disabled={!processedFileUrl}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <Typography variant="body2">
                {isPlaying ? 'Playing...' : 'Click to preview'}
              </Typography>
            </Box>

            {isProcessing && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Processing audio...
                </Typography>
                <LinearProgress variant="determinate" value={processingProgress} />
              </Box>
            )}

            <Button
              variant="contained"
              startIcon={<MusicNote />}
              onClick={handleProcessAudio}
              disabled={isProcessing}
              fullWidth
              sx={{ mb: 2 }}
            >
              {isProcessing ? 'Processing...' : 'Process Audio'}
            </Button>

            {processedFileUrl && (
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownload}
                fullWidth
              >
                Download Processed Audio
              </Button>
            )}
          </Paper>
        </Box>

        {/* Controls */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Audio Settings
            </Typography>

            {/* Tuning Control */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Tune sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Tuning (Hz)</Typography>
                </Box>
                <Slider
                  value={settings.tuning}
                  onChange={(_, value) => handleSettingChange('tuning', value)}
                  min={430}
                  max={450}
                  step={1}
                  marks={[
                    { value: 432, label: '432 Hz' },
                    { value: 440, label: '440 Hz' },
                  ]}
                  valueLabelDisplay="auto"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {settings.tuning === 432 ? 'Verdi\'s A - Natural tuning' : 
                   settings.tuning === 440 ? 'Standard A - International tuning' : 
                   'Custom frequency'}
                </Typography>
              </CardContent>
            </Card>

            {/* Tempo Control */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Speed sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Tempo</Typography>
                </Box>
                <Slider
                  value={settings.tempo}
                  onChange={(_, value) => handleSettingChange('tempo', value)}
                  min={0.8}
                  max={1.2}
                  step={0.05}
                  marks={[
                    { value: 0.8, label: '80%' },
                    { value: 1.0, label: '100%' },
                    { value: 1.2, label: '120%' },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {settings.tempo < 1 ? 'Slower - More relaxed' : 
                   settings.tempo > 1 ? 'Faster - More energetic' : 
                   'Original tempo'}
                </Typography>
              </CardContent>
            </Card>

            {/* Binaural Beats Control */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VolumeUp sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Binaural Beats</Typography>
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.binauralBeats.enabled}
                      onChange={(e) => handleBinauralSettingChange('enabled', e.target.checked)}
                    />
                  }
                  label="Enable binaural beats"
                  sx={{ mb: 2 }}
                />

                {settings.binauralBeats.enabled && (
                  <>
                    <Typography variant="body2" gutterBottom>
                      Frequency: {settings.binauralBeats.frequency} Hz
                    </Typography>
                    <Slider
                      value={settings.binauralBeats.frequency}
                      onChange={(_, value) => handleBinauralSettingChange('frequency', value)}
                      min={1}
                      max={50}
                      step={1}
                      marks={[
                        { value: 2, label: 'Delta' },
                        { value: 6, label: 'Theta' },
                        { value: 10, label: 'Alpha' },
                        { value: 16, label: 'Beta' },
                        { value: 40, label: 'Gamma' },
                      ]}
                      valueLabelDisplay="auto"
                    />
                    
                    <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                      Volume: {Math.round(settings.binauralBeats.volume * 100)}%
                    </Typography>
                    <Slider
                      value={settings.binauralBeats.volume}
                      onChange={(_, value) => handleBinauralSettingChange('volume', value)}
                      min={0}
                      max={0.5}
                      step={0.01}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Hidden audio elements */}
      <audio ref={audioRef} />
      <audio ref={originalAudioRef} />
    </Box>
  );
};

export default AudioControls;