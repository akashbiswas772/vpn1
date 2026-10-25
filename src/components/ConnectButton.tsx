import React from 'react';
import { Power, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { ConnectionState } from '../types/proxy';

interface ConnectButtonProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  disabled?: boolean;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  connectionState,
  onConnect,
  onDisconnect,
  disabled
}) => {
  const isConnected = connectionState === 'CONNECTED';
  const isConnecting =
    connectionState === 'CONNECTING' ||
    connectionState === 'PREPARING_VPN' ||
    connectionState === 'STARTING_TUN';
  const isDisconnecting = connectionState === 'DISCONNECTING';

  const handleClick = () => {
    if (isConnected) {
      onDisconnect();
    } else if (!isConnecting && !isDisconnecting) {
      onConnect();
    }
  };

  const getStatusLabel = () => {
    switch (connectionState) {
      case 'PREPARING_VPN':
        return 'Requesting VpnService Consent...';
      case 'STARTING_TUN':
        return 'Configuring TUN & tun2socks Core...';
      case 'CONNECTING':
        return 'Authenticating Proxy Handshake...';
      case 'CONNECTED':
        return 'Connected · Whole Device Protected';
      case 'DISCONNECTING':
        return 'Releasing TUN Interface...';
      default:
        return 'Tap to Connect Whole-Device Proxy';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Dynamic tactile button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isConnecting || isDisconnecting}
        className={`relative group w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-semibold text-base tracking-wide transition-all duration-300 shadow-xl ${
          isConnected
            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400/50 hover:scale-[1.01] active:scale-[0.99]'
            : isConnecting || isDisconnecting
            ? 'bg-slate-800 text-slate-300 border border-slate-700 cursor-wait'
            : 'bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white shadow-sky-950/50 hover:shadow-emerald-900/30 hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        {/* Glow halo when connected */}
        {isConnected && (
          <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl pointer-events-none animate-pulse" />
        )}

        {isConnecting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <span className="font-mono text-sm tracking-normal">Connecting tun2socks...</span>
          </>
        ) : isDisconnecting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <span className="font-mono text-sm tracking-normal">Disconnecting...</span>
          </>
        ) : isConnected ? (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center">
              <Power className="w-5 h-5 text-slate-950" />
            </div>
            <span>DISCONNECT VPN PROXY</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Power className="w-5 h-5 text-white" />
            </div>
            <span>CONNECT PROXY PRO</span>
          </>
        )}
      </button>

      {/* Connection State Breadcrumb */}
      <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
        {isConnected ? (
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{getStatusLabel()}</span>
          </div>
        ) : isConnecting ? (
          <div className="flex items-center gap-1.5 text-amber-400">
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            <span>{getStatusLabel()}</span>
          </div>
        ) : (
          <span className="text-slate-400">{getStatusLabel()}</span>
        )}
      </div>
    </div>
  );
};
