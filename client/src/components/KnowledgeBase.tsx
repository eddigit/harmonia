import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  MusicNote,
  Psychology,
  Tune,
  Info,
} from '@mui/icons-material';
import { FrequencyData } from '../types';
import { getFrequencies } from '../services/api';

interface KnowledgeBaseProps {
  onBack: () => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onBack }) => {
  const [tabValue, setTabValue] = useState(0);
  const [frequencies, setFrequencies] = useState<FrequencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFrequencies();
  }, []);

  const loadFrequencies = async () => {
    try {
      const data = await getFrequencies();
      setFrequencies(data);
    } catch (err) {
      setError('Failed to load frequency data');
      console.error('Error loading frequencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getBrainwaveColor = (brainwave: string) => {
    const colors: { [key: string]: string } = {
      delta: '#1976d2',
      theta: '#388e3c',
      alpha: '#f57c00',
      beta: '#d32f2f',
      gamma: '#7b1fa2',
    };
    return colors[brainwave] || '#666';
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      Healing: '#4caf50',
      Balance: '#2196f3',
      Energy: '#ff9800',
      Spiritual: '#9c27b0',
    };
    return colors[emotion] || '#666';
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Loading knowledge base...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!frequencies) {
    return (
      <Alert severity="error">
        No frequency data available
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Therapeutic Frequencies Knowledge Base
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<MusicNote />} label="Solfeggio Frequencies" />
          <Tab icon={<Psychology />} label="Brainwave Frequencies" />
          <Tab icon={<Tune />} label="Tuning Standards" />
          <Tab icon={<Info />} label="How to Choose" />
        </Tabs>
      </Paper>

      {/* Solfeggio Frequencies Tab */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Solfeggio Frequencies
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The Solfeggio frequencies are a set of ancient musical tones that were used in Gregorian chants 
            and are believed to have healing properties. Each frequency corresponds to a specific emotional 
            and physical healing aspect.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Object.entries(frequencies.solfeggio).map(([freq, info]) => (
              <Card elevation={2} key={freq}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="span" sx={{ mr: 2, fontWeight: 'bold' }}>
                      {freq} Hz
                    </Typography>
                    <Chip 
                      label={info.emotion} 
                      size="small" 
                      sx={{ bgcolor: getEmotionColor(info.emotion), color: 'white' }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {info.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Brainwave Frequencies Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Brainwave Frequencies
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Brainwaves are electrical patterns created by the brain's neurons. Different frequencies 
            correspond to different states of consciousness and can be influenced by binaural beats.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {Object.entries(frequencies.brainwaves).map(([wave, info]) => (
              <Card elevation={2} key={wave}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="span" sx={{ mr: 2, fontWeight: 'bold' }}>
                      {wave.toUpperCase()}
                    </Typography>
                    <Chip 
                      label={info.range} 
                      size="small" 
                      sx={{ bgcolor: getBrainwaveColor(wave), color: 'white' }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {info.emotion} State
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Tuning Standards Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Tuning Standards
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Different tuning standards have been used throughout history, each with its own 
            philosophical and practical implications.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Object.entries(frequencies.tuning).map(([freq, info]) => (
              <Card elevation={2} key={freq}>
                <CardContent>
                  <Typography variant="h4" component="span" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                    {freq} Hz
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {info.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">432 Hz vs 440 Hz: The Great Debate</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                The debate between 432 Hz and 440 Hz tuning has been ongoing for decades. 
                432 Hz is often called "Verdi's A" after the Italian composer Giuseppe Verdi, 
                who advocated for this tuning standard.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>432 Hz proponents argue:</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>It's more harmonious with nature and the human body</li>
                <li>It resonates with the Schumann resonance (7.83 Hz)</li>
                <li>It creates a more calming and healing effect</li>
                <li>It's mathematically related to the golden ratio</li>
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>440 Hz is the current standard because:</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>It's the international standard since 1953</li>
                <li>Most instruments and recordings use this tuning</li>
                <li>It provides consistency across all musical instruments</li>
                <li>It's easier to tune instruments to this frequency</li>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {/* How to Choose Tab */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            How to Choose the Right Frequency
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  For Healing & Recovery
                </Typography>
                <Typography variant="body2" paragraph>
                  Use lower frequencies (174-285 Hz) combined with Delta waves (1-3 Hz) 
                  for deep healing and physical recovery.
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>174 Hz for pain relief</li>
                  <li>285 Hz for cell regeneration</li>
                  <li>Delta waves for deep sleep</li>
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  For Focus & Energy
                </Typography>
                <Typography variant="body2" paragraph>
                  Use higher frequencies (417-528 Hz) with Beta waves (13-30 Hz) 
                  for concentration and mental clarity.
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>417 Hz for facilitating change</li>
                  <li>528 Hz for transformation</li>
                  <li>Beta waves for focus</li>
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  For Meditation & Balance
                </Typography>
                <Typography variant="body2" paragraph>
                  Use middle frequencies (396-639 Hz) with Alpha or Theta waves 
                  for relaxation and emotional balance.
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>396 Hz for releasing fear</li>
                  <li>639 Hz for relationships</li>
                  <li>Alpha/Theta waves for meditation</li>
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  For Spiritual Growth
                </Typography>
                <Typography variant="body2" paragraph>
                  Use the highest frequencies (741-963 Hz) with Gamma waves 
                  for spiritual awakening and higher consciousness.
                </Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>741 Hz for self-expression</li>
                  <li>852 Hz for intuition</li>
                  <li>963 Hz for divine connection</li>
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Tips for Best Results</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                <strong>1. Start with intention:</strong> Be clear about what you want to achieve 
                before selecting frequencies.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>2. Listen with headphones:</strong> Binaural beats require stereo headphones 
                to work effectively.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>3. Start slowly:</strong> Begin with shorter sessions (10-15 minutes) 
                and gradually increase duration.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>4. Create a quiet environment:</strong> Minimize distractions and 
                create a comfortable listening space.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>5. Trust your intuition:</strong> If a frequency doesn't feel right, 
                try a different one. Everyone responds differently.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default KnowledgeBase;