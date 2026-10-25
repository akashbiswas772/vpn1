import React, { useState } from 'react';
import { Clipboard, Check, Sparkles, AlertCircle } from 'lucide-react';
import { parseProxyString } from '../utils/proxyParser';
import { ProxyConfig, ProxyProtocol } from '../types/proxy';

interface QuickPasteBarProps {
  onParsed: (parsed: Partial<ProxyConfig>) => void;
  currentProtocol: ProxyProtocol;
}

const PRESET_PROXIES = [
  {
    label: 'US Residential SOCKS5',
    value: '194.26.29.40:1080:akash_user:AkashSecret99',
    protocol: 'SOCKS5' as ProxyProtocol
  },
  {
    label: 'Frankfurt Datacenter HTTPS',
    value: '185.220.101.5:8080:fra_proxy:FastTunnel88',
    protocol: 'HTTPS' as ProxyProtocol
  },
  {
    label: 'London High-Speed HTTP',
    value: '45.142.180.12:3128:london_gw:SecPass2026',
    protocol: 'HTTP' as ProxyProtocol
  }
];

export const QuickPasteBar: React.FC<QuickPasteBarProps> = ({ onParsed, currentProtocol }) => {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });

  const handleProcessInput = (text: string) => {
    setInputValue(text);
    if (!text.trim()) {
      setFeedback({ message: '', type: null });
      return;
    }

    const result = parseProxyString(text, currentProtocol);
    if (result.success && result.host && result.port) {
      onParsed({
        host: result.host,
        port: result.port,
        username: result.username || '',
        password: result.password || '',
        protocol: result.protocol || currentProtocol
      });

      const userBadge = result.username ? ` • Auth: ${result.username}` : ' • No Auth';
      setFeedback({
        message: `Parsed: ${result.host}:${result.port}${userBadge} (${result.protocol || currentProtocol})`,
        type: 'success'
      });
    } else {
      setFeedback({
        message: result.error || 'Invalid format. Use IP:Port:Username:Password',
        type: 'error'
      });
    }
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleProcessInput(text);
      }
    } catch {
      // In case clipboard permission is denied or restricted in iframe
      setFeedback({
        message: 'Please paste directly into the input box below (Ctrl+V / Cmd+V)',
        type: 'error'
      });
    }
  };

  const loadPreset = (preset: typeof PRESET_PROXIES[0]) => {
    handleProcessInput(preset.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="quick-paste-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Paste (Auto-Parse)</span>
        </label>
        <span className="text-[11px] font-mono text-slate-500">
          IP:Port:Username:Password
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          id="quick-paste-input"
          type="text"
          value={inputValue}
          onChange={(e) => handleProcessInput(e.target.value)}
          placeholder="Paste IP:Port:Username:Password here..."
          className="w-full pl-3.5 pr-24 py-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setFeedback({ message: '', type: null });
              }}
              className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={handleClipboardPaste}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Paste</span>
          </button>
        </div>
      </div>

      {/* Parse Feedback Banner */}
      {feedback.type && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
              : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}
          <span className="truncate">{feedback.message}</span>
        </div>
      )}

      {/* Presets Quick Links */}
      <div className="pt-1 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-500">Presets:</span>
        {PRESET_PROXIES.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => loadPreset(p)}
            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/60 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
