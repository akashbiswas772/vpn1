import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, FolderArchive } from 'lucide-react';
import { ProxyConfig } from '../types/proxy';
import { generateAndroidProjectFiles, downloadAndroidProjectZip, CodeFile } from '../utils/projectGenerator';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProxyConfig;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose, config }) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const files = generateAndroidProjectFiles(config);
  const [selectedFile, setSelectedFile] = useState<CodeFile>(files[0]);

  if (!isOpen) return null;

  const handleCopyCode = async (content: string, path: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip(config);
    } catch (err) {
      console.error('ZIP generation failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Native Android Kotlin & tun2socks Codebase</span>
              </h2>
              <p className="text-xs text-slate-400">
                Ready to compile in Android Studio or copy into Cursor / Windsurf
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <FolderArchive className="w-4 h-4" />
              <span>{isExporting ? 'Generating ZIP...' : 'Download Project .ZIP'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split: File tree sidebar + Code editor view */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-3 overflow-y-auto space-y-1">
            <div className="text-[11px] font-mono text-slate-500 px-3 py-1.5 uppercase font-bold tracking-wider">
              Project Structure
            </div>
            {files.map((file) => {
              const isActive = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="truncate">
                    <p className="font-mono truncate">{file.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{file.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* File info bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 truncate">
                {selectedFile.path}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(selectedFile.content, selectedFile.path)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors shrink-0"
              >
                {copiedPath === selectedFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Pre container */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
              <pre className="select-text whitespace-pre overflow-x-auto">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Includes VpnService, tun2socks JNI loop guard, Coroutines ViewModel & Jetpack Compose UI</span>
          </div>
          <span className="font-mono text-slate-500">Target SDK 35 (Android 15 Ready)</span>
        </div>

      </div>
    </div>
  );
};
