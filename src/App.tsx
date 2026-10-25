/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Layers,
  FileCode,
  Bookmark,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Monitor
} from 'lucide-react';
import { ProxyConfig, ConnectionState, TrafficStats, ProxyProtocol } from './types/proxy';
import { PhoneFrame } from './components/PhoneFrame';
import { QuickPasteBar } from './components/QuickPasteBar';
import { ProxyConfigForm } from './components/ProxyConfigForm';
import { ConnectButton } from './components/ConnectButton';
import { ConnectionMetrics } from './components/ConnectionMetrics';
import { Tun2SocksVisualizer } from './components/Tun2SocksVisualizer';
import { CodeViewerModal } from './components/CodeViewerModal';
import { SavedProfilesModal } from './components/SavedProfilesModal';
import { ApkDownloadGuideModal } from './components/ApkDownloadGuideModal';
import { downloadAndroidProjectZip } from './utils/projectGenerator';

const INITIAL_PROXY_CONFIG: ProxyConfig = {
  id: 'default-config',
  name: 'Akash High-Performance Proxy',
  protocol: 'SOCKS5',
  host: '194.26.29.40',
  port: 1080,
  username: 'akash_user',
  password: 'AkashSecret99',
  timezoneMatch: true,
  dnsLeakProtection: true,
  killSwitch: false,
  bypassLan: true,
  mtu: 1500,
  dnsServer: '1.1.1.1'
};

export default function App() {
  const [config, setConfig] = useState<ProxyConfig>(INITIAL_PROXY_CONFIG);
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [isBackgrounded, setIsBackgrounded] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'phone' | 'workbench'>('split');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showProfilesModal, setShowProfilesModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [stats, setStats] = useState<TrafficStats>({
    uploadSpeedKbps: 0,
    downloadSpeedKbps: 0,
    totalUploadedMb: 12.4,
    totalDownloadedMb: 84.7,
    pingMs: 0,
    durationSeconds: 0,
    packetsForwarded: 14205,
    dnsQueriesProtected: 184
  });

  const connectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isConnected = connectionState === 'CONNECTED';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Simulate traffic throughput and packet stats when connected
  useEffect(() => {
    if (isConnected) {
      statsTimerRef.current = setInterval(() => {
        setStats((prev) => {
          // Dynamic jitter simulating active Android device browsing
          const baseDown = 2200 + Math.random() * 1800; // ~2.2 - 4.0 MB/s
          const baseUp = 450 + Math.random() * 400; // ~450 - 850 KB/s
          const addedDownMb = (baseDown / 1024 / 8) * 0.5;
          const addedUpMb = (baseUp / 1024 / 8) * 0.5;
          const addedPackets = Math.floor(18 + Math.random() * 32);

          return {
            ...prev,
            downloadSpeedKbps: Math.round(baseDown),
            uploadSpeedKbps: Math.round(baseUp),
            totalDownloadedMb: prev.totalDownloadedMb + addedDownMb,
            totalUploadedMb: prev.totalUploadedMb + addedUpMb,
            pingMs: Math.round(36 + Math.random() * 14),
            durationSeconds: prev.durationSeconds + 1,
            packetsForwarded: prev.packetsForwarded + addedPackets,
            dnsQueriesProtected: prev.dnsQueriesProtected + (Math.random() > 0.8 ? 1 : 0)
          };
        });
      }, 1000);
    } else {
      if (statsTimerRef.current) clearInterval(statsTimerRef.current);
      setStats((prev) => ({
        ...prev,
        uploadSpeedKbps: 0,
        downloadSpeedKbps: 0,
        pingMs: 0,
        durationSeconds: 0
      }));
    }

    return () => {
      if (statsTimerRef.current) clearInterval(statsTimerRef.current);
    };
  }, [isConnected]);

  // Connect Handler with progressive multi-stage handshake
  const handleConnect = () => {
    if (!config.host || !config.port) {
      showToast('Please specify a valid IP/Host and Port');
      return;
    }

    setConnectionState('PREPARING_VPN');
    
    // Stage 1: VpnService.prepare()
    connectionTimerRef.current = setTimeout(() => {
      setConnectionState('STARTING_TUN');

      // Stage 2: TUN Interface creation (10.0.0.2/32)
      connectionTimerRef.current = setTimeout(() => {
        setConnectionState('CONNECTING');

        // Stage 3: tun2socks handshake & socket protect
        connectionTimerRef.current = setTimeout(() => {
          setConnectionState('CONNECTED');
          showToast(`Akash Proxy Pro Connected: ${config.protocol}://${config.host}:${config.port}`);
        }, 600);
      }, 600);
    }, 500);
  };

  const handleDisconnect = () => {
    if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
    setConnectionState('DISCONNECTING');
    setTimeout(() => {
      setConnectionState('DISCONNECTED');
      showToast('Akash Proxy Pro Disconnected · TUN interface closed');
    }, 400);
  };

  const handleQuickPasteParsed = (parsed: Partial<ProxyConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...parsed
    }));
    showToast(`Parsed: ${parsed.host}:${parsed.port} (${parsed.protocol || config.protocol})`);
  };

  const handleDownloadZip = async () => {
    try {
      await downloadAndroidProjectZip(config);
      showToast('Downloaded complete Android Studio project (.zip)');
    } catch {
      showToast('Could not download project ZIP');
    }
  };

  // Reusable Phone App Screen Content (used in Phone Frame)
  const renderPhoneAppContent = () => (
    <div className="flex-1 flex flex-col p-4 space-y-4">
      {/* App Header Bar within phone */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-100">Akash Proxy Pro</h1>
            <span className="text-[10px] text-slate-400 font-mono">Native VpnService</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowApkModal(true)}
            className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1 shadow-sm"
            title="Download .APK"
          >
            <Smartphone className="w-3 h-3" />
            <span>.APK</span>
          </button>
          <button
            onClick={() => setShowProfilesModal(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
            title="Saved Profiles"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Paste Bar */}
      <QuickPasteBar
        onParsed={handleQuickPasteParsed}
        currentProtocol={config.protocol}
      />

      {/* Primary Configuration Form */}
      <ProxyConfigForm
        config={config}
        onChange={(upd) => setConfig((prev) => ({ ...prev, ...upd }))}
        disabled={isConnected}
      />

      {/* Connect Button */}
      <div className="pt-1">
        <ConnectButton
          connectionState={connectionState}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>

      {/* Live Speed & Geo Card */}
      <ConnectionMetrics
        stats={stats}
        config={config}
        isConnected={isConnected}
      />

      {/* Notice about background service */}
      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Foreground Service active in background</span>
        <button
          onClick={() => setIsBackgrounded(true)}
          className="text-emerald-400 hover:underline font-mono text-[10px]"
        >
          Simulate Home Swipe
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen text-slate-100 transition-colors duration-700 ${
        isConnected
          ? 'bg-gradient-to-b from-[#06111f] via-[#041a24] to-[#030f14]'
          : 'bg-slate-950'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CodeViewerModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        config={config}
      />
      <SavedProfilesModal
        isOpen={showProfilesModal}
        onClose={() => setShowProfilesModal(false)}
        currentConfig={config}
        onSelectProfile={(p) => {
          setConfig(p);
          showToast(`Loaded profile: ${p.name}`);
        }}
      />
      <ApkDownloadGuideModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
        config={config}
      />

      {/* Strict Top Bar Contract: 3 Zones (Wordmark - 4 Links - 1 Action) */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-colors ${
            isConnected ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-emerald-400'
          }`}>
            <Radio className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0">
            Akash Proxy Pro
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setShowApkModal(true)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Download .APK</span>
          </button>
          <a
            href="#visualizer"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            tun2socks Architecture
          </a>
          <button
            onClick={() => setShowCodeModal(true)}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            VpnService Kotlin Code
          </button>
          <button
            onClick={() => setShowProfilesModal(true)}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Saved Profiles
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* View switcher buttons */}
          <div className="hidden lg:flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split Emulator and Workbench"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => setViewMode('phone')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'phone' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Phone View Only"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setViewMode('workbench')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'workbench' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Developer Workbench Only"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Workbench</span>
            </button>
          </div>

          <button
            onClick={() => setShowApkModal(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Get .APK File</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Dynamic Connected Banner (Emerald / Dark Blue theme transition) */}
        {isConnected && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-cyan-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Akash VPN Tunnel Active & Encrypted</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PROTECTED
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Whole-device traffic routed through {config.protocol} proxy at {config.host}:{config.port} via tun2socks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCodeModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 transition-colors flex items-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>View Kotlin Code</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Studio Viewport (Split or Single Column) */}
        <div className={`grid gap-8 items-start ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}>
          
          {/* Column 1: Android Phone Frame Emulator */}
          {(viewMode === 'split' || viewMode === 'phone') && (
            <div className={viewMode === 'split' ? 'lg:col-span-5' : 'max-w-md mx-auto'}>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Pixel 9 Pro · Android 15 Emulator</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>Status:</span>
                  <span className={isConnected ? 'text-emerald-400' : 'text-slate-400'}>
                    {isConnected ? 'TUN UP' : 'IDLE'}
                  </span>
                </div>
              </div>

              <PhoneFrame
                connectionState={connectionState}
                config={config}
                stats={stats}
                onDisconnect={handleDisconnect}
                isBackgrounded={isBackgrounded}
                onToggleBackground={() => setIsBackgrounded(!isBackgrounded)}
              >
                {renderPhoneAppContent()}
              </PhoneFrame>
            </div>
          )}

          {/* Column 2: Developer Workbench & Technical Console */}
          {(viewMode === 'split' || viewMode === 'workbench') && (
            <div className={`space-y-6 ${viewMode === 'split' ? 'lg:col-span-7' : 'max-w-5xl mx-auto'}`}>
              
              {/* Desktop Quick Console Card */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>Whole-Device Proxy Controller</span>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        VpnService + tun2socks
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Routes 100% of Android OS TCP, UDP, and DNS traffic through authenticated proxies
                    </p>
                  </div>

                  <button
                    onClick={() => setShowProfilesModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Profiles</span>
                  </button>
                </div>

                {/* Quick Paste Bar */}
                <QuickPasteBar
                  onParsed={handleQuickPasteParsed}
                  currentProtocol={config.protocol}
                />

                {/* Form fields */}
                <ProxyConfigForm
                  config={config}
                  onChange={(upd) => setConfig((prev) => ({ ...prev, ...upd }))}
                  disabled={isConnected}
                />

                {/* Connect CTA */}
                <ConnectButton
                  connectionState={connectionState}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />

                {/* Real-time telemetry */}
                <ConnectionMetrics
                  stats={stats}
                  config={config}
                  isConnected={isConnected}
                />
              </div>

              {/* tun2socks Architecture Inspector */}
              <div id="visualizer">
                <Tun2SocksVisualizer
                  config={config}
                  isConnected={isConnected}
                />
              </div>

              {/* Technical Architecture & Handover Documentation */}
              <div id="technical-spec" className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Fiverr / Cursor / Windsurf Handover Spec</span>
                  </h3>
                  <button
                    onClick={() => setShowCodeModal(true)}
                    className="text-emerald-400 hover:underline font-mono text-xs flex items-center gap-1"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Inspect Kotlin Files</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <p className="font-bold text-slate-200">1. VpnService.Builder & Packet Capture</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Creates a local <code className="text-emerald-400">tun0</code> virtual interface assigned <code className="text-emerald-400">10.0.0.2/32</code>. Routes <code className="text-emerald-400">0.0.0.0/0</code> with DNS servers <code className="text-emerald-400">1.1.1.1</code> and <code className="text-emerald-400">8.8.8.8</code> to block DNS leaks.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <p className="font-bold text-slate-200">2. tun2socks Translation Engine</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Accepts the TUN file descriptor and converts IP packets into standard TCP/UDP streams over SOCKS5, HTTP, or HTTPS proxies with credentials.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <p className="font-bold text-slate-200">3. VpnService.protect() Loop Guard</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      All socket descriptors opened by tun2socks are protected via <code className="text-emerald-400">vpnService.protect(fd)</code>, avoiding recursive packet loops.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <p className="font-bold text-slate-200">4. Foreground Service Keepalive</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Runs with <code className="text-emerald-400">startForeground()</code> and a persistent notification tray action. Kept alive even when the app is swiped or backgrounded.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Kotlin 2.0 · Coroutines · StateFlow · Jetpack Compose · Target SDK 35
                  </span>
                  <button
                    onClick={handleDownloadZip}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Ready Project (.ZIP)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Clean Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/60 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Akash Proxy Pro — Whole-Device Android VPN Proxy Suite
          </p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>VpnService API</span>
            <span>·</span>
            <span>tun2socks Engine</span>
            <span>·</span>
            <span>SOCKS5 / HTTPS / HTTP</span>
            <span>·</span>
            <span>Zero DNS Leak</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
