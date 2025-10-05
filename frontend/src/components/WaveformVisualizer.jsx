import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

const WaveformVisualizer = ({ audioFile }) => {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (waveformRef.current && audioFile) {
      // Initialize WaveSurfer
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#9b87f5',
        progressColor: '#6366f1',
        cursorColor: '#10b981',
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 2,
        height: 100,
        barGap: 2,
        responsive: true,
        normalize: true
      })

      // Load audio file
      const fileURL = URL.createObjectURL(audioFile)
      wavesurferRef.current.load(fileURL)

      wavesurferRef.current.on('ready', () => {
        setLoading(false)
      })

      // Cleanup
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy()
        }
        URL.revokeObjectURL(fileURL)
      }
    }
  }, [audioFile])

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-harmonia-purple border-t-transparent"></div>
          <p className="text-gray-600 mt-2">Chargement de la forme d'onde...</p>
        </div>
      )}
      <div ref={waveformRef} className={loading ? 'hidden' : ''} />
    </div>
  )
}

export default WaveformVisualizer
