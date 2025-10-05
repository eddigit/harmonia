import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

export default function Waveform({ url }: { url?: string }){
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WaveSurfer | null>(null)

  useEffect(()=>{
    if(!containerRef.current) return
    if(wsRef.current){
      wsRef.current.destroy()
      wsRef.current = null
    }
    if(!url) return
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#94a3b8',
      progressColor: '#6366f1',
      cursorColor: '#111827',
      height: 64,
      normalize: true,
    })
    ws.load(url)
    wsRef.current = ws
    return ()=>{ ws.destroy() }
  }, [url])

  return (
    <div>
      <div ref={containerRef} />
    </div>
  )
}
