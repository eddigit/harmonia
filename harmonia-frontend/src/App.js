import React, { useState } from 'react';
import './App.css';

// Composants
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import IntentionQuestionnaire from './components/IntentionQuestionnaire';
import AudioControls from './components/AudioControls';
import KnowledgeBase from './components/KnowledgeBase';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, questionnaire, controls, export
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [intention, setIntention] = useState(null);
  const [audioSettings, setAudioSettings] = useState({});

  const handleFileUpload = (file, analysis) => {
    setUploadedFile(file);
    setAudioAnalysis(analysis);
    setCurrentStep('questionnaire');
  };

  const handleIntentionSubmit = (selectedIntention) => {
    setIntention(selectedIntention);
    setCurrentStep('controls');
  };

  const handleSettingsChange = (newSettings) => {
    setAudioSettings(newSettings);
  };

  const handleExport = () => {
    setCurrentStep('export');
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        {currentStep === 'upload' && (
          <UploadSection onFileUpload={handleFileUpload} />
        )}

        {currentStep === 'questionnaire' && (
          <IntentionQuestionnaire
            onIntentionSubmit={handleIntentionSubmit}
            audioAnalysis={audioAnalysis}
          />
        )}

        {currentStep === 'controls' && (
          <AudioControls
            uploadedFile={uploadedFile}
            audioAnalysis={audioAnalysis}
            intention={intention}
            settings={audioSettings}
            onSettingsChange={handleSettingsChange}
            onExport={handleExport}
          />
        )}

        {currentStep === 'export' && (
          <div className="export-section">
            <h2>Transformation Terminée</h2>
            <p>Votre fichier audio a été transformé avec succès selon vos paramètres.</p>
            <button className="btn-primary">Télécharger le fichier</button>
            <button className="btn-secondary" onClick={() => setCurrentStep('upload')}>
              Transformer un autre fichier
            </button>
          </div>
        )}
      </main>

      <KnowledgeBase />
    </div>
  );
}

export default App;