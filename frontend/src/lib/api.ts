export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api';

export async function apiUpload(file: File){
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export type IntentionPayload = {
  primary: 'heal'|'balance'|'energy'|'spirit';
  secondary: string;
}

export async function apiPreset(payload: IntentionPayload){
  const res = await fetch(`${API_BASE}/preset`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export type ProcessPayload = {
  file_id: string;
  target_a4_hz?: number | null;
  snap_to_freq_hz?: number | null;
  tempo_change_percent?: number;
  binaural?: { enabled: boolean; band?: string|null; beat_hz?: number|null; volume?: number } | null;
  export_format?: 'wav'|'mp3';
  preview_seconds?: number | null;
}

export async function apiProcess(payload: ProcessPayload){
  const res = await fetch(`${API_BASE}/process`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export function apiOriginalUrl(fileId: string){
  return `${API_BASE}/original/${fileId}`
}

export function apiDownloadUrl(jobId: string){
  return `${API_BASE}/download/${jobId}`
}
