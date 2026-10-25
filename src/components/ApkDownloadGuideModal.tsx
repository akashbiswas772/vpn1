import React, { useState } from 'react';
import { X, Download, Smartphone, Github, Terminal, Copy, Check, ExternalLink, HelpCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { ProxyConfig } from '../types/proxy';
import { downloadAndroidProjectZip } from '../utils/projectGenerator';

interface ApkDownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProxyConfig;
}

export const ApkDownloadGuideModal: React.FC<ApkDownloadGuideModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'github' | 'fiverr' | 'cli'>('studio');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadAndroidProjectZip(config);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const fiverrPromptText = `Hi! I have the complete Android Studio Kotlin project for "Akash Proxy Pro" (VpnService + tun2socks + Quick Paste parser + Foreground Service).
I've attached the full project .zip file with all Kotlin files and Gradle configuration.
Could you please:
1. Open the project and compile the signed release .apk file.
2. Ensure tun2socks native libraries (arm64-v8a) are bundled.
3. Deliver the installable .apk file so I can run it directly on my Android phone.`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>How to Get the Installable .APK File</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Android Package
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose the easiest method below to generate and download your Akash Proxy Pro .apk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Download Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-200">Step 1: Download Complete Project Package</p>
            <p className="text-[11px] text-slate-400">
              Contains all Kotlin files, Gradle build system, and automated APK build workflows.
            </p>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Packaging...' : 'Download Project .ZIP'}</span>
          </button>
        </div>

        {/* Method Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-950/40">
          <button
            onClick={() => setActiveTab('studio')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'studio'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Method 1: Android Studio (1-Click)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'github'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Method 2: Free GitHub Cloud Build (No PC setup)</span>
          </button>

          <button
            onClick={() => setActiveTab('fiverr')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'fiverr'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Method 3: Fiverr / Freelance Developer</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'cli'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Method 4: Command Line (Gradle)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Method 1: Android Studio */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Build APK in 3 Steps with Android Studio</span>
                </h3>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p className="font-semibold text-slate-200">Download & Unzip the Project</p>
                      <p className="text-slate-400 mt-0.5">
                        Click the <strong className="text-emerald-400">"Download Project .ZIP"</strong> button above and extract the zip file onto your computer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p className="font-semibold text-slate-200">Open in Android Studio</p>
                      <p className="text-slate-400 mt-0.5">
                        Open <a href="https://developer.android.com/studio" target="_blank" rel="noreferrer" className="text-sky-400 underline">Android Studio</a>, select <strong>File &gt; Open...</strong>, and choose the unzipped folder. Android Studio will automatically sync the Gradle dependencies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <p className="font-semibold text-slate-200">Generate the .APK File</p>
                      <p className="text-slate-400 mt-0.5">
                        In the top menu, go to:
                      </p>
                      <div className="mt-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-emerald-300 text-[11px]">
                        Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
                      </div>
                      <p className="text-slate-400 mt-1.5">
                        Once compilation completes (approx. 30 seconds), click the pop-up link <strong>"locate"</strong> in the bottom-right of Android Studio. Your file will be ready at:
                      </p>
                      <div className="mt-1 p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300 text-[11px]">
                        app/build/outputs/apk/debug/app-debug.apk
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Transfer the resulting <code className="text-emerald-400">app-debug.apk</code> to your phone via USB cable, Google Drive, or Telegram to install!
                </span>
              </div>
            </div>
          )}

          {/* Method 2: GitHub Cloud Build */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Github className="w-4 h-4 text-emerald-400" />
                    <span>Free Cloud Build: GitHub Actions (No Android Studio Needed!)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Included in .ZIP
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The downloaded project already includes a pre-configured <code className="text-emerald-400">.github/workflows/build-apk.yml</code> workflow. GitHub will compile the APK for you in the cloud for free!
                </p>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Create a new private or public repository on <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">GitHub.com</a>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Upload all the files from the unzipped project folder to your repository.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Go to the <strong>Actions</strong> tab in your repository. You will see <strong>"Build Android APK"</strong> running.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>When it finishes, click into the workflow run and download the <strong>AkashProxyPro-Debug-APK</strong> artifact containing your ready <code className="text-emerald-400">.apk</code> file!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Method 3: Fiverr */}
          {activeTab === 'fiverr' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Send to an Android Developer on Fiverr</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As requested in your initial prompt, you can send the project zip directly to a freelance Android developer on Fiverr or Upwork to compile, sign with a custom keystore, and return the final installable .apk:
                </p>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Copy Handover Message</span>
                    <button
                      onClick={() => handleCopy(fiverrPromptText, 'fiverr')}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedText === 'fiverr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === 'fiverr' ? 'Copied Message!' : 'Copy Text'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap select-all">
                    {fiverrPromptText}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Method 4: CLI */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Command Line Build (macOS / Linux / Windows)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  If you have Java 17+ installed on your machine, you can compile the APK directly from your terminal:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Terminal Command:</span>
                    <button
                      onClick={() => handleCopy('./gradlew assembleDebug', 'cmd')}
                      className="px-2 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                    >
                      {copiedText === 'cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
                    ./gradlew assembleDebug
                  </pre>
                </div>

                <p className="text-[11px] text-slate-400">
                  The generated APK file will be saved at: <code className="text-emerald-400">app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>
            </div>
          )}

          {/* Install note */}
          <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>How to install on your Android device:</strong> When you open the <code className="text-emerald-300 font-mono">.apk</code> on your Android phone, enable <em>"Install unknown apps"</em> for your browser or file manager when prompted.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Package: com.akash.proxypro · API 26-35
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
