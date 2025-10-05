export interface AudioFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

export interface ProcessingSettings {
  tuning: number;
  tempo: number;
  binauralBeats: {
    enabled: boolean;
    frequency: number;
    volume: number;
  };
  preset: string;
  emotion: string;
}

export interface FrequencyInfo {
  name: string;
  description: string;
  emotion: string;
}

export interface SolfeggioFrequencies {
  [key: number]: FrequencyInfo;
}

export interface BrainwaveInfo {
  range: string;
  description: string;
  emotion: string;
}

export interface BrainwaveFrequencies {
  [key: string]: BrainwaveInfo;
}

export interface TuningInfo {
  name: string;
  description: string;
}

export interface TuningFrequencies {
  [key: number]: TuningInfo;
}

export interface FrequencyData {
  solfeggio: SolfeggioFrequencies;
  brainwaves: BrainwaveFrequencies;
  tuning: TuningFrequencies;
}

export interface QuestionnaireStep {
  question: string;
  options: {
    value: string;
    label: string;
    frequencies?: number[];
    brainwave?: string;
    tuning?: number;
  }[];
}

export interface Preset {
  name: string;
  description: string;
  tuning: number;
  tempo: number;
  binauralBeats: {
    enabled: boolean;
    frequency: number;
    volume: number;
  };
}