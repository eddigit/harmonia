import React, { useState, useRef } from 'react'
import { Upload, Music, Sparkles, CheckCircle } from 'lucide-react'

const HomePage = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const supportedFormats = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mp3', 'audio/x-wav']
  const maxFileSize = 100 * 1024 * 1024 // 100 MB

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file) => {
    if (!file) return { valid: false, error: "Aucun fichier sélectionné" }
    
    if (!supportedFormats.includes(file.type) && !file.name.match(/\.(mp3|wav|flac|aac)$/i)) {
      return { valid: false, error: "Format non supporté. Veuillez utiliser MP3, WAV, FLAC ou AAC." }
    }
    
    if (file.size > maxFileSize) {
      return { valid: false, error: "Fichier trop volumineux. Taille maximale : 100 Mo." }
    }
    
    return { valid: true }
  }

  const handleFile = (file) => {
    const validation = validateFile(file)
    
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    
    setSelectedFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      setUploading(true)
      // Simulate upload progress
      setTimeout(() => {
        onFileUpload(selectedFile)
        setUploading(false)
      }, 1000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-harmonia-purple to-harmonia-blue rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-harmonia-purple to-harmonia-blue p-6 rounded-full">
              <Music className="text-white" size={64} />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-harmonia-purple via-harmonia-blue to-harmonia-green bg-clip-text text-transparent">
          Transformez votre musique
        </h1>
        
        <p className="text-xl text-gray-600 mb-3 max-w-2xl mx-auto">
          Intégrez des fréquences thérapeutiques et des effets psychoacoustiques 
          pour enrichir vos créations audio
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Solfège Sacré</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Battements Binauraux</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Accordage 432 Hz</span>
          </div>
        </div>
      </div>

      {/* Upload Card */}
      <div className="card max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Commencez par uploader votre fichier</h2>
          <p className="text-gray-600">Formats supportés : MP3, WAV, FLAC, AAC (max 100 Mo)</p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          className={`relative border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-harmonia-purple bg-purple-50 scale-105' 
              : 'border-gray-300 bg-gray-50 hover:border-harmonia-purple hover:bg-purple-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".mp3,.wav,.flac,.aac,audio/*"
            onChange={handleChange}
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-harmonia-purple to-harmonia-blue p-4 rounded-full">
                  <Upload className="text-white" size={40} />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Glissez-déposez votre fichier audio ici
                </p>
                <p className="text-sm text-gray-500 mb-4">ou</p>
                <button className="btn-secondary">
                  Parcourir les fichiers
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-500 p-4 rounded-full">
                  <CheckCircle className="text-white" size={40} />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo
                </p>
              </div>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                  }}
                  className="btn-secondary"
                >
                  Changer de fichier
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpload()
                  }}
                  className="btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Chargement...' : 'Continuer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="card text-center hover:shadow-xl transition-shadow">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-full">
              <Sparkles className="text-harmonia-purple" size={32} />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Questionnaire Intuitif</h3>
          <p className="text-gray-600 text-sm">
            Définissez votre intention émotionnelle en quelques clics
          </p>
        </div>
        
        <div className="card text-center hover:shadow-xl transition-shadow">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full">
              <Music className="text-harmonia-blue" size={32} />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Transformation Automatique</h3>
          <p className="text-gray-600 text-sm">
            Pitch, tempo et fréquences optimisés automatiquement
          </p>
        </div>
        
        <div className="card text-center hover:shadow-xl transition-shadow">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full">
              <CheckCircle className="text-harmonia-green" size={32} />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">Export Personnalisé</h3>
          <p className="text-gray-600 text-sm">
            Téléchargez en MP3 ou WAV avec vos réglages appliqués
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
