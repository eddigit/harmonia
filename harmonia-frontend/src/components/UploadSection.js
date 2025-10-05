import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadSection = ({ onFileUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append('audio', file);

      // Simuler la progression d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload vers le backend
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = response.data;

      // Petite pause pour montrer la progression complète
      setTimeout(() => {
        onFileUpload(file, result.analysis);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setIsUploading(false);
      alert('Erreur lors de l\'upload du fichier. Veuillez réessayer.');
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  return (
    <section className="upload-section">
      <div className="upload-container">
        <h2>Transformez votre musique</h2>
        <p className="upload-description">
          Uploadez votre fichier audio pour commencer le processus de transformation thérapeutique
        </p>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Analyse en cours... {uploadProgress}%</p>
            </div>
          ) : (
            <>
              {isDragActive ? (
                <p>Déposez votre fichier ici...</p>
              ) : (
                <>
                  <div className="upload-icon">🎵</div>
                  <p>
                    Glissez-déposez votre fichier audio ici, ou cliquez pour sélectionner
                  </p>
                  <p className="upload-formats">
                    Formats supportés: MP3, WAV, FLAC, AAC (max 100MB)
                  </p>
                </>
              )}
            </>
          )}
        </div>

        <div className="upload-info">
          <h3>Comment ça marche?</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Upload</h4>
                <p>Importez votre fichier audio</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Intention</h4>
                <p>Définissez votre objectif thérapeutique</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Personnalisation</h4>
                <p>Ajustez les paramètres audio</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Export</h4>
                <p>Téléchargez votre création transformée</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;