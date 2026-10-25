import React, { useState } from 'react';
import { Eye, EyeOff, Globe, Clock, ShieldCheck, ChevronDown, ChevronUp, Server, Hash, User, KeyRound } from 'lucide-react';
import { ProxyConfig, ProxyProtocol } from '../types/proxy';
import { resolveProxyGeo } from '../utils/timezoneHelper';

interface ProxyConfigFormProps {
  config: ProxyConfig;
  onChange: (updated: Partial<ProxyConfig>) => void;
  disabled?: boolean;
}

export const ProxyConfigForm: React.FC<ProxyConfigFormProps> = ({ config, onChange, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const geo = resolveProxyGeo(config.host || '194.26.29.40');

  return (
    <div className="space-y-4">
      {/* Protocol Selection Dropdown & Timezone Switch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Protocol Dropdown */}
        <div>
          <label htmlFor="proxy-protocol-select" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Proxy Protocol</span>
          </label>
          <div className="relative">
            <select
              id="proxy-protocol-select"
              value={config.protocol}
              disabled={disabled}
              onChange={(e) => onChange({ protocol: e.target.value as ProxyProtocol })}
              className="w-full appearance-none px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60 cursor-pointer transition-all"
            >
              <option value="SOCKS5">SOCKS5 (Full UDP/TCP - Recommended)</option>
              <option value="HTTPS">HTTPS (Encrypted SSL Tunnel)</option>
              <option value="HTTP">HTTP (Standard Web Proxy)</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Timezone Matching Switch */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="tz-match-switch" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 cursor-pointer">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Timezone Matching</span>
            </label>
            <span className="text-[11px] font-mono text-emerald-400">
              {config.timezoneMatch ? 'Active' : 'Off'}
            </span>
          </div>

          <div
            onClick={() => !disabled && onChange({ timezoneMatch: !config.timezoneMatch })}
            className={`w-full p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              config.timezoneMatch
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-slate-600'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-sm">{geo.flag}</span>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {config.timezoneMatch ? geo.timezone : 'Device Default'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {config.timezoneMatch ? `${geo.city} · ${geo.timezoneOffset}` : 'Auto-sync disabled'}
                </p>
              </div>
            </div>

            {/* Switch Toggle pill */}
            <button
              type="button"
              id="tz-match-switch"
              role="switch"
              aria-checked={config.timezoneMatch}
              aria-label="Toggle timezone matching"
              disabled={disabled}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                config.timezoneMatch ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  config.timezoneMatch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Host & Port Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label htmlFor="proxy-ip-host-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>Proxy IP / Hostname</span>
          </label>
          <input
            id="proxy-ip-host-input"
            type="text"
            value={config.host}
            disabled={disabled}
            onChange={(e) => onChange({ host: e.target.value })}
            placeholder="e.g. 194.26.29.40"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60 transition-all"
          />
        </div>

        <div>
          <label htmlFor="proxy-port-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>Port</span>
          </label>
          <input
            id="proxy-port-input"
            type="number"
            min={1}
            max={65535}
            value={config.port}
            disabled={disabled}
            onChange={(e) => onChange({ port: e.target.value })}
            placeholder="1080"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60 transition-all"
          />
        </div>
      </div>

      {/* Username & Password Authentication */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="proxy-username-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Username (Optional)</span>
          </label>
          <input
            id="proxy-username-input"
            type="text"
            value={config.username || ''}
            disabled={disabled}
            onChange={(e) => onChange({ username: e.target.value })}
            placeholder="Proxy username"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60 transition-all"
          />
        </div>

        <div>
          <label htmlFor="proxy-password-input" className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Password (Optional)</span>
          </label>
          <div className="relative">
            <input
              id="proxy-password-input"
              type={showPassword ? 'text' : 'password'}
              value={config.password || ''}
              disabled={disabled}
              onChange={(e) => onChange({ password: e.target.value })}
              placeholder="Proxy password"
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Tun2Socks & VpnService Settings Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>VpnService & tun2socks Parameters</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 animate-in fade-in duration-150">
            {/* DNS Leak Protection */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strict DNS Leak Protection</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Routes all port 53 traffic into TUN interface to prevent ISP DNS visibility
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.dnsLeakProtection}
                aria-label="Toggle DNS leak protection"
                disabled={disabled}
                onClick={() => onChange({ dnsLeakProtection: !config.dnsLeakProtection })}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                  config.dnsLeakProtection ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.dnsLeakProtection ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Kill Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <p className="text-xs font-semibold text-slate-200">System Kill Switch</p>
                <p className="text-[11px] text-slate-400">
                  Block non-VPN traffic if tun2socks tunnel drops unexpectedly
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.killSwitch}
                aria-label="Toggle system kill switch"
                disabled={disabled}
                onClick={() => onChange({ killSwitch: !config.killSwitch })}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                  config.killSwitch ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.killSwitch ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* TUN MTU & DNS Upstream */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <label htmlFor="tun-mtu-input" className="block text-[11px] font-medium text-slate-400 mb-1">TUN MTU</label>
                <input
                  id="tun-mtu-input"
                  type="number"
                  value={config.mtu}
                  disabled={disabled}
                  onChange={(e) => onChange({ mtu: parseInt(e.target.value, 10) || 1500 })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
              <div>
                <label htmlFor="upstream-dns-input" className="block text-[11px] font-medium text-slate-400 mb-1">Upstream DNS</label>
                <input
                  id="upstream-dns-input"
                  type="text"
                  value={config.dnsServer}
                  disabled={disabled}
                  onChange={(e) => onChange({ dnsServer: e.target.value })}
                  placeholder="1.1.1.1"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
