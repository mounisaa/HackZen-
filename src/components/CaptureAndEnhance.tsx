import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  RotateCw,
  Sliders,
  CheckCircle2,
  Sparkles,
  FileText,
  Eye,
  RefreshCw,
  Zap,
  Split,
  Maximize2,
  Wand2,
  AlertCircle,
} from 'lucide-react';
import { CVProcessingOptions } from '../types/document';
import { processImageOnCanvas, defaultCVOptions } from '../utils/cvProcessor';
import { SampleDocumentPreset, SAMPLE_PRESETS } from '../data/sampleDocuments';

interface CaptureAndEnhanceProps {
  currentImage: string;
  setCurrentImage: (url: string) => void;
  onRunOCR: (processedCanvasDataUrl: string) => void;
  onOpenLiveCamera: () => void;
  isProcessingOCR: boolean;
  onSelectPreset: (preset: SampleDocumentPreset) => void;
  selectedPresetId: string;
}

export const CaptureAndEnhance: React.FC<CaptureAndEnhanceProps> = ({
  currentImage,
  setCurrentImage,
  onRunOCR,
  onOpenLiveCamera,
  isProcessingOCR,
  onSelectPreset,
  selectedPresetId,
}) => {
  const [cvOptions, setCvOptions] = useState<CVProcessingOptions>(defaultCVOptions);
  const [splitView, setSplitView] = useState<boolean>(false);
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50); // percentage
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Re-run CV filter whenever options or image changes
  useEffect(() => {
    if (!currentImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImgRef.current = img;
      if (processedCanvasRef.current) {
        processImageOnCanvas(img, processedCanvasRef.current, cvOptions);
      }
    };
    img.src = currentImage;
  }, [currentImage, cvOptions]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCurrentImage(dataUrl);
          setCvOptions(defaultCVOptions);
          // Automatically run OCR so digital form accurately matches the uploaded document immediately!
          onRunOCR(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCurrentImage(dataUrl);
          setCvOptions(defaultCVOptions);
          // Automatically run OCR on dropped document
          onRunOCR(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // One-click Auto Document Optimizer preset
  const applyAutoOptimize = () => {
    setCvOptions((prev) => ({
      ...prev,
      grayscale: true,
      binarization: true,
      binarizeThreshold: 145,
      contrast: 1.25,
      brightness: 10,
      noiseReduction: true,
      edgeDetection: false,
    }));
  };

  const resetFilters = () => {
    setCvOptions(defaultCVOptions);
  };

  const handleTriggerOCR = () => {
    if (!processedCanvasRef.current) return;
    const dataUrl = processedCanvasRef.current.toDataURL('image/jpeg', 0.95);
    onRunOCR(dataUrl);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Methodology Step 1 & 2 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                METHODOLOGY STAGE 1 &amp; 2
              </span>
              <h1 className="text-xl font-extrabold text-white">
                Document Capture &amp; Computer Vision Enhancement
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Upload or capture handwritten medical documents. Apply real-time OpenCV-style filters (adaptive binarization, deskewing, noise filtering, and contrast stretching) to maximize OCR recognition accuracy.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={applyAutoOptimize}
              className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 transition cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-slate-950" />
              <span>Auto-Optimize for OCR</span>
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Preset Document Switcher */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Standard Medical Document Presets:</span>
            </span>
            <span className="text-[11px] text-slate-400">Click to test instantly without uploading</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500/80 shadow-md shadow-teal-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prominent Document Upload & Camera Capture Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-slate-900 border-2 ${
          isDragging
            ? 'border-teal-400 bg-teal-950/30 shadow-teal-500/20'
            : 'border-dashed border-teal-500/40 hover:border-teal-400 bg-gradient-to-r from-teal-950/20 via-slate-900 to-cyan-950/20'
        } rounded-2xl p-6 transition-all shadow-xl`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-lg shadow-teal-500/10">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white">Upload Handwritten Document / Image</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Instant Auto-Fill
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                Upload your handwritten hospital forms, prescription slips, or doctor notes (PNG, JPG, PDF). DocScan AI extracts only details visible in the pic, auto-enters null for missing fields, and fills the editable digital form!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-teal-500/25 transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-950" />
              <span>Choose Photo to Upload</span>
            </button>

            <button
              onClick={onOpenLiveCamera}
              className="flex items-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-teal-400" />
              <span>Live Camera</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is CV Controls, Right is Canvas Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Computer Vision Controls Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>OpenCV Preprocessing Pipeline</span>
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
                Real-time
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Rotation & Deskewing */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-teal-400" />
                    <span>Orientation &amp; Deskew</span>
                  </span>
                  <span className="text-xs font-mono text-teal-400">
                    {cvOptions.rotationStep}° + {cvOptions.deskewAngle}°
                  </span>
                </label>

                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() =>
                      setCvOptions((prev) => ({
                        ...prev,
                        rotationStep: (prev.rotationStep + 90) % 360,
                      }))
                    }
                    className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3 text-teal-400" />
                    <span>Rotate +90°</span>
                  </button>
                  <button
                    onClick={() =>
                      setCvOptions((prev) => ({
                        ...prev,
                        deskewAngle: 0,
                        rotationStep: 0,
                      }))
                    }
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg border border-slate-700 transition cursor-pointer"
                  >
                    Zero
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Fine Deskew Tilt:</span>
                    <span className="font-mono text-teal-400">{cvOptions.deskewAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="0.5"
                    value={cvOptions.deskewAngle}
                    onChange={(e) =>
                      setCvOptions((prev) => ({
                        ...prev,
                        deskewAngle: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Binarization / Thresholding (Otsu Paper Clean) */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <input
                      type="checkbox"
                      checked={cvOptions.binarization}
                      onChange={(e) =>
                        setCvOptions((prev) => ({
                          ...prev,
                          binarization: e.target.checked,
                          grayscale: e.target.checked ? true : prev.grayscale,
                        }))
                      }
                      className="rounded accent-teal-400 bg-slate-800 border-slate-700"
                    />
                    <span>Adaptive Binarization (Otsu)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Removes paper shadows</span>
                </div>

                {cvOptions.binarization && (
                  <div className="space-y-1 pl-5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Ink Threshold:</span>
                      <span className="font-mono text-teal-400">{cvOptions.binarizeThreshold} / 255</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="220"
                      value={cvOptions.binarizeThreshold}
                      onChange={(e) =>
                        setCvOptions((prev) => ({
                          ...prev,
                          binarizeThreshold: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Grayscale Mode */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={cvOptions.grayscale}
                    onChange={(e) =>
                      setCvOptions((prev) => ({
                        ...prev,
                        grayscale: e.target.checked,
                      }))
                    }
                    className="rounded accent-teal-400 bg-slate-800 border-slate-700"
                  />
                  <span>Grayscale Luminance BT.601</span>
                </label>
                <span className="text-[10px] text-slate-400">Single channel</span>
              </div>

              {/* Contrast Stretching & CLAHE */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Contrast Factor (CLAHE stretch):</span>
                  <span className="font-mono text-teal-400">{cvOptions.contrast.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={cvOptions.contrast}
                  onChange={(e) =>
                    setCvOptions((prev) => ({
                      ...prev,
                      contrast: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Noise Filtering */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={cvOptions.noiseReduction}
                    onChange={(e) =>
                      setCvOptions((prev) => ({
                        ...prev,
                        noiseReduction: e.target.checked,
                      }))
                    }
                    className="rounded accent-teal-400 bg-slate-800 border-slate-700"
                  />
                  <span>Gaussian Noise Reduction</span>
                </label>
                <span className="text-[10px] text-slate-400">Smooths speckles</span>
              </div>

              {/* Edge Detection Filter */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={cvOptions.edgeDetection}
                    onChange={(e) =>
                      setCvOptions((prev) => ({
                        ...prev,
                        edgeDetection: e.target.checked,
                      }))
                    }
                    className="rounded accent-teal-400 bg-slate-800 border-slate-700"
                  />
                  <span>Sobel Boundary Edge Filter</span>
                </label>
                <span className="text-[10px] text-slate-400">Contour isolates</span>
              </div>
            </div>
          </div>

          {/* Action trigger card */}
          <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Next: Intelligent Text OCR</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pass the computer vision preprocessed image into Gemini 3.8 Flash Vision for handwriting recognition, medical entity extraction, and digital form filling.
            </p>

            <button
              onClick={handleTriggerOCR}
              disabled={isProcessingOCR}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer ${
                isProcessingOCR
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/25'
              }`}
            >
              {isProcessingOCR ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Analyzing Medical Document...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Execute OCR &amp; Auto-Fill Form</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Document Viewport (Interactive Canvas & Split View) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[680px]">
            {/* Viewport Top Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-200">Preprocessed Document Canvas</span>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {cvOptions.binarization ? 'Adaptive Binarized' : cvOptions.grayscale ? 'Grayscale' : 'Full Color'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Before / After Split Button */}
                <button
                  onClick={() => setSplitView(!splitView)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    splitView
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>{splitView ? 'Exit Split View' : 'Before/After Split'}</span>
                </button>

                {/* Upload File Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-400" />
                  <span>Upload Image</span>
                </button>

                {/* Live Camera Button */}
                <button
                  onClick={onOpenLiveCamera}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-400" />
                  <span>Camera</span>
                </button>
              </div>
            </div>

            {/* Canvas / Image Display Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex-1 bg-slate-950/80 rounded-xl overflow-hidden mt-3 border flex items-center justify-center p-3 select-none transition-colors ${
                isDragging ? 'border-teal-400 bg-teal-950/20' : 'border-slate-800'
              }`}
            >
              {/* Processed canvas is the main display */}
              <div className="relative max-w-full max-h-full flex items-center justify-center">
                <canvas
                  ref={processedCanvasRef}
                  className="max-h-[580px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
                />

                {/* Split view overlay */}
                {splitView && currentImage && (
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg"
                    style={{ clipPath: `inset(0 ${100 - splitSliderPos}% 0 0)` }}
                  >
                    <img
                      src={currentImage}
                      alt="Original Raw"
                      className="max-h-[580px] max-w-full object-contain mx-auto"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      RAW ORIGINAL
                    </div>
                  </div>
                )}

                {splitView && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-teal-400 cursor-ew-resize z-20"
                    style={{ left: `${splitSliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-lg">
                      ⇄
                    </div>
                  </div>
                )}
              </div>

              {/* Split slider control in split mode */}
              {splitView && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 px-4 py-2 rounded-xl flex items-center space-x-3 text-xs shadow-2xl z-30">
                  <span className="text-amber-300 font-bold text-[11px]">Original</span>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={splitSliderPos}
                    onChange={(e) => setSplitSliderPos(parseInt(e.target.value))}
                    className="w-36 accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-teal-300 font-bold text-[11px]">Enhanced</span>
                </div>
              )}

              {/* Drag & drop prompt overlay if empty */}
              {isDragging && (
                <div className="absolute inset-0 bg-teal-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-teal-300 z-40 border-2 border-dashed border-teal-400 rounded-xl">
                  <Upload className="w-12 h-12 mb-2 animate-bounce" />
                  <p className="font-bold text-sm">Drop medical document image here to import</p>
                </div>
              )}
            </div>

            {/* Bottom Status & Info Bar */}
            <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400 border-t border-slate-800/80 mt-2">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Computer Vision Pipeline Ready: Filter graph applied cleanly to image canvas</span>
              </span>
              <span className="font-mono text-slate-400">
                Resolution: 850 x 1100 px (300 DPI equivalent)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
