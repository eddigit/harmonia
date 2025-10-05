import React, { useState, useEffect } from 'react';

const IntentionQuestionnaire = ({ onIntentionSubmit, audioAnalysis }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedSubGoal, setSelectedSubGoal] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goals = {
    'healing': {
      title: 'Guérison et Récupération',
      description: 'Pour le sommeil, la relaxation profonde, la récupération physique',
      subGoals: {
        'pain_relief': { title: 'Soulager une douleur physique', frequency: 174, description: 'Fréquence 174 Hz' },
        'regeneration': { title: 'Favoriser la régénération cellulaire', frequency: 285, description: 'Fréquence 285 Hz' },
        'deep_sleep': { title: 'Obtenir un sommeil profond et réparateur', frequency: '1-3', waveType: 'delta', description: 'Ondes Delta' }
      }
    },
    'wellbeing': {
      title: 'Bien-être et Équilibre',
      description: 'Pour la méditation, la réduction du stress, l\'harmonie relationnelle',
      subGoals: {
        'fear_release': { title: 'Libérer des peurs ou de la culpabilité', frequency: 396, description: 'Fréquence 396 Hz' },
        'harmony': { title: 'Harmoniser mes relations', frequency: 639, description: 'Fréquence 639 Hz' },
        'relaxed_awake': { title: 'Me sentir relaxé mais éveillé', frequency: '8-12', waveType: 'alpha', description: 'Ondes Alpha, 432 Hz' },
        'stress_reduction': { title: 'Réduire le stress et l\'anxiété', frequency: 528, description: 'Fréquence 528 Hz, Ondes Theta' }
      }
    },
    'energy': {
      title: 'Énergie et Motivation',
      description: 'Pour la concentration, la créativité, l\'euphorie, la performance',
      subGoals: {
        'concentration': { title: 'Augmenter ma concentration pour travailler/étudier', frequency: '16-18', waveType: 'beta', description: 'Ondes Beta' },
        'creativity': { title: 'Stimuler ma créativité', frequency: 417, description: 'Fréquence 417 Hz, Ondes Theta' },
        'euphoria': { title: 'Ressentir de l\'euphorie et de la joie', frequency: 528, description: 'Fréquence 528 Hz, Ondes Gamma' }
      }
    },
    'spiritual': {
      title: 'Exploration Spirituelle',
      description: 'Pour l\'éveil de l\'intuition, la connexion à la conscience supérieure',
      subGoals: {
        'intuition': { title: 'Développer mon intuition', frequency: [741, 852], description: 'Fréquences 741 Hz, 852 Hz' },
        'higher_consciousness': { title: 'Me connecter à une conscience supérieure', frequency: 963, description: 'Fréquence 963 Hz' }
      }
    }
  };

  const handleGoalSelect = (goalKey) => {
    setSelectedGoal(goalKey);
    setCurrentStep(2);
  };

  const handleSubGoalSelect = (subGoalKey) => {
    setSelectedSubGoal(subGoalKey);
    setIsTransitioning(true);

    // Transition vers l'étape suivante après un court délai
    setTimeout(() => {
      const fullIntention = {
        goal: selectedGoal,
        subGoal: subGoalKey,
        settings: goals[selectedGoal].subGoals[subGoalKey]
      };
      onIntentionSubmit(fullIntention);
    }, 1000);
  };

  const getCurrentGoal = () => goals[selectedGoal];

  if (isTransitioning) {
    return (
      <section className="questionnaire-section transitioning">
        <div className="transition-message">
          <div className="loading-spinner"></div>
          <h3>Configuration de votre transformation...</h3>
          <p>Préparation des paramètres optimaux pour votre intention</p>
        </div>
      </section>
    );
  }

  return (
    <section className="questionnaire-section">
      <div className="questionnaire-container">
        <div className="questionnaire-header">
          <h2>Définissons votre intention</h2>
          <div className="progress-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Objectif</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Affinement</div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="goal-selection">
            <h3>Quel est votre objectif principal?</h3>
            <div className="goals-grid">
              {Object.entries(goals).map(([key, goal]) => (
                <div
                  key={key}
                  className="goal-card"
                  onClick={() => handleGoalSelect(key)}
                >
                  <div className="goal-icon">
                    {key === 'healing' && '🌿'}
                    {key === 'wellbeing' && '🧘'}
                    {key === 'energy' && '⚡'}
                    {key === 'spiritual' && '✨'}
                  </div>
                  <h4>{goal.title}</h4>
                  <p>{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && getCurrentGoal() && (
          <div className="subgoal-selection">
            <div className="selection-header">
              <button className="back-button" onClick={() => setCurrentStep(1)}>
                ← Retour
              </button>
              <h3>Affinez votre intention</h3>
              <div className="selected-goal-info">
                <span className="goal-badge">{getCurrentGoal().title}</span>
              </div>
            </div>

            <div className="subgoals-grid">
              {Object.entries(getCurrentGoal().subGoals).map(([key, subGoal]) => (
                <div
                  key={key}
                  className="subgoal-card"
                  onClick={() => handleSubGoalSelect(key)}
                >
                  <h4>{subGoal.title}</h4>
                  <p className="subgoal-description">{subGoal.description}</p>
                  <div className="frequency-info">
                    <span className="frequency-label">Fréquence:</span>
                    <span className="frequency-value">
                      {Array.isArray(subGoal.frequency)
                        ? subGoal.frequency.join('Hz, ') + 'Hz'
                        : subGoal.frequency + (subGoal.waveType ? ` (${subGoal.waveType})` : 'Hz')
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {audioAnalysis && (
          <div className="audio-info-preview">
            <h4>Informations sur votre fichier:</h4>
            <div className="audio-details">
              <p><strong>Durée:</strong> {Math.round(audioAnalysis.format.duration)}s</p>
              <p><strong>BPM estimé:</strong> {Math.round(audioAnalysis.analysis.tempo)}</p>
              <p><strong>Tonalité:</strong> {audioAnalysis.analysis.estimated_key}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IntentionQuestionnaire;