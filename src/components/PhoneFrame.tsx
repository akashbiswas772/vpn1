import React, { useState, useEffect } from 'react';
import { Wifi, Key, Battery, Bell } from 'lucide-react';
import { ConnectionState, ProxyConfig, TrafficStats } from '../types/proxy';
import { NotificationShade } from './NotificationShade';

interface PhoneFrameProps {
  children: React.ReactNode;
  connectionState: ConnectionState;
  config: ProxyConfig;
  stats: TrafficStats;
  onDisconnect: () => void;
  isBackgrounded: boolean;
  onToggleBackground: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  connectionState,
  config,
  stats,
  onDisconnect,
  isBackgrounded,
  onToggleBackground
}) => {
  const [showNotificationShade, setShowNotificationShade] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:42');

  const isConnected = connectionState === 'CONNECTED';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[420px] rounded-[48px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800/90 transition-all duration-500">
      {/* Outer Phone Shell Accents */}
      <div className="relative w-full rounded-[40px] bg-slate-950 overflow-hidden flex flex-col h-[780px] shadow-inner border border-slate-800/60">
        
        {/* Android Status Bar */}
        <div
          onClick={() => setShowNotificationShade(!showNotificationShade)}
          className="relative z-30 h-10 px-5 flex items-center justify-between text-xs text-slate-300 font-mono select-none cursor-pointer bg-slate-950/80 backdrop-blur-md border-b border-slate-900 hover:bg-slate-900/60 transition-colors"
          title="Click to pull down Android Notification Shade"
        >
          {/* Time & Notifications */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{currentTime}</span>
            {isConnected && (
              <span className="flex items-center text-emerald-400" title="VPN Active">
                <Key className="w-3.5 h-3.5 rotate-45" />
              </span>
            )}
            <Bell className="w-3 h-3 text-slate-500 hover:text-slate-300 transition-colors" />
          </div>

          {/* Front Camera Notch Punch hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-black ring-2 ring-slate-800/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

          {/* Status Icons: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-semibold text-slate-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">96%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
            </div>
          </div>
        </div>

        {/* Pull-down Notification Shade */}
        <NotificationShade
          isOpen={showNotificationShade}
          onClose={() => setShowNotificationShade(false)}
          connectionState={connectionState}
          config={config}
          stats={stats}
          onDisconnect={onDisconnect}
        />

        {/* Screen Content or Backgrounded Android Home Screen */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {isBackgrounded ? (
            /* Android Home Screen Simulator */
            <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
              <div className="space-y-6 pt-6">
                <div className="text-center">
                  <div className="text-5xl font-extralight text-slate-100 font-mono tracking-tight">
                    {currentTime}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Sunday, October 25 · Foreground Service Active
                  </div>
                </div>

                {/* Persistent Android Background Notification Widget */}
                {isConnected && (
                  <div
                    onClick={() => onToggleBackground()}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg cursor-pointer hover:border-emerald-500/60 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Key className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          Akash Proxy Pro · Active
                        </p>
                        <p className="text-[11px] text-emerald-400 font-mono truncate">
                          {config.protocol}://{config.host || '194.26.29.40'} · 0 DNS Leaks
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of Android launcher icons */}
              <div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                  <button
                    onClick={onToggleBackground}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                      <Key className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium truncate w-14">
                      Akash Pro
                    </span>
                  </button>

                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600/30 flex items-center justify-center text-sky-400">
                      <Wifi className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-400">Browser</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                      <Bell className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-400">Messages</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600/30 flex items-center justify-center text-amber-400">
                      <Battery className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-400">Settings</span>
                  </div>
                </div>

                <p className="text-center text-[11px] text-slate-500 font-mono">
                  Tap 'Akash Pro' or gesture bar to return
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Android Gesture Navigation Bar */}
        <div className="relative z-30 h-10 px-6 flex items-center justify-around bg-slate-950/90 border-t border-slate-900 select-none">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              if (isBackgrounded) onToggleBackground();
            }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Android Back"
          >
            <div className="w-3 h-3 border-b-2 border-l-2 border-slate-400 rotate-45" />
          </button>

          {/* Home Pill Button (Simulates Foreground Service when app is swiped) */}
          <button
            type="button"
            onClick={onToggleBackground}
            className="px-6 py-2 group"
            title="Simulate Android Home Button (Background Foreground Service)"
          >
            <div className="w-16 h-1 rounded-full bg-slate-600 group-hover:bg-slate-300 transition-colors" />
          </button>

          {/* Recents Button */}
          <button
            type="button"
            onClick={() => setShowNotificationShade(!showNotificationShade)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Pull Notifications / Recents"
          >
            <div className="w-3 h-3 border-2 border-slate-400 rounded-sm" />
          </button>
        </div>

      </div>
    </div>
  );
};
