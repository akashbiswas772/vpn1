import React, { useState } from 'react';
import { X, Bookmark, Plus, Trash2, Check, ExternalLink } from 'lucide-react';
import { ProxyConfig, ProxyProtocol } from '../types/proxy';

interface SavedProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ProxyConfig;
  onSelectProfile: (config: ProxyConfig) => void;
}

const DEFAULT_PROFILES: ProxyConfig[] = [
  {
    id: 'p-1',
    name: 'US East Residential (Akash NY)',
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
  },
  {
    id: 'p-2',
    name: 'Frankfurt Datacenter HTTPS',
    protocol: 'HTTPS',
    host: '185.220.101.5',
    port: 8080,
    username: 'fra_proxy',
    password: 'FastTunnel88',
    timezoneMatch: true,
    dnsLeakProtection: true,
    killSwitch: false,
    bypassLan: true,
    mtu: 1500,
    dnsServer: '8.8.8.8'
  },
  {
    id: 'p-3',
    name: 'Tokyo Fast Relay SOCKS5',
    protocol: 'SOCKS5',
    host: '103.152.220.8',
    port: 1080,
    username: 'tokyo_node',
    password: 'SecureJapan44',
    timezoneMatch: true,
    dnsLeakProtection: true,
    killSwitch: false,
    bypassLan: true,
    mtu: 1500,
    dnsServer: '1.1.1.1'
  }
];

export const SavedProfilesModal: React.FC<SavedProfilesModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSelectProfile
}) => {
  const [profiles, setProfiles] = useState<ProxyConfig[]>(() => {
    try {
      const stored = localStorage.getItem('akash_saved_profiles');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  });

  const [newProfileName, setNewProfileName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const saveToStorage = (updated: ProxyConfig[]) => {
    setProfiles(updated);
    try {
      localStorage.setItem('akash_saved_profiles', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveCurrent = () => {
    if (!newProfileName.trim()) return;
    const newProfile: ProxyConfig = {
      ...currentConfig,
      id: `p-${Date.now()}`,
      name: newProfileName.trim()
    };
    const updated = [newProfile, ...profiles];
    saveToStorage(updated);
    setNewProfileName('');
    setShowAddForm(false);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = profiles.filter((p) => p.id !== id);
    saveToStorage(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">Saved Proxy Profiles</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {profiles.length} profiles stored
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Current Proxy</span>
          </button>
        </div>

        {/* Add profile form */}
        {showAddForm && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-2 animate-in fade-in">
            <label htmlFor="new-profile-name-input" className="block text-xs font-medium text-slate-300">Profile Name</label>
            <div className="flex gap-2">
              <input
                id="new-profile-name-input"
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="e.g. My London Residential"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleSaveCurrent}
                disabled={!newProfileName.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Will save {currentConfig.protocol}://{currentConfig.host || '194.26.29.40'}:{currentConfig.port || 1080}
            </p>
          </div>
        )}

        {/* Profile list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {profiles.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No saved profiles. Click 'Save Current Proxy' to bookmark one.
            </div>
          ) : (
            profiles.map((p) => {
              const isSelected = p.host === currentConfig.host && p.port === currentConfig.port && p.protocol === currentConfig.protocol;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {p.protocol === 'SOCKS5' ? 'S5' : p.protocol === 'HTTPS' ? 'TLS' : 'HTTP'}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <span>{p.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {p.host}:{p.port} {p.username ? `· Auth: ${p.username}` : '· Open'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProfile(p.id, e)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete profile"
                      aria-label="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
