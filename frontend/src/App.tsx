import { useRef, useState } from 'react'
import './App.css'

type UploadResponse = { fileId: string; filename: string }
type PresetResponse = { preset: { tuning_hz: number; tempo_change_pct: number }; label: string }
type TransformResponse = { downloadUrl: string; out_file: string }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

function App() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [fileId, setFileId] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [goal, setGoal] = useState<string>('Bien-être et Équilibre')
  const [, setPreset] = useState<PresetResponse['preset'] | null>(null)
  const [tempoChange, setTempoChange] = useState<number>(0)
  const [tuningHz, setTuningHz] = useState<number>(440)
  const [binauralEnabled, setBinauralEnabled] = useState<boolean>(false)
  const [binauralTarget, setBinauralTarget] = useState<string>('alpha')
  const [binauralGain, setBinauralGain] = useState<number>(-18)
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const onUpload = async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form })
    if (!res.ok) throw new Error('Upload failed')
    const json: UploadResponse = await res.json()
    setFileId(json.fileId)
    setFileName(file.name)
    setStep(2)
  }

  const requestPreset = async () => {
    const res = await fetch(`${API_BASE}/preset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    })
    const json: PresetResponse = await res.json()
    setPreset(json.preset)
    setTempoChange(json.preset.tempo_change_pct)
    setTuningHz(json.preset.tuning_hz)
    setStep(3)
  }

  const runTransform = async () => {
    if (!fileId) return
    const res = await fetch(`${API_BASE}/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_id: fileId,
        tuning_hz: tuningHz,
        tempo_change_pct: tempoChange,
        binaural_enabled: binauralEnabled,
        binaural_target: binauralTarget,
        binaural_gain_db: binauralGain,
      }),
    })
    const json: TransformResponse = await res.json()
    setDownloadUrl(`${API_BASE}${json.downloadUrl}`)
    setStep(4)
  }

  return (
    <div className="container">
      <h1>Harmonia</h1>
      {step === 1 && (
        <section>
          <h2>Uploader</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUpload(f)
            }}
          />
        </section>
      )}

      {step === 2 && (
        <section>
          <h2>Définir l'intention</h2>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>Guérison et Récupération</option>
            <option>Bien-être et Équilibre</option>
            <option>Énergie et Motivation</option>
            <option>Exploration Spirituelle</option>
          </select>
          <button onClick={requestPreset}>Générer le preset</button>
        </section>
      )}

      {step === 3 && (
        <section>
          <h2>Personnaliser</h2>
          <p>Fichier: {fileName}</p>
          <div className="controls">
            <label>
              Accordage (Hz):
              <input
                type="number"
                min={430}
                max={450}
                value={tuningHz}
                onChange={(e) => setTuningHz(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Tempo (%):
              <input
                type="range"
                min={-20}
                max={20}
                value={tempoChange}
                onChange={(e) => setTempoChange(parseFloat(e.target.value))}
              />
              <span>{tempoChange}%</span>
            </label>
            <label>
              Battements binauraux
              <input
                type="checkbox"
                checked={binauralEnabled}
                onChange={(e) => setBinauralEnabled(e.target.checked)}
              />
            </label>
            {binauralEnabled && (
              <div className="row">
                <select value={binauralTarget} onChange={(e) => setBinauralTarget(e.target.value)}>
                  <option value="delta">Delta</option>
                  <option value="theta">Theta</option>
                  <option value="alpha">Alpha</option>
                  <option value="beta">Beta</option>
                  <option value="gamma">Gamma</option>
                </select>
                <label>
                  Volume (dB)
                  <input
                    type="number"
                    min={-60}
                    max={0}
                    value={binauralGain}
                    onChange={(e) => setBinauralGain(parseFloat(e.target.value))}
                  />
                </label>
              </div>
            )}
          </div>
          <button onClick={runTransform}>Lancer la transformation</button>
        </section>
      )}

      {step === 4 && (
        <section>
          <h2>Exporter</h2>
          <audio ref={audioRef} controls src={downloadUrl} />
          <div>
            <a href={downloadUrl} download>
              Télécharger le fichier transformé
            </a>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
