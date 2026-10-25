import React from 'react';
import { ArrowDown, ArrowUp, Activity, Timer, ShieldCheck, Zap } from 'lucide-react';
import { TrafficStats, ProxyConfig } from '../types/proxy';
import { resolveProxyGeo } from '../utils/timezoneHelper';

interface ConnectionMetricsProps {
  stats: TrafficStats;
  config: ProxyConfig;
  isConnected: boolean;
}

export const ConnectionMetrics: React.FC<ConnectionMetricsProps> = ({ stats, config, isConnected }) => {
  const geo = resolveProxyGeo(config.host || '194.26.29.40');

  const formatSeconds = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadMb = (stats.downloadSpeedKbps / 1024).toFixed(2);
  const uploadMb = (stats.uploadSpeedKbps / 1024).toFixed(2);

  return (
    <div className="space-y-3">
      {/* 4-KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Download Speed */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Download</span>
            <ArrowDown className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400' : 'text-slate-600'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tracking-tight text-slate-100 tabular-nums">
              {isConnected ? downloadMb : '0.00'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">MB/s</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            Total: {stats.totalDownloadedMb.toFixed(1)} MB
          </div>
        </div>

        {/* Upload Speed */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Upload</span>
            <ArrowUp className={`w-3.5 h-3.5 ${isConnected ? 'text-sky-400' : 'text-slate-600'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tracking-tight text-slate-100 tabular-nums">
              {isConnected ? uploadMb : '0.00'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">MB/s</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
            Total: {stats.totalUploadedMb.toFixed(1)} MB
          </div>
        </div>

        {/* Latency */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Ping</span>
            <Activity className={`w-3.5 h-3.5 ${isConnected ? 'text-teal-400' : 'text-slate-600'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tracking-tight text-slate-100 tabular-nums">
              {isConnected ? stats.pingMs : '--'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ms</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            {isConnected ? 'Optimal Tunnel' : 'Disconnected'}
          </div>
        </div>

        {/* Duration */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Duration</span>
            <Timer className={`w-3.5 h-3.5 ${isConnected ? 'text-amber-400' : 'text-slate-600'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tracking-tight text-slate-100 tabular-nums">
              {isConnected ? formatSeconds(stats.durationSeconds) : '00:00:00'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Foreground Service
          </div>
        </div>
      </div>

      {/* Network Security & Location Strip */}
      {isConnected && (
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{geo.flag}</span>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {geo.city}, {geo.country} · <span className="font-mono text-emerald-400">{config.host || geo.ipPrefix}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {geo.isp} · Timezone: {config.timezoneMatch ? geo.timezone : 'Standard Device'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>DNS Leak Shield 100%</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{stats.packetsForwarded.toLocaleString()} pkts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
