import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUpload } from '../lib/api'

export default function Upload(){
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const navigate = useNavigate()

  async function handleUpload(){
    if(!file) return
    setLoading(true); setError(null)
    try{
      const data = await apiUpload(file)
      sessionStorage.setItem('upload', JSON.stringify(data))
      navigate('/intent')
    }catch(e:any){
      setError(e.message || 'Upload error')
    }finally{ setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-10">
        <h1 className="text-3xl font-semibold">Transformez votre musique</h1>
        <p className="opacity-80">Upload, intention, personnalisation et export.</p>
      </div>
      <div className="border-2 border-dashed rounded-xl p-8 text-center">
        <input type="file" accept="audio/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <div className="mt-4">
          <button disabled={!file||loading} onClick={handleUpload} className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-50">{loading? 'Téléversement...' : 'Uploader'}</button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  )
}
