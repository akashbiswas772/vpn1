import React from 'react';
import { ShieldCheck, ArrowDown, ArrowUp, X, Power, Bell } from 'lucide-react';
import { ConnectionState, ProxyConfig, TrafficStats } from '../types/proxy';

interface NotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  connectionState: ConnectionState;
  config: ProxyConfig;
  stats: TrafficStats;
  onDisconnect: () => void;
}

export const NotificationShade: React.FC<NotificationShadeProps> = ({
  isOpen,
  onClose,
  connectionState,
  config,
  stats,
  onDisconnect,
}) => {
  if (!isOpen) return null;

  const isConnected = connectionState === 'CONNECTED';
  const isConnecting = connectionState === 'CONNECTING' || connectionState === 'STARTING_TUN' || connectionState === 'PREPARING_VPN';

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-start animate-in fade-in duration-150">
      <div className="bg-slate-900 border-b border-slate-800 text-slate-100 shadow-2xl rounded-b-3xl overflow-hidden p-4">
        {/* Android notification handle bar */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            <span>Android System Notifications</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close shade"
            aria-label="Close notification shade"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Foreground Service Persistent Notification */}
        <div className="mt-3">
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isConnected
              ? 'bg-slate-950/90 border-emerald-500/30 ring-1 ring-emerald-500/20'
              : isConnecting
              ? 'bg-slate-950/90 border-amber-500/30'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isConnecting
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wide text-slate-200">Akash Proxy Pro</span>
                    <span className="text-[10px] text-slate-500 font-mono">Foreground Service</span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {isConnected
                      ? `Connected to ${config.protocol}://${config.host || '194.26.29.40'}:${config.port || 8080}`
                      : isConnecting
                      ? 'Establishing TUN tunnel with tun2socks...'
                      : 'VPN Service Idle - Ready to connect'}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {isConnected
                      ? 'Whole-device network traffic is securely routed without DNS leaks'
                      : 'Touch to open Akash Proxy Pro configuration'}
                  </p>
                </div>
              </div>

              {isConnected && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60 shrink-0">
                  VPN ACTIVE
                </span>
              )}
            </div>

            {/* Speeds and action button */}
            {isConnected && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>{(stats.downloadSpeedKbps / 1024).toFixed(2)} MB/s</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-400">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{(stats.uploadSpeedKbps / 1024).toFixed(2)} MB/s</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onDisconnect();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 transition-colors flex items-center gap-1.5"
                >
                  <Power className="w-3 h-3" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-center">
          <div className="w-12 h-1 bg-slate-700/80 rounded-full mx-auto cursor-pointer" onClick={onClose} />
        </div>
      </div>

      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
