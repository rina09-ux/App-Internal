import React, { useState } from 'react';
import { X, Sparkles, Send, Bot } from 'lucide-react';

interface TryAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateAIAddon: () => void;
  isAddonActive: boolean;
}

type Message = { sender: 'user' | 'ai'; text: string; time: string };

const CORE_URL = (import.meta.env.VITE_NUSASEC_CORE_URL || import.meta.env.VITE_NUSASEC_CORE_API_URL || '').replace(/\/$/, '');
const AI_URL = (import.meta.env.VITE_NUSASEC_AI_URL || '').replace(/\/$/, '');

async function askRealAI(message: string): Promise<string> {
  if (!CORE_URL || !AI_URL) throw new Error('Konfigurasi VITE_NUSASEC_CORE_URL dan VITE_NUSASEC_AI_URL wajib tersedia untuk AI Internal.');
  const delegation = await fetch(`${CORE_URL}/api/v1/auth/ai/delegation`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ scopes: ['accounts:read', 'risk:read', 'compliance:read', 'crypto:read', 'audit:read', 'scans:read'] }),
  });
  const delegationBody = await delegation.json().catch(() => ({}));
  if (!delegation.ok || typeof delegationBody?.token !== 'string') throw new Error(delegationBody?.detail || `AI delegation gagal (${delegation.status})`);

  const response = await fetch(`${AI_URL}/v1/chat`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-NusaSec-Core-Delegation': delegationBody.token },
    body: JSON.stringify({
      message,
      intent: 'ask',
      context: { mode: 'internal', access_tier: 'internal_authorized', language_requested: 'id', locale: 'id-ID', depth: 'standard', response_style: 'natural_conversation' },
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.detail || `NusaSec-AI gagal (${response.status})`);
  return body?.answer || 'NusaSec-AI tidak mengembalikan jawaban.';
}

export const TryAIModal: React.FC<TryAIModalProps> = ({ isOpen, onClose, onActivateAIAddon, isAddonActive }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'NusaSec-AI terhubung melalui Core delegation. Tanyakan tentang security, compliance, operations, PQC, atau customer intelligence.', time: 'Ready' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const send = async (text?: string) => {
    const messageText = (text ?? query).trim();
    if (!messageText || isLoading) return;
    setMessages((prev) => [...prev, { sender: 'user', text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setQuery(''); setIsLoading(true);
    try {
      const answer = await askRealAI(messageText);
      setMessages((prev) => [...prev, { sender: 'ai', text: answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: err instanceof Error ? err.message : 'NusaSec-AI request gagal.', time: 'Error' }]);
    } finally { setIsLoading(false); }
  };

  const prompts = ['Summarize current security risks', 'Explain PQC readiness', 'Review compliance posture', 'Give an operations overview'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Sparkles className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-slate-900">Workspace AI Intelligence</h3><p className="text-[11px] text-slate-500">Core delegation → NusaSec-AI</p></div></div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
          {messages.map((m, idx) => <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center"><Bot className="w-3.5 h-3.5" /></div>}
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-line leading-relaxed shadow-2xs ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'}`}><div>{m.text}</div><div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>{m.time}</div></div>
          </div>)}
          {isLoading && <div className="pl-8 text-xs text-slate-400">NusaSec-AI sedang memproses…</div>}
        </div>
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto">{prompts.map((p) => <button key={p} onClick={() => void send(p)} className="shrink-0 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-medium">{p}</button>)}</div>
        <div className="p-3 border-t border-slate-100 bg-white"><form onSubmit={(e) => { e.preventDefault(); void send(); }} className="flex items-center gap-2"><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tanyakan sesuatu tentang workspace…" className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50" /><button type="submit" disabled={!query.trim() || isLoading} className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50"><Send className="w-4 h-4" /></button></form><button onClick={() => { onActivateAIAddon(); onClose(); }} className="mt-2.5 text-[11px] text-blue-600 font-bold">{isAddonActive ? 'AI Addon Active ✓' : 'Configure AI Add-on'}</button></div>
      </div>
    </div>
  );
};
