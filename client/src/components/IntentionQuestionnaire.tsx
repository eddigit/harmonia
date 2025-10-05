import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { ProcessingSettings, FrequencyData } from '../types';
import { getFrequencies } from '../services/api';

interface IntentionQuestionnaireProps {
  onComplete: (settings: ProcessingSettings) => void;
  onBack: () => void;
}

const IntentionQuestionnaire: React.FC<IntentionQuestionnaireProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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

  const steps = [
    {
      question: "What is your primary goal?",
      options: [
        { value: "healing", label: "Healing & Recovery", description: "For sleep, deep relaxation, physical recovery" },
        { value: "balance", label: "Wellness & Balance", description: "For meditation, stress reduction, harmony" },
        { value: "energy", label: "Energy & Motivation", description: "For focus, creativity, performance" },
        { value: "spiritual", label: "Spiritual Exploration", description: "For intuition, higher consciousness" },
      ]
    },
    {
      question: "Refine your intention",
      options: getRefinedOptions(selectedOptions[0])
    }
  ];

  function getRefinedOptions(primaryGoal: string): Array<{
    value: string;
    label: string;
    description: string;
    frequency?: number;
    brainwave?: string;
  }> {
    if (!frequencies) return [];

    switch (primaryGoal) {
      case "healing":
        return [
          { value: "pain_relief", label: "Relieve physical pain", frequency: 174, description: "174 Hz - Foundation frequency" },
          { value: "cell_regeneration", label: "Promote cell regeneration", frequency: 285, description: "285 Hz - Quantum cognition" },
          { value: "deep_sleep", label: "Deep restorative sleep", frequency: 1, brainwave: "delta", description: "Delta waves 1-3 Hz" },
        ];
      case "balance":
        return [
          { value: "release_fear", label: "Release fears and guilt", frequency: 396, description: "396 Hz - Liberation" },
          { value: "harmonize_relationships", label: "Harmonize relationships", frequency: 639, description: "639 Hz - Connection" },
          { value: "relaxed_awareness", label: "Relaxed but alert state", frequency: 432, brainwave: "alpha", description: "432 Hz + Alpha waves" },
          { value: "reduce_stress", label: "Reduce stress and anxiety", frequency: 528, brainwave: "theta", description: "528 Hz + Theta waves" },
        ];
      case "energy":
        return [
          { value: "concentration", label: "Enhance concentration", frequency: 16, brainwave: "beta", description: "Beta waves 16-18 Hz" },
          { value: "creativity", label: "Stimulate creativity", frequency: 417, brainwave: "theta", description: "417 Hz + Theta waves" },
          { value: "euphoria", label: "Feel euphoria and joy", frequency: 528, brainwave: "gamma", description: "528 Hz + Gamma waves" },
        ];
      case "spiritual":
        return [
          { value: "intuition", label: "Develop intuition", frequency: 741, description: "741 Hz - Expression" },
          { value: "inner_strength", label: "Build inner strength", frequency: 852, description: "852 Hz - Intuition" },
          { value: "divine_connection", label: "Connect to divine consciousness", frequency: 963, description: "963 Hz - Connection" },
        ];
      default:
        return [];
    }
  }

  const handleOptionSelect = (optionValue: string) => {
    if (currentStep === 0) {
      setSelectedOptions([optionValue]);
    } else {
      setSelectedOptions(prev => [...prev.slice(0, 1), optionValue]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateSettings();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSelectedOptions(prev => prev.slice(0, -1));
    } else {
      onBack();
    }
  };

  const generateSettings = () => {
    if (selectedOptions.length < 2) return;

    const primaryGoal = selectedOptions[0];
    const refinedIntention = selectedOptions[1];
    const currentStepOptions = steps[1].options;
    const selectedOption = currentStepOptions.find(opt => opt.value === refinedIntention);

    if (!selectedOption) return;

    const settings: ProcessingSettings = {
      tuning: selectedOption.frequency || 440,
      tempo: 1.0, // Default tempo, can be adjusted in controls
      binauralBeats: {
        enabled: !!selectedOption.brainwave,
        frequency: getBrainwaveFrequency(selectedOption.brainwave),
        volume: 0.1,
      },
      preset: `${primaryGoal}_${refinedIntention}`,
      emotion: primaryGoal,
    };

    onComplete(settings);
  };

  const getBrainwaveFrequency = (brainwave?: string): number => {
    const frequencies: { [key: string]: number } = {
      delta: 2,
      theta: 6,
      alpha: 10,
      beta: 16,
      gamma: 40,
    };
    return frequencies[brainwave || 'alpha'] || 10;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Loading frequency data...</Typography>
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

  const currentStepData = steps[currentStep];
  const canProceed = selectedOptions.length > currentStep;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Primary Goal</StepLabel>
        </Step>
        <Step>
          <StepLabel>Refine Intention</StepLabel>
        </Step>
      </Stepper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          {currentStepData.question}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mt: 3 }}>
          {currentStepData.options.map((option) => (
            <Card
              key={option.value}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: selectedOptions[currentStep] === option.value ? 2 : 1,
                borderColor: selectedOptions[currentStep] === option.value ? 'primary.main' : 'grey.300',
                bgcolor: selectedOptions[currentStep] === option.value ? 'primary.50' : 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleOptionSelect(option.value)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {option.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
                {option.frequency && (
                  <Chip
                    label={`${option.frequency} Hz`}
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
                {option.brainwave && (
                  <Chip
                    label={`${option.brainwave.toUpperCase()} waves`}
                    size="small"
                    color="secondary"
                    sx={{ mt: 1, ml: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            variant="outlined"
          >
            {currentStep === 0 ? 'Back to Upload' : 'Previous'}
          </Button>

          <Button
            endIcon={currentStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
            onClick={handleNext}
            variant="contained"
            disabled={!canProceed}
          >
            {currentStep === steps.length - 1 ? 'Generate Settings' : 'Next'}
          </Button>
        </Box>
      </Paper>

      {selectedOptions.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Selected:</strong> {steps.map((step, index) => 
              selectedOptions[index] && step.options.find(opt => opt.value === selectedOptions[index])?.label
            ).filter(Boolean).join(' → ')}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default IntentionQuestionnaire;