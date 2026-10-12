import React from 'react';
import {
  FileScan,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Database,
  ArrowRight,
  BookOpen,
  X,
  Building2,
  GraduationCap,
  Landmark,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';

interface ProjectMethodologyGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectMethodologyGuide: React.FC<ProjectMethodologyGuideProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const methodologySteps = [
    {
      num: '1',
      title: 'Document Upload',
      desc: 'User uploads a photo, scanned PDF, or captures live via mobile/webcam viewfinder.',
    },
    {
      num: '2',
      title: 'Image Processing (Computer Vision)',
      desc: 'Adaptive Otsu binarization, fine deskew tilt (-15° to +15°), CLAHE contrast, and noise filtering.',
    },
    {
      num: '3',
      title: 'Text Recognition (OCR & Handwriting)',
      desc: 'Gemini 3.8 Flash Vision model segments printed typography from messy cursive doctor handwriting.',
    },
    {
      num: '4',
      title: 'Information Extraction',
      desc: 'Extracts patient demographics, vitals, symptoms, allergies, provisional diagnoses, and medications.',
    },
    {
      num: '5',
      title: 'Digital Form Filling',
      desc: 'Extracted values populate structured reactive form fields with bounding box geometry and confidence scores.',
    },
    {
      num: '6',
      title: 'Human Verification',
      desc: 'Side-by-side verification interface allows clinicians to inspect source snippets and rectify errors.',
    },
    {
      num: '7',
      title: 'Encrypted Database Storage',
      desc: 'Web Cryptography AES-256-GCM encryption with PBKDF2 key derivation and tamper-evident audit trail.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col space-y-5 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                DocScan AI — System Architecture &amp; Methodology
              </h2>
              <p className="text-xs text-slate-400">
                Specification overview corresponding to the research paper &amp; project demo brief
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs text-slate-300">
          {/* 1. Working Methodology Flow */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>7-Step Working Methodology Pipeline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {methodologySteps.map((step) => (
                <div
                  key={step.num}
                  className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-[10px]">
                      {step.num}
                    </span>
                    <span className="font-bold text-slate-200">{step.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Key Objectives & Implementation */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Implemented Core Objectives</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Automated handwritten cursive &amp; printed form capture</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Interactive OpenCV canvas preprocessing &amp; deskewing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Gemini 3.8 Flash Vision OCR text &amp; handwriting extraction</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Auto-populating digital reactive forms with bounding boxes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Side-by-side human-in-the-loop verification workspace</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Client &amp; Server AES-256-GCM encrypted HIPAA vault</span>
              </div>
            </div>
          </div>

          {/* 3. Industry Applications */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Cross-Industry Applications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Hospitals</span>
                  <span className="text-[10px] text-slate-400">Triage &amp; Intake</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Colleges</span>
                  <span className="text-[10px] text-slate-400">Admissions &amp; Grades</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                <Landmark className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Government</span>
                  <span className="text-[10px] text-slate-400">Citizen Filings</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Enterprises</span>
                  <span className="text-[10px] text-slate-400">Invoices &amp; Claims</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-teal-500/20"
          >
            Got it, Proceed to App
          </button>
        </div>
      </div>
    </div>
  );
};
