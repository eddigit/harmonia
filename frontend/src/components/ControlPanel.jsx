import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Download, Settings, Volume2, Sliders, ArrowLeft, RefreshCw, Loader } from 'lucide-react'
import WaveformVisualizer from './WaveformVisualizer'
import { solfeggioFrequencies, brainwaves, notableTunings } from '../data/frequencies'
import axios from 'axios'

const ControlPanel = ({ file, intention, onBack, onReset }) => {
  const [settings, setSettings] = useState({
    tuning: intention.preset.tuning,
    tempoAdjustment: intention.preset.tempoAdjustment,
    targetFrequency: intention.preset.targetFrequencies[0],
    binauralBeatEnabled: true,
    binauralBeatType: intention.preset.binauralBeat,
    binauralBeatVolume: 30
  })
  
  const [originalBPM, setOriginalBPM] = useState(120)
  const [processing, setProcessing] = useState(false)
  const [processedAudioUrl, setProcessedAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [exportFormat, setExportFormat] = useState('mp3')
  
  const audioRef = useRef(null)

  useEffect(() => {
    // Detect BPM when component mounts
    detectBPM()
  }, [file])

  const detectBPM = async () => {
    // Simulate BPM detection
    // In production, this would call the backend API
    setOriginalBPM(120)
  }

  const calculateNewBPM = () => {
    return Math.round(originalBPM * (1 + settings.tempoAdjustment / 100))
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleProcessAudio = async () => {
    setProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', file)
      formData.append('settings', JSON.stringify(settings))
      
      // In production, this would call the backend API
      // For now, simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate processed audio URL
      setProcessedAudioUrl(URL.createObjectURL(file))
      
    } catch (error) {
      console.error('Error processing audio:', error)
      alert('Erreur lors du traitement audio')
    } finally {
      setProcessing(false)
    }
  }

  const handleExport = async () => {
    if (!processedAudioUrl) {
      await handleProcessAudio()
    }
    
    // In production, trigger download from backend
    const link = document.createElement('a')
    link.href = processedAudioUrl || URL.createObjectURL(file)
    link.download = `${file.name.split('.')[0]}_harmonia_${settings.targetFrequency}Hz_${calculateNewBPM()}BPM.${exportFormat}`
    link.click()
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Panneau de Contrôle
            </h2>
            <p className="text-gray-600">
              Préréglage : <span className="font-semibold text-harmonia-purple">{intention.preset.name}</span>
            </p>
          </div>
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ArrowLeft size={18} />
            <span>Modifier l'intention</span>
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Fichier :</strong> {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} Mo)
          </p>
        </div>
      </div>

      {/* Waveform and Audio Player */}
      <div className="card mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Volume2 className="mr-2 text-harmonia-purple" size={24} />
          Visualisation Audio
        </h3>
        
        <WaveformVisualizer audioFile={file} />
        
        <div className="mt-6 flex items-center justify-center space-x-4">
          <button
            onClick={togglePlayback}
            className="btn-primary flex items-center space-x-2"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
          </button>
          
          <audio
            ref={audioRef}
            src={processedAudioUrl || URL.createObjectURL(file)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>

      {/* Control Settings */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Tuning Control */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Sliders className="mr-2 text-harmonia-purple" size={20} />
            Accordage (Tuning)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence de base (La4) : {settings.tuning} Hz
              </label>
              <input
                type="range"
                min="430"
                max="450"
                step="1"
                value={settings.tuning}
                onChange={(e) => handleSettingChange('tuning', parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-harmonia-purple to-harmonia-blue rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>430 Hz</span>
                <span>440 Hz</span>
                <span>450 Hz</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {Object.entries(notableTunings).map(([freq, data]) => (
                <button
                  key={freq}
                  onClick={() => handleSettingChange('tuning', parseInt(freq))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    settings.tuning === parseInt(freq)
                      ? 'bg-harmonia-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tempo Control */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <RefreshCw className="mr-2 text-harmonia-purple" size={20} />
            Tempo (BPM)
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">BPM Original : {originalBPM}</span>
              <span className="text-lg font-bold text-harmonia-purple">{calculateNewBPM()} BPM</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ajustement : {settings.tempoAdjustment > 0 ? '+' : ''}{settings.tempoAdjustment}%
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={settings.tempoAdjustment}
                onChange={(e) => handleSettingChange('tempoAdjustment', parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-20%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Binaural Beats */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Settings className="mr-2 text-harmonia-purple" size={20} />
            Battements Binauraux
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.binauralBeatEnabled}
              onChange={(e) => handleSettingChange('binauralBeatEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-harmonia-purple"></div>
          </label>
        </div>
        
        {settings.binauralBeatEnabled && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'onde cérébrale
              </label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(brainwaves).map(([key, wave]) => (
                  <button
                    key={key}
                    onClick={() => handleSettingChange('binauralBeatType', key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.binauralBeatType === key
                        ? 'bg-harmonia-purple text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {wave.name.split(' ')[1]}
                  </button>
                ))}
              </div>
              {settings.binauralBeatType && (
                <p className="text-xs text-gray-600 mt-2">
                  {brainwaves[settings.binauralBeatType].description}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume des battements : {settings.binauralBeatVolume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.binauralBeatVolume}
                onChange={(e) => handleSettingChange('binauralBeatVolume', parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Download className="mr-2 text-harmonia-purple" size={24} />
          Transformation et Export
        </h3>
        
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format d'export
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="input-field"
            >
              <option value="mp3">MP3 (320 kbps)</option>
              <option value="mp3-192">MP3 (192 kbps)</option>
              <option value="wav">WAV (Sans perte)</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleProcessAudio}
            disabled={processing}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Transformation en cours...</span>
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                <span>Appliquer la Transformation</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Télécharger</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
