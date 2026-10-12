import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(
        'Unable to access camera feed. Please verify camera permissions in your browser or use Document Upload.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Live Medical Document Capture</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
          {cameraError ? (
            <div className="p-6 text-center text-rose-300 max-w-md space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-xs">{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Document boundary guide box */}
              <div className="absolute inset-8 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                {/* Corner reticles */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-400 -mt-1 -ml-1 rounded-tl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-400 -mt-1 -mr-1 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-400 -mb-1 -ml-1 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-400 -mb-1 -mr-1 rounded-br" />

                <span className="text-[11px] font-bold text-teal-300 bg-slate-900/80 px-3 py-1 rounded-full shadow border border-teal-500/30">
                  Align Medical Form within Frame
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() =>
              setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))
            }
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span>Switch Lens</span>
          </button>

          <button
            onClick={takeSnapshot}
            disabled={!!cameraError}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>Capture Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
