import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPreset } from '../lib/api'

const SECONDARY: Record<string, {key:string,label:string}[]> = {
  heal: [
    {key:'pain_relief', label:'Soulager une douleur (174 Hz)'},
    {key:'cell_regen', label:'Régénération cellulaire (285 Hz)'},
    {key:'deep_sleep', label:'Sommeil profond (Delta)'}
  ],
  balance: [
    {key:'release_fear', label:'Libérer peurs/culpabilité (396 Hz)'},
    {key:'relations', label:'Harmoniser relations (639 Hz)'},
    {key:'alpha_relaxed', label:'Relaxé mais éveillé (Alpha, 432 Hz)'},
    {key:'stress', label:'Réduire stress/anxiété (528 Hz, Theta)'}
  ],
  energy: [
    {key:'focus', label:'Concentration (Beta)'} ,
    {key:'creativity', label:'Créativité (417 Hz, Theta)'} ,
    {key:'euphoria', label:'Euphorie/joie (528 Hz, Gamma)'} ,
  ],
  spirit: [
    {key:'intuition', label:'Intuition (741/852 Hz)'} ,
    {key:'higher_conscious', label:'Conscience supérieure (963 Hz)'} ,
  ]
}

export default function Intent(){
  const [primary, setPrimary] = useState<'heal'|'balance'|'energy'|'spirit'>('heal')
  const [secondary, setSecondary] = useState<string>('pain_relief')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const navigate = useNavigate()

  useEffect(()=>{
    setSecondary(SECONDARY[primary][0].key)
  }, [primary])

  async function handleContinue(){
    setLoading(true); setError(null)
    try{
      const preset = await apiPreset({ primary, secondary })
      sessionStorage.setItem('preset', JSON.stringify(preset))
      navigate('/customize')
    }catch(e:any){ setError(e.message || 'Erreur de preset') }
    finally{ setLoading(false) }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Quel est votre objectif principal ?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['heal','balance','energy','spirit'] as const).map(k=> (
            <button key={k} onClick={()=>setPrimary(k)} className={`px-3 py-2 rounded border ${primary===k? 'bg-primary-600 text-white' : 'bg-white'}`}>{k}</button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Affinez votre intention</h3>
        <div className="grid gap-2">
          {SECONDARY[primary].map(item => (
            <label key={item.key} className="flex items-center gap-3 p-2 rounded border">
              <input type="radio" name="secondary" checked={secondary===item.key} onChange={()=>setSecondary(item.key)} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <button onClick={handleContinue} disabled={loading} className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-50">Continuer</button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  )
}
