import React, { useState } from 'react';
import { Layers, Network, Shield, ArrowRight, Lock, CheckCircle2, Info } from 'lucide-react';
import { ProxyConfig } from '../types/proxy';

interface Tun2SocksVisualizerProps {
  config: ProxyConfig;
  isConnected: boolean;
}

export const Tun2SocksVisualizer: React.FC<Tun2SocksVisualizerProps> = ({ config, isConnected }) => {
  const [selectedLayer, setSelectedLayer] = useState<'apps' | 'tun' | 'tun2socks' | 'protect' | 'upstream'>('tun2socks');

  const layerExplanations = {
    apps: {
      title: '1. Whole-Device Applications & OS Layer',
      desc: 'All user apps (browsers, banking, games, background sync) generate standard TCP, UDP, and DNS packets. No per-app proxy configuration is needed.',
      codeSnippet: '// Android OS default routing table directs 0.0.0.0/0 to tun0 interface'
    },
    tun: {
      title: '2. Android VpnService & Virtual TUN Interface',
      desc: 'VpnService.Builder establishes a virtual network interface (tun0) assigned IP 10.0.0.2/32 with route 0.0.0.0/0 and ::/0. It delivers raw Layer-3 IP packets via a ParcelFileDescriptor.',
      codeSnippet: 'val builder = VpnService.Builder()\n  .addAddress("10.0.0.2", 32)\n  .addRoute("0.0.0.0", 0)\n  .addDnsServer("1.1.1.1")\nval pfd = builder.establish()'
    },
    tun2socks: {
      title: '3. tun2socks Traffic Translation Core',
      desc: 'The tun2socks native engine (compiled C/Go library) reads raw IP packets from the TUN descriptor, reassembles TCP connections & UDP datagrams, and translates them into authenticated SOCKS5/HTTP proxy payloads.',
      codeSnippet: '// Reassembles IP packets -> SOCKS5 handshake (RFC 1928)\nTun2socks.start(vpnService, tunFd, "socks5://user:pass@host:port", 1500)'
    },
    protect: {
      title: '4. VpnService.protect() Routing Loop Prevention',
      desc: 'Crucial security mechanism: The outbound proxy socket is protected via vpnService.protect(socketFd). This tells the Linux kernel to route the proxy connection directly out via physical Wi-Fi/Cellular, preventing infinite VPN recursion loops.',
      codeSnippet: '// Protect socket before connecting to proxy host:\nvpnService.protect(proxySocketFd) // returns true'
    },
    upstream: {
      title: '5. Authenticated Upstream Proxy & Zero DNS Leak',
      desc: `Routes through ${config.protocol} proxy at ${config.host || '194.26.29.40'}:${config.port || 1080}. Upstream DNS is pinned to ${config.dnsServer || '1.1.1.1'} over the tunnel, ensuring 0% ISP DNS leakage.`,
      codeSnippet: `// Handshake completed: ${config.protocol}://${config.host || '194.26.29.40'}:${config.port || 8080}`
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            tun2socks & VpnService Architecture
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400">
          {isConnected ? 'TUN Interface Active' : 'Engine Standby'}
        </span>
      </div>

      {/* Interactive Pipeline Blocks */}
      <div className="grid grid-cols-5 gap-1.5 text-center">
        {/* Step 1: Apps */}
        <button
          type="button"
          onClick={() => setSelectedLayer('apps')}
          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
            selectedLayer === 'apps'
              ? 'bg-slate-800 border-emerald-500/80 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Network className="w-4 h-4 text-sky-400 mb-1" />
          <span className="text-[10px] font-semibold text-slate-200">Device Apps</span>
          <span className="text-[9px] text-slate-500 font-mono">0.0.0.0/0</span>
        </button>

        {/* Step 2: TUN Interface */}
        <button
          type="button"
          onClick={() => setSelectedLayer('tun')}
          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
            selectedLayer === 'tun'
              ? 'bg-slate-800 border-emerald-500/80 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Shield className="w-4 h-4 text-indigo-400 mb-1" />
          <span className="text-[10px] font-semibold text-slate-200">TUN (tun0)</span>
          <span className="text-[9px] text-slate-500 font-mono">10.0.0.2</span>
        </button>

        {/* Step 3: tun2socks */}
        <button
          type="button"
          onClick={() => setSelectedLayer('tun2socks')}
          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
            selectedLayer === 'tun2socks'
              ? 'bg-slate-800 border-emerald-500/80 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold mb-1">
            T2S
          </div>
          <span className="text-[10px] font-semibold text-slate-200">tun2socks</span>
          <span className="text-[9px] text-slate-500 font-mono">JNI Core</span>
        </button>

        {/* Step 4: Protect */}
        <button
          type="button"
          onClick={() => setSelectedLayer('protect')}
          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
            selectedLayer === 'protect'
              ? 'bg-slate-800 border-emerald-500/80 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-[10px] font-semibold text-slate-200">protect()</span>
          <span className="text-[9px] text-slate-500 font-mono">Loop Guard</span>
        </button>

        {/* Step 5: Remote Proxy */}
        <button
          type="button"
          onClick={() => setSelectedLayer('upstream')}
          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
            selectedLayer === 'upstream'
              ? 'bg-slate-800 border-emerald-500/80 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-teal-400 mb-1" />
          <span className="text-[10px] font-semibold text-slate-200">{config.protocol}</span>
          <span className="text-[9px] text-slate-500 font-mono">Upstream</span>
        </button>
      </div>

      {/* Explanatory Details Box */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{layerExplanations[selectedLayer].title}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {layerExplanations[selectedLayer].desc}
        </p>
        <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
          <code>{layerExplanations[selectedLayer].codeSnippet}</code>
        </pre>
      </div>
    </div>
  );
};
