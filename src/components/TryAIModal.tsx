import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, Check, ArrowRight } from 'lucide-react';

interface TryAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateAIAddon: () => void;
  isAddonActive: boolean;
}

export const TryAIModal: React.FC<TryAIModalProps> = ({
  isOpen,
  onClose,
  onActivateAIAddon,
  isAddonActive,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text: 'Hello! I am your Workspace AI Assistant. You can ask me to summarize documents, generate automated workflows, extract key billing metrics, or organize your workspace.',
      time: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Analyze our storage usage & suggest optimizations',
    'Draft an approval workflow for invoice expenses',
    'Summarize key differences between Plus and Premium',
    'Generate team member permission policies',
  ];

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || query;
    if (!messageText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setIsLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = messageText.toLowerCase();

      if (lower.includes('storage') || lower.includes('usage')) {
        reply =
          '📊 **Storage & Workspace Breakdown:**\n- Current Usage: 0.42 GB / 1.00 GB (42% capacity)\n- Largest folders: `/projects/assets` (210 MB), `/recordings` (140 MB)\n- **Recommendation**: Upgrading to Plus gives you unlimited storage and automated artifact versioning.';
      } else if (lower.includes('workflow') || lower.includes('invoice') || lower.includes('approval')) {
        reply =
          '⚡ **Generated Multi-Step Workflow:**\n1. **Trigger**: New Invoice uploaded to GoodWriter\n2. **Action**: Extract line items with AI parsing\n3. **Condition**: If amount > $500 → Route to Admin for approval\n4. **Notification**: Send Slack webhook & email confirmation.';
      } else if (lower.includes('plus') || lower.includes('premium') || lower.includes('differ')) {
        reply =
          '💡 **Plus vs Premium Quick Comparison:**\n- **Plus ($12/user/mo)**: Ideal for growing teams needing unlimited timeline views, private docs, Google SSO, and custom workflow steps.\n- **Premium ($16/user/mo)**: Adds enterprise security (ACL, DLP, custom terms of service), Priority Support, and advanced capacity planning.';
      } else {
        reply = `✨ I have processed your request for "${messageText}". With the Workspace AI add-on, your team gets instant context retrieval across 100+ documents, automated task triggers, and smart search integrations.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Workspace AI Intelligence</h3>
                <span className="bg-blue-500/10 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Ask anything about your team, projects, or billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-line leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-8">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Workspace AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 text-[11px] font-medium transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI to analyze data, summarize docs, or create a workflow..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 bg-slate-50 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Add-on Upsell Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Want continuous AI integration across all workspace apps?
            </span>
            <button
              onClick={() => {
                onActivateAIAddon();
                onClose();
              }}
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              {isAddonActive ? 'AI Addon Active ✓' : 'Add to Plan for $4/mo →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
