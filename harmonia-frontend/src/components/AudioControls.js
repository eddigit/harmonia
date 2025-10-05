import React, { useState, useEffect, useRef } from 'react';

const AudioControls = ({ uploadedFile, audioAnalysis, intention, settings, onSettingsChange, onExport }) => {
  const [activeTab, setActiveTab] = useState('tuning');
  const [audioSettings, setAudioSettings] = useState({
    tuning: 440,
    tempo: audioAnalysis?.analysis?.tempo || 120,
    addBinauralBeats: false,
    binauralBeats: {
      frequency: 8,
      volume: 0.3,
      waveType: 'alpha'
    },
    exportFormat: 'mp3',
    exportBitrate: '320k'
  });

  const waveformRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialiser les paramètres selon l'intention sélectionnée
    if (intention) {
      const newSettings = { ...audioSettings };

      // Ajuster les paramètres selon l'intention
      switch (intention.subGoal) {
        case 'deep_sleep':
          newSettings.tuning = 432;
          newSettings.addBinauralBeats = true;
          newSettings.binauralBeats = { frequency: 2, volume: 0.4, waveType: 'delta' };
          break;
        case 'relaxed_awake':
          newSettings.tuning = 432;
          newSettings.addBinauralBeats = true;
          newSettings.binauralBeats = { frequency: 10, volume: 0.3, waveType: 'alpha' };
          break;
        case 'stress_reduction':
          newSettings.tuning = 528;
          newSettings.addBinauralBeats = true;
          newSettings.binauralBeats = { frequency: 6, volume: 0.35, waveType: 'theta' };
          break;
        case 'concentration':
          newSettings.tuning = 440;
          newSettings.addBinauralBeats = true;
          newSettings.binauralBeats = { frequency: 17, volume: 0.3, waveType: 'beta' };
          break;
        case 'creativity':
          newSettings.tuning = 417;
          break;
        default:
          newSettings.tuning = 432;
      }

      setAudioSettings(newSettings);
      onSettingsChange(newSettings);
    }
  }, [intention, audioAnalysis]);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...audioSettings, [setting]: value };
    setAudioSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleBinauralChange = (setting, value) => {
    const newSettings = {
      ...audioSettings,
      binauralBeats: { ...audioSettings.binauralBeats, [setting]: value }
    };
    setAudioSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handlePreview = async () => {
    // Ici on pourrait implémenter la pré-écoute avec les paramètres actuels
    // Pour l'instant, on simule juste
    alert('Pré-écoute avec les paramètres actuels (fonctionnalité à implémenter)');
  };

  const handleTransform = async () => {
    try {
      const transformData = {
        filename: uploadedFile.name,
        settings: {
          ...audioSettings,
          original_bpm: audioAnalysis?.analysis?.tempo
        }
      };

      const response = await fetch('http://localhost:3001/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la transformation');
      }

      const result = await response.json();
      alert(`Transformation réussie! Téléchargement: ${result.downloadUrl}`);

    } catch (error) {
      console.error('Erreur lors de la transformation:', error);
      alert('Erreur lors de la transformation. Veuillez réessayer.');
    }
  };

  return (
    <section className="audio-controls-section">
      <div className="controls-container">
        <div className="controls-header">
          <h2>Personnalisation Audio</h2>
          <div className="intention-badge">
            Intention: {intention?.settings?.description}
          </div>
        </div>

        <div className="controls-tabs">
          <button
            className={`tab-button ${activeTab === 'tuning' ? 'active' : ''}`}
            onClick={() => setActiveTab('tuning')}
          >
            Accordage
          </button>
          <button
            className={`tab-button ${activeTab === 'tempo' ? 'active' : ''}`}
            onClick={() => setActiveTab('tempo')}
          >
            Tempo
          </button>
          <button
            className={`tab-button ${activeTab === 'binaural' ? 'active' : ''}`}
            onClick={() => setActiveTab('binaural')}
          >
            Battements Binauraux
          </button>
          <button
            className={`tab-button ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            Export
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'tuning' && (
            <div className="tuning-tab">
              <h3>Accordage (Tuning)</h3>
              <p>Ajustez la fréquence de référence de votre morceau</p>

              <div className="control-group">
                <label>Fréquence de base (La4):</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="430"
                    max="450"
                    step="1"
                    value={audioSettings.tuning}
                    onChange={(e) => handleSettingChange('tuning', parseInt(e.target.value))}
                    className="frequency-slider"
                  />
                  <div className="slider-values">
                    <span>430Hz</span>
                    <span className="current-value">{audioSettings.tuning}Hz</span>
                    <span>450Hz</span>
                  </div>
                </div>
              </div>

              <div className="preset-frequencies">
                <p>Accordages prédéfinis:</p>
                <div className="preset-buttons">
                  <button
                    className={audioSettings.tuning === 432 ? 'active' : ''}
                    onClick={() => handleSettingChange('tuning', 432)}
                  >
                    432Hz (Relaxation)
                  </button>
                  <button
                    className={audioSettings.tuning === 440 ? 'active' : ''}
                    onClick={() => handleSettingChange('tuning', 440)}
                  >
                    440Hz (Standard)
                  </button>
                  <button
                    className={audioSettings.tuning === 528 ? 'active' : ''}
                    onClick={() => handleSettingChange('tuning', 528)}
                  >
                    528Hz (Amour)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tempo' && (
            <div className="tempo-tab">
              <h3>Tempo (BPM)</h3>
              <p>Ajustez la vitesse de votre morceau</p>

              <div className="control-group">
                <label>Tempo: {Math.round(audioSettings.tempo)} BPM</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min={Math.max(60, (audioAnalysis?.analysis?.tempo || 120) * 0.8)}
                    max={(audioAnalysis?.analysis?.tempo || 120) * 1.2}
                    step="1"
                    value={audioSettings.tempo}
                    onChange={(e) => handleSettingChange('tempo', parseFloat(e.target.value))}
                    className="tempo-slider"
                  />
                  <div className="slider-values">
                    <span>-20%</span>
                    <span className="current-value">{Math.round(audioSettings.tempo)}</span>
                    <span>+20%</span>
                  </div>
                </div>
              </div>

              <div className="tempo-info">
                <p>BPM original: {Math.round(audioAnalysis?.analysis?.tempo || 120)}</p>
                <p>Variation: {Math.round(((audioSettings.tempo / (audioAnalysis?.analysis?.tempo || 120)) - 1) * 100)}%</p>
              </div>
            </div>
          )}

          {activeTab === 'binaural' && (
            <div className="binaural-tab">
              <h3>Battements Binauraux</h3>
              <p>Ajoutez des fréquences thérapeutiques pour amplifier l'effet</p>

              <div className="control-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={audioSettings.addBinauralBeats}
                    onChange={(e) => handleSettingChange('addBinauralBeats', e.target.checked)}
                  />
                  Activer les battements binauraux
                </label>
              </div>

              {audioSettings.addBinauralBeats && (
                <>
                  <div className="control-group">
                    <label>Type d'onde:</label>
                    <select
                      value={audioSettings.binauralBeats.waveType}
                      onChange={(e) => handleBinauralChange('waveType', e.target.value)}
                      className="wave-select"
                    >
                      <option value="delta">Delta (1-3 Hz) - Sommeil profond</option>
                      <option value="theta">Theta (4-7 Hz) - Méditation</option>
                      <option value="alpha">Alpha (8-12 Hz) - Relaxation</option>
                      <option value="beta">Beta (16-18 Hz) - Concentration</option>
                      <option value="gamma">Gamma (30-100 Hz) - Performance</option>
                    </select>
                  </div>

                  <div className="control-group">
                    <label>Fréquence: {audioSettings.binauralBeats.frequency} Hz</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="1"
                        max="40"
                        step="0.5"
                        value={audioSettings.binauralBeats.frequency}
                        onChange={(e) => handleBinauralChange('frequency', parseFloat(e.target.value))}
                        className="binaural-slider"
                      />
                    </div>
                  </div>

                  <div className="control-group">
                    <label>Volume: {Math.round(audioSettings.binauralBeats.volume * 100)}%</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.05"
                        value={audioSettings.binauralBeats.volume}
                        onChange={(e) => handleBinauralChange('volume', parseFloat(e.target.value))}
                        className="volume-slider"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="export-tab">
              <h3>Paramètres d'exportation</h3>

              <div className="control-group">
                <label>Format:</label>
                <select
                  value={audioSettings.exportFormat}
                  onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                  className="format-select"
                >
                  <option value="mp3">MP3 (compressé)</option>
                  <option value="wav">WAV (sans perte)</option>
                </select>
              </div>

              {audioSettings.exportFormat === 'mp3' && (
                <div className="control-group">
                  <label>Qualité:</label>
                  <select
                    value={audioSettings.exportBitrate}
                    onChange={(e) => handleSettingChange('exportBitrate', e.target.value)}
                    className="bitrate-select"
                  >
                    <option value="128k">128 kbps (bonne qualité)</option>
                    <option value="192k">192 kbps (très bonne qualité)</option>
                    <option value="320k">320 kbps (excellente qualité)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="audio-preview">
          <h3>Aperçu</h3>
          <div className="waveform-container" ref={waveformRef}>
            {/* Ici on intégrera wavesurfer.js pour la visualisation */}
            <div className="waveform-placeholder">
              <p>Visualisation audio (à implémenter avec wavesurfer.js)</p>
              <div className="audio-info">
                <p><strong>Fichier:</strong> {uploadedFile?.name}</p>
                <p><strong>Durée:</strong> {Math.round(audioAnalysis?.format?.duration || 0)}s</p>
                <p><strong>BPM:</strong> {Math.round(audioAnalysis?.analysis?.tempo || 120)}</p>
              </div>
            </div>
          </div>

          <div className="preview-controls">
            <button className="btn-secondary" onClick={handlePreview}>
              ▶️ Pré-écouter
            </button>
            <button className="btn-primary" onClick={handleTransform}>
              🚀 Lancer la transformation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudioControls;