import { useEffect, useState } from 'react'
import { apiDownloadUrl } from '../lib/api'

export default function ExportPage(){
  const [jobId, setJobId] = useState<string | null>(null)
  useEffect(()=>{
    const j = sessionStorage.getItem('lastJobId')
    if(j) setJobId(j)
  }, [])
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Exporter</h2>
      {jobId ? (
        <a className="px-4 py-2 inline-block rounded bg-primary-600 text-white" href={apiDownloadUrl(jobId)} target="_blank">Télécharger</a>
      ): (
        <p className="opacity-80">Aucune transformation disponible</p>
      )}
    </div>
  )
}
