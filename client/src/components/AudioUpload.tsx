import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { CloudUpload, MusicNote, CheckCircle } from '@mui/icons-material';
import { AudioFile } from '../types';
import { uploadAudioFile } from '../services/api';

interface AudioUploadProps {
  onFileUpload: (file: AudioFile) => void;
}

const AudioUpload: React.FC<AudioUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid audio file (MP3, WAV, FLAC, or AAC)');
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('File size must be less than 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadAudioFile(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onFileUpload(response.file);
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Transform Your Music with Therapeutic Frequencies
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Upload your audio file and let Harmonia guide you through creating a personalized 
        therapeutic sound experience using Solfeggio frequencies and binaural beats.
      </Typography>

      <Paper
        elevation={isDragOver ? 8 : 2}
        sx={{
          p: 4,
          textAlign: 'center',
          border: isDragOver ? '2px dashed' : '2px dashed transparent',
          borderColor: isDragOver ? 'primary.main' : 'grey.300',
          bgcolor: isDragOver ? 'primary.50' : 'background.paper',
          transition: 'all 0.3s ease',
          cursor: isUploading ? 'default' : 'pointer',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={isUploading}
        />

        {isUploading ? (
          <Box>
            <CheckCircle sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Uploading your file...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary">
              {uploadProgress}% complete
            </Typography>
          </Box>
        ) : (
          <Box>
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & drop your audio file here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              or click to browse files
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<MusicNote />}
              disabled={isUploading}
            >
              Choose Audio File
            </Button>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Supported Formats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • MP3 (recommended for best compatibility)<br />
            • WAV (uncompressed, highest quality)<br />
            • FLAC (lossless compression)<br />
            • AAC (Apple format)
          </Typography>
        </CardContent>
        <CardActions>
          <Typography variant="caption" color="text.secondary">
            Maximum file size: 100MB
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default AudioUpload;