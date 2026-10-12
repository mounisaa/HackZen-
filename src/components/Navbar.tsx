import React, { useRef } from 'react';
import {
  FileScan,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  Database,
  CheckCircle2,
  HelpCircle,
  Upload,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'capture' | 'verify' | 'vault';
  setCurrentTab: (tab: 'capture' | 'verify' | 'vault') => void;
  vaultRecordCount: number;
  openGuideModal: () => void;
  isProcessing: boolean;
  onUploadDocument?: (dataUrl: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  vaultRecordCount,
  openGuideModal,
  isProcessing,
  onUploadDocument,
}) => {
  const navFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNavUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && onUploadDocument) {
          onUploadDocument(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black">
              <FileScan className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  DocScan <span className="text-teal-400">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 uppercase tracking-wider">
                  Clinical Vision
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Medical Document Capture &amp; Encrypted Extraction System
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs / Workflow Stepper */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setCurrentTab('capture')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'capture'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Capture &amp; CV</span>
            </button>

            <button
              onClick={() => setCurrentTab('verify')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'verify'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Verify &amp; Digital Form</span>
            </button>

            <button
              onClick={() => setCurrentTab('vault')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                currentTab === 'vault'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>3. Encrypted Vault</span>
              {vaultRecordCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-teal-400/20 text-teal-300 font-bold">
                  {vaultRecordCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Badges */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Upload Form Button */}
            {onUploadDocument && (
              <>
                <input
                  type="file"
                  ref={navFileInputRef}
                  onChange={handleNavUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  onClick={() => navFileInputRef.current?.click()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">Upload Form</span>
                </button>
              </>
            )}

            {/* Security Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-medium text-[11px]">AES-256-GCM Active</span>
            </div>

            {/* Project Methodology Guide Button */}
            <button
              onClick={openGuideModal}
              title="View Methodology & Demo Walkthrough"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">System Architecture</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
