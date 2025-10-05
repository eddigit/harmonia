import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import AudioUpload from './components/AudioUpload';
import IntentionQuestionnaire from './components/IntentionQuestionnaire';
import AudioControls from './components/AudioControls';
import KnowledgeBase from './components/KnowledgeBase';
import { AudioFile, ProcessingSettings } from './types';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#a5b4fc',
      dark: '#4338ca',
    },
    secondary: {
      main: '#ec4899',
      light: '#f9a8d4',
      dark: '#be185d',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'questionnaire' | 'controls' | 'knowledge'>('upload');
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [processingSettings, setProcessingSettings] = useState<ProcessingSettings | null>(null);

  const handleFileUpload = (file: AudioFile) => {
    setAudioFile(file);
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (settings: ProcessingSettings) => {
    setProcessingSettings(settings);
    setCurrentStep('controls');
  };

  const handleBackToUpload = () => {
    setAudioFile(null);
    setProcessingSettings(null);
    setCurrentStep('upload');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <AudioUpload onFileUpload={handleFileUpload} />;
      case 'questionnaire':
        return (
          <IntentionQuestionnaire
            onComplete={handleQuestionnaireComplete}
            onBack={handleBackToUpload}
          />
        );
      case 'controls':
        return (
          <AudioControls
            audioFile={audioFile!}
            initialSettings={processingSettings!}
            onBack={() => setCurrentStep('questionnaire')}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeBase
            onBack={() => setCurrentStep('upload')}
          />
        );
      default:
        return <AudioUpload onFileUpload={handleFileUpload} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              🎵 Harmonia
            </Typography>
            <Typography
              variant="body2"
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => setCurrentStep('knowledge')}
            >
              Knowledge Base
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {renderCurrentStep()}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
