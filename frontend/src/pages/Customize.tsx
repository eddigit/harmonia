import { useEffect, useMemo, useRef, useState } from 'react'
import { apiDownloadUrl, apiOriginalUrl, apiProcess } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import Waveform from '../lib/Waveform'

function getStored<T>(key: string): T|null {
  const raw = sessionStorage.getItem(key)
  if(!raw) return null
  try{ return JSON.parse(raw) }catch{ return null }
}

export default function Customize(){
  const upload = getStored<any>('upload')
  const presetResp = getStored<any>('preset')
  const preset = presetResp?.preset
  const [a4, setA4] = useState<number | ''>(preset?.target_a4_hz ?? '')
  const [snap, setSnap] = useState<number | ''>(preset?.snap_to_freq_hz ?? '')
  const [tempo, setTempo] = useState<number>(preset?.tempo_change_percent ?? 0)
  const [binauralEnabled, setBinauralEnabled] = useState<boolean>(preset?.binaural?.enabled ?? false)
  const [beatHz, setBeatHz] = useState<number | ''>(preset?.binaural?.beat_hz ?? '')
  const [volume, setVolume] = useState<number>(preset?.binaural?.volume ?? 0.15)
  const [jobId, setJobId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const audioOriginal = useRef<HTMLAudioElement>(null)
  const audioPreview = useRef<HTMLAudioElement>(null)
  const navigate = useNavigate()

  useEffect(()=>{
    if(!upload){ navigate('/') }
  }, [upload])

  async function handlePreview(){
    if(!upload) return
    setLoading(true); setError(null)
    try{
      const payload = {
        file_id: upload.file_id,
        target_a4_hz: a4 === '' ? null : Number(a4),
        snap_to_freq_hz: snap === '' ? null : Number(snap),
        tempo_change_percent: Number(tempo),
        binaural: binauralEnabled ? { enabled: true, beat_hz: beatHz === '' ? null : Number(beatHz), volume } : { enabled: false },
        preview_seconds: 20,
        export_format: 'wav'
      } as const
      const res = await apiProcess(payload)
      setJobId(res.job_id)
      const url = apiDownloadUrl(res.job_id)
      setPreviewUrl(url)
    }catch(e:any){ setError(e.message || 'Erreur de preview') }
    finally{ setLoading(false) }
  }

  function handleExport(){
    if(!jobId) return
    window.open(apiDownloadUrl(jobId), '_blank')
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Personnaliser</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Accordage A4 (Hz)</label>
            <input type="number" step="0.1" value={a4} onChange={e=>setA4((e.target.value as any) as any)} placeholder="432" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Caler sur fréquence (Hz)</label>
            <input type="number" step="0.1" value={snap} onChange={e=>setSnap((e.target.value as any) as any)} placeholder="528" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Tempo (%) [-20 à +20]</label>
            <input type="range" min={-20} max={20} value={tempo} onChange={e=>setTempo(Number(e.target.value))} className="w-full" />
            <div className="text-sm opacity-80">{tempo}%</div>
          </div>
          <div className="border rounded p-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={binauralEnabled} onChange={e=>setBinauralEnabled(e.target.checked)} /> Battements binauraux
            </label>
            {binauralEnabled && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm mb-1">Beat (Hz)</label>
                  <input type="number" step={0.1} value={beatHz} onChange={e=>setBeatHz((e.target.value as any) as any)} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Volume</label>
                  <input type="range" min={0} max={0.5} step={0.01} value={volume} onChange={e=>setVolume(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handlePreview} disabled={loading} className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-50">Pré-écoute</button>
            <button onClick={handleExport} disabled={!jobId} className="px-4 py-2 rounded border">Télécharger</button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </div>
        <div className="space-y-3">
          <div className="border rounded p-3">
            <div className="text-sm font-medium mb-2">Original</div>
            <audio ref={audioOriginal} controls src={upload? apiOriginalUrl(upload.file_id): undefined} />
            <Waveform url={upload? apiOriginalUrl(upload.file_id): undefined} />
          </div>
          <div className="border rounded p-3">
            <div className="text-sm font-medium mb-2">Transformé (Preview)</div>
            <audio ref={audioPreview} controls src={previewUrl?? undefined} />
            <Waveform url={previewUrl?? undefined} />
          </div>
        </div>
      </div>
    </div>
  )
}
