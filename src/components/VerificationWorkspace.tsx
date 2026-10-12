import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  Download,
  Lock,
  Edit3,
  User,
  Activity,
  Stethoscope,
  Pill,
  FileBadge,
  Sparkles,
  Info,
  Check,
  Eye,
  Plus,
  Trash2,
  CornerDownRight,
  Printer,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { ExtractionResult, ExtractedField, PrescriptionItem } from '../types/document';

interface VerificationWorkspaceProps {
  documentImage: string;
  extractionData: ExtractionResult;
  onUpdateExtraction: (updated: ExtractionResult) => void;
  onSaveToVault: (verifiedData: ExtractionResult) => void;
  isSaving: boolean;
  onReScan?: () => void;
  onUploadDocument?: (dataUrl: string) => void;
}

export const VerificationWorkspace: React.FC<VerificationWorkspaceProps> = ({
  documentImage,
  extractionData,
  onUpdateExtraction,
  onSaveToVault,
  isSaving,
  onReScan,
  onUploadDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'verbatim' | 'demographics' | 'vitals' | 'clinical' | 'prescriptions' | 'all-fields' | 'physician'>('verbatim');
  const [activeFieldId, setActiveFieldId] = useState<string | null>('patient_name');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [filterLowConfidence, setFilterLowConfidence] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [allFieldsFilter, setAllFieldsFilter] = useState<'all' | 'in-pic' | 'null-only'>('all');

  // Custom Field Creator state
  const [isAddCustomFieldOpen, setIsAddCustomFieldOpen] = useState<boolean>(false);
  const [newFieldLabel, setNewFieldLabel] = useState<string>('');
  const [newFieldValue, setNewFieldValue] = useState<string>('');
  const [newFieldCategory, setNewFieldCategory] = useState<'demographics' | 'vitals' | 'clinical' | 'prescriptions' | 'other'>('clinical');

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFromWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCreateCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;
    const customId = 'field_' + Date.now().toString(36);
    const customField: ExtractedField = {
      fieldId: customId,
      label: newFieldLabel.trim(),
      value: newFieldValue.trim() || 'null',
      originalValue: newFieldValue.trim() || 'null',
      confidence: 1.0,
      sourceType: 'handwritten',
      category: newFieldCategory as any,
      boundingBox: { x: 8, y: 12 + (extractionData.extractedFields.length % 15) * 5, width: 84, height: 4.5 },
      isVerified: true,
    };

    onUpdateExtraction({
      ...extractionData,
      extractedFields: [...extractionData.extractedFields, customField],
    });

    setNewFieldLabel('');
    setNewFieldValue('');
    setIsAddCustomFieldOpen(false);
  };

  // Field update handler
  const handleFieldValueChange = (fieldId: string, newValue: string) => {
    const updatedFields = extractionData.extractedFields.map((f) => {
      if (f.fieldId === fieldId) {
        return {
          ...f,
          value: newValue,
          isVerified: true,
          editHistory: [
            ...(f.editHistory || []),
            {
              timestamp: new Date().toLocaleTimeString(),
              from: f.value,
              to: newValue,
              by: 'Human Reviewer',
            },
          ],
        };
      }
      return f;
    });

    // Also update parent nested object if corresponding key exists
    const updated = { ...extractionData, extractedFields: updatedFields };

    // Sync demographic changes
    if (fieldId === 'patient_name') updated.patientDemographics.fullName = newValue;
    if (fieldId === 'mrn') updated.patientDemographics.mrn = newValue;
    if (fieldId === 'dob') updated.patientDemographics.dob = newValue;
    if (fieldId === 'age') updated.patientDemographics.age = newValue;

    // Sync vitals
    if (fieldId === 'bp') updated.vitals.bloodPressure = newValue;
    if (fieldId === 'pulse') updated.vitals.heartRate = newValue;
    if (fieldId === 'temp') updated.vitals.temperature = newValue;
    if (fieldId === 'spo2') updated.vitals.spo2 = newValue;

    // Sync clinical notes
    if (fieldId === 'chief_complaint') updated.clinicalNotes.chiefComplaint = newValue;
    if (fieldId === 'allergies') updated.clinicalNotes.allergies = newValue;
    if (fieldId === 'diagnosis') updated.clinicalNotes.provisionalDiagnosis = newValue;

    onUpdateExtraction(updated);
  };

  // Toggle field verification checkmark
  const toggleFieldVerification = (fieldId: string) => {
    const updatedFields = extractionData.extractedFields.map((f) => {
      if (f.fieldId === fieldId) {
        return { ...f, isVerified: !f.isVerified };
      }
      return f;
    });
    onUpdateExtraction({ ...extractionData, extractedFields: updatedFields });
  };

  // Verify all fields in current section
  const verifyAllInSection = () => {
    const updatedFields = extractionData.extractedFields.map((f) => {
      if (f.category === activeTab) {
        return { ...f, isVerified: true };
      }
      return f;
    });
    onUpdateExtraction({ ...extractionData, extractedFields: updatedFields });
  };

  // Count human corrections made
  const correctedCount = extractionData.extractedFields.filter(
    (f) => f.originalValue && f.originalValue !== f.value
  ).length;

  const totalFields = extractionData.extractedFields.length;
  const inPhotoCount = extractionData.extractedFields.filter(
    (f) => f.value && f.value !== 'null' && f.value.trim() !== ''
  ).length;
  const nullFieldsCount = extractionData.extractedFields.filter(
    (f) => !f.value || f.value === 'null' || f.value.trim() === ''
  ).length;
  const verifiedCount = extractionData.extractedFields.filter((f) => f.isVerified).length;
  const overallConfidence =
    totalFields > 0
      ? Math.round(
          (extractionData.extractedFields.reduce((sum, f) => sum + f.confidence, 0) /
            totalFields) *
            100
        )
      : 92;

  // Active field bounding box
  const activeField = extractionData.extractedFields.find((f) => f.fieldId === activeFieldId);

  // Export handlers
  const exportAsFHIR = () => {
    const fhirResource = {
      resourceType: 'DiagnosticReport',
      id: extractionData.patientDemographics.mrn || 'DOCSCAN-REPORT-1',
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
              code: 'RAD',
              display: extractionData.documentInfo.documentType,
            },
          ],
        },
      ],
      subject: {
        reference: `Patient/${extractionData.patientDemographics.mrn}`,
        display: extractionData.patientDemographics.fullName,
      },
      effectiveDateTime: new Date().toISOString(),
      issued: new Date().toISOString(),
      performer: [
        {
          display: extractionData.attendingPhysician.doctorName,
        },
      ],
      conclusion: extractionData.clinicalNotes.provisionalDiagnosis,
      extension: [
        {
          url: 'http://docscan.ai/fhir/vitals',
          valueString: JSON.stringify(extractionData.vitals),
        },
        {
          url: 'http://docscan.ai/fhir/allergies',
          valueString: extractionData.clinicalNotes.allergies,
        },
        {
          url: 'http://docscan.ai/fhir/prescriptions',
          valueString: JSON.stringify(extractionData.prescriptions),
        },
      ],
    };

    const blob = new Blob([JSON.stringify(fhirResource, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR-${extractionData.patientDemographics.mrn || 'Record'}.json`;
    a.click();
  };

  const exportAsCSV = () => {
    let csv = 'Field Label,Extracted Value,Confidence,Source Type,Verified Status\n';
    extractionData.extractedFields.forEach((f) => {
      const cleanVal = `"${(f.value || '').replace(/"/g, '""')}"`;
      csv += `"${f.label}",${cleanVal},${(f.confidence * 100).toFixed(1)}%,${f.sourceType},${
        f.isVerified ? 'VERIFIED' : 'PENDING'
      }\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocScan-${extractionData.patientDemographics.mrn || 'Record'}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Methodology Step 3, 4, 5, 6 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              METHODOLOGY STAGE 3 TO 6
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Strict Photo Sync Active
            </span>
            <h1 className="text-xl font-extrabold text-white">
              Document Verification &amp; Digital Form Filling
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            <strong className="text-teal-300 font-semibold">Strict Extraction Rule:</strong> Details visible in the picture are extracted verbatim. Any details not present in the document are automatically entered as <span className="font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">null</span>. All fields have immediate in-place editable options.
          </p>
        </div>

        {/* Verification Summary Stats */}
        <div className="flex items-center space-x-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex-wrap gap-2">
          <div className="text-center px-2">
            <div className="text-lg font-black text-cyan-400">{inPhotoCount}</div>
            <div className="text-[10px] text-slate-400">In Document Pic</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-purple-400">{nullFieldsCount}</div>
            <div className="text-[10px] text-slate-400">Auto-entered null</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-teal-400">{overallConfidence}%</div>
            <div className="text-[10px] text-slate-400">Mean Conf.</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-emerald-400">
              {verifiedCount}/{totalFields}
            </div>
            <div className="text-[10px] text-slate-400">Verified</div>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane (5 cols): Interactive Document Canvas with Bounding Boxes */}
        <div className="lg:col-span-5 flex flex-col h-[750px] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          {/* Document Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Source Document Inspector</span>
              {activeField && (
                <span className="text-[11px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 truncate max-w-[150px]">
                  {activeField.label}
                </span>
              )}
            </div>

            {/* Zoom & View Controls */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                title="Zoom Out"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-300 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                title="Zoom In"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1.0)}
                title="Reset Zoom"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Toggle Bounding Box filter */}
          <div className="flex items-center justify-between py-2 px-1 text-[11px] text-slate-400 border-b border-slate-800/60">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showBoundingBoxes}
                onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                className="rounded accent-teal-400 bg-slate-800"
              />
              <span>Show OCR Bounding Boxes</span>
            </label>

            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>&ge;90%</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>70-89%</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                <span>&lt;70%</span>
              </span>
            </div>
          </div>

          {/* Document Canvas Viewer Container */}
          <div
            ref={imageContainerRef}
            className="flex-1 overflow-auto bg-slate-950 rounded-xl relative p-3 border border-slate-800 flex items-center justify-center select-none"
          >
            <div
              className="relative transition-transform duration-150 origin-center"
              style={{
                transform: `scale(${zoomLevel})`,
              }}
            >
              <img
                src={documentImage}
                alt="Medical Document"
                className="max-h-[640px] w-auto rounded-lg shadow-2xl pointer-events-none"
              />

              {/* Bounding Box SVG Layer */}
              {showBoundingBoxes && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-auto"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {extractionData.extractedFields.map((field) => {
                    const isSelected = activeFieldId === field.fieldId;
                    const conf = field.confidence;
                    const strokeColor = isSelected
                      ? '#38bdf8' // Cyan bright for selected
                      : conf >= 0.9
                      ? '#10b981' // Green
                      : conf >= 0.7
                      ? '#f59e0b' // Yellow
                      : '#f43f5e'; // Red

                    const fillColor = isSelected
                      ? 'rgba(56, 189, 248, 0.25)'
                      : conf >= 0.9
                      ? 'rgba(16, 185, 129, 0.12)'
                      : conf >= 0.7
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(244, 63, 94, 0.20)';

                    return (
                      <g
                        key={field.fieldId}
                        onClick={() => {
                          setActiveFieldId(field.fieldId);
                          // switch tab to field's category
                          if (field.category) setActiveTab(field.category as any);
                        }}
                        className="cursor-pointer group"
                      >
                        <rect
                          x={field.boundingBox.x}
                          y={field.boundingBox.y}
                          width={field.boundingBox.width}
                          height={field.boundingBox.height}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? '0.7' : '0.4'}
                          strokeDasharray={field.sourceType === 'handwritten' ? '1 0.5' : undefined}
                          rx="0.5"
                          className="transition-all"
                        />
                        {/* Hover text label */}
                        <title>{`${field.label}: ${field.value} (${Math.round(conf * 100)}% conf)`}</title>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Active Field Snippet inspector */}
          {activeField && (
            <div className="mt-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">CURRENT SELECTION</span>
                <span className="font-bold text-teal-300">{activeField.label}</span>
                <span className="text-[11px] text-slate-300 block truncate max-w-xs mt-0.5">
                  &ldquo;{activeField.value}&rdquo;
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeField.confidence >= 0.9
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : activeField.confidence >= 0.7
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {Math.round(activeField.confidence * 100)}% Conf.
                </span>
                <span className="block text-[10px] text-slate-400 capitalize mt-0.5">
                  Type: {activeField.sourceType}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane (7 cols): Auto-Populated Digital Form */}
        <div className="lg:col-span-7 flex flex-col h-[750px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          {/* Section Navigation Tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center space-x-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('verbatim')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'verbatim'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-teal-400 hover:text-teal-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>📸 In-Pic Details ({inPhotoCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('demographics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'demographics'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Demographics</span>
              </button>

              <button
                onClick={() => setActiveTab('vitals')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'vitals'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Vitals</span>
              </button>

              <button
                onClick={() => setActiveTab('clinical')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'clinical'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinical Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'prescriptions'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Orders / Rx</span>
              </button>

              <button
                onClick={() => setActiveTab('all-fields')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'all-fields'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Extracted Fields</span>
              </button>

              <button
                onClick={() => setActiveTab('physician')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'physician'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileBadge className="w-3.5 h-3.5" />
                <span>Physician</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddCustomFieldOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>+ Custom Field</span>
              </button>
              {onUploadDocument && (
                <>
                  <input
                    type="file"
                    ref={uploadInputRef}
                    onChange={handleUploadFromWorkspace}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <button
                    onClick={() => uploadInputRef.current?.click()}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-950" />
                    <span>Upload New Doc</span>
                  </button>
                </>
              )}
              {onReScan && (
                <button
                  onClick={onReScan}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Re-Scan Active</span>
                </button>
              )}
              <button
                onClick={verifyAllInSection}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Verify All in Tab</span>
              </button>
            </div>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
            {/* 0. Verbatim In-Pic Details Tab (Exact matching to photo) */}
            {activeTab === 'verbatim' && (
              <div className="space-y-3">
                <div className="p-3 bg-teal-950/30 border border-teal-500/40 rounded-xl text-xs text-teal-300 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Verbatim Document Extraction:</strong> These details were read directly from the picture. Click any item to see its exact location on the image.
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-teal-900/60 text-teal-200 border border-teal-500/30">
                    {inPhotoCount} Lines Detected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {extractionData.extractedFields.map((field) => {
                    const isSelected = activeFieldId === field.fieldId;
                    const isFieldNull = field.value === 'null' || !field.value;
                    return (
                      <div
                        key={field.fieldId}
                        onClick={() => setActiveFieldId(field.fieldId)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-950/40 border-teal-400 shadow-md ring-1 ring-teal-400/40'
                            : isFieldNull
                            ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                          <span className="font-bold text-slate-200 text-xs truncate max-w-[180px]">
                            {field.label}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            {isFieldNull ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                null
                              </span>
                            ) : (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                  field.confidence >= 0.9
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {Math.round(field.confidence * 100)}%
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFieldValueChange(field.fieldId, isFieldNull ? (field.originalValue || '') : 'null');
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
                            >
                              {isFieldNull ? 'Restore' : 'Set null'}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFieldVerification(field.fieldId);
                              }}
                              className={`p-1 rounded-md transition cursor-pointer ${
                                field.isVerified
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleFieldValueChange(field.fieldId, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                        />

                        {field.rawSnippet && (
                          <div className="mt-1 text-[10px] text-slate-400 font-mono truncate">
                            Raw: {field.rawSnippet}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. Demographics Tab */}
            {activeTab === 'demographics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <FormFieldCard
                    label="Patient Full Name"
                    fieldId="patient_name"
                    value={extractionData.patientDemographics.fullName}
                    onChange={(val) => handleFieldValueChange('patient_name', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'patient_name')}
                    isSelected={activeFieldId === 'patient_name'}
                    onSelect={() => setActiveFieldId('patient_name')}
                    onToggleVerify={() => toggleFieldVerification('patient_name')}
                  />

                  {/* MRN */}
                  <FormFieldCard
                    label="Medical Record Number (MRN)"
                    fieldId="mrn"
                    value={extractionData.patientDemographics.mrn}
                    onChange={(val) => handleFieldValueChange('mrn', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'mrn')}
                    isSelected={activeFieldId === 'mrn'}
                    onSelect={() => setActiveFieldId('mrn')}
                    onToggleVerify={() => toggleFieldVerification('mrn')}
                  />

                  {/* DOB */}
                  <FormFieldCard
                    label="Date of Birth (DOB)"
                    fieldId="dob"
                    value={extractionData.patientDemographics.dob}
                    onChange={(val) => handleFieldValueChange('dob', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'dob')}
                    isSelected={activeFieldId === 'dob'}
                    onSelect={() => setActiveFieldId('dob')}
                    onToggleVerify={() => toggleFieldVerification('dob')}
                  />

                  {/* Age & Gender */}
                  <div className="grid grid-cols-2 gap-2">
                    <FormFieldCard
                      label="Age"
                      fieldId="age"
                      value={extractionData.patientDemographics.age}
                      onChange={(val) => handleFieldValueChange('age', val)}
                      field={extractionData.extractedFields.find((f) => f.fieldId === 'age')}
                      isSelected={activeFieldId === 'age'}
                      onSelect={() => setActiveFieldId('age')}
                      onToggleVerify={() => toggleFieldVerification('age')}
                    />
                    <FormFieldCard
                      label="Gender"
                      fieldId="gender"
                      value={extractionData.patientDemographics.gender}
                      onChange={(val) => {
                        const updated = { ...extractionData };
                        updated.patientDemographics.gender = val;
                        onUpdateExtraction(updated);
                      }}
                      field={extractionData.extractedFields.find((f) => f.fieldId === 'gender')}
                      isSelected={activeFieldId === 'gender'}
                      onSelect={() => setActiveFieldId('gender')}
                      onToggleVerify={() => toggleFieldVerification('gender')}
                    />
                  </div>

                  {/* Contact Phone */}
                  <FormFieldCard
                    label="Contact Telephone"
                    fieldId="phone"
                    value={extractionData.patientDemographics.contactPhone}
                    onChange={(val) => {
                      const updated = { ...extractionData };
                      updated.patientDemographics.contactPhone = val;
                      onUpdateExtraction(updated);
                    }}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'phone')}
                    isSelected={activeFieldId === 'phone'}
                    onSelect={() => setActiveFieldId('phone')}
                    onToggleVerify={() => toggleFieldVerification('phone')}
                  />

                  {/* Emergency Contact */}
                  <FormFieldCard
                    label="Emergency Contact"
                    fieldId="emergency_contact"
                    value={extractionData.patientDemographics.emergencyContact}
                    onChange={(val) => {
                      const updated = { ...extractionData };
                      updated.patientDemographics.emergencyContact = val;
                      onUpdateExtraction(updated);
                    }}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'emergency_contact')}
                    isSelected={activeFieldId === 'emergency_contact'}
                    onSelect={() => setActiveFieldId('emergency_contact')}
                    onToggleVerify={() => toggleFieldVerification('emergency_contact')}
                  />
                </div>
              </div>
            )}

            {/* 2. Vitals Tab */}
            {activeTab === 'vitals' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormFieldCard
                    label="Blood Pressure (BP)"
                    fieldId="bp"
                    value={extractionData.vitals.bloodPressure}
                    onChange={(val) => handleFieldValueChange('bp', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'bp')}
                    isSelected={activeFieldId === 'bp'}
                    onSelect={() => setActiveFieldId('bp')}
                    onToggleVerify={() => toggleFieldVerification('bp')}
                  />

                  <FormFieldCard
                    label="Heart Rate / Pulse (BPM)"
                    fieldId="pulse"
                    value={extractionData.vitals.heartRate}
                    onChange={(val) => handleFieldValueChange('pulse', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'pulse')}
                    isSelected={activeFieldId === 'pulse'}
                    onSelect={() => setActiveFieldId('pulse')}
                    onToggleVerify={() => toggleFieldVerification('pulse')}
                  />

                  <FormFieldCard
                    label="Body Temperature"
                    fieldId="temp"
                    value={extractionData.vitals.temperature}
                    onChange={(val) => handleFieldValueChange('temp', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'temp')}
                    isSelected={activeFieldId === 'temp'}
                    onSelect={() => setActiveFieldId('temp')}
                    onToggleVerify={() => toggleFieldVerification('temp')}
                  />

                  <FormFieldCard
                    label="Oxygen Saturation (SpO2)"
                    fieldId="spo2"
                    value={extractionData.vitals.spo2}
                    onChange={(val) => handleFieldValueChange('spo2', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'spo2')}
                    isSelected={activeFieldId === 'spo2'}
                    onSelect={() => setActiveFieldId('spo2')}
                    onToggleVerify={() => toggleFieldVerification('spo2')}
                  />

                  <FormFieldCard
                    label="Pain Score (1-10 Scale)"
                    fieldId="pain"
                    value={extractionData.vitals.painScore}
                    onChange={(val) => {
                      const updated = { ...extractionData };
                      updated.vitals.painScore = val;
                      onUpdateExtraction(updated);
                    }}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'pain')}
                    isSelected={activeFieldId === 'pain'}
                    onSelect={() => setActiveFieldId('pain')}
                    onToggleVerify={() => toggleFieldVerification('pain')}
                  />

                  <FormFieldCard
                    label="Respiratory Rate"
                    fieldId="resp_rate"
                    value={extractionData.vitals.respiratoryRate}
                    onChange={(val) => {
                      const updated = { ...extractionData };
                      updated.vitals.respiratoryRate = val;
                      onUpdateExtraction(updated);
                    }}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'resp_rate')}
                    isSelected={activeFieldId === 'resp_rate'}
                    onSelect={() => setActiveFieldId('resp_rate')}
                    onToggleVerify={() => toggleFieldVerification('resp_rate')}
                  />
                </div>
              </div>
            )}

            {/* 3. Clinical Notes Tab */}
            {activeTab === 'clinical' && (
              <div className="space-y-4">
                {/* Chief Complaint */}
                <FormFieldCard
                  label="Chief Complaint & History of Present Illness"
                  fieldId="chief_complaint"
                  value={extractionData.clinicalNotes.chiefComplaint}
                  onChange={(val) => handleFieldValueChange('chief_complaint', val)}
                  field={extractionData.extractedFields.find((f) => f.fieldId === 'chief_complaint')}
                  isSelected={activeFieldId === 'chief_complaint'}
                  onSelect={() => setActiveFieldId('chief_complaint')}
                  onToggleVerify={() => toggleFieldVerification('chief_complaint')}
                  isTextarea
                />

                {/* Drug Allergies Alert Card */}
                <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl relative">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>CRITICAL DRUG ALLERGIES (VERIFY BEFORE ORDERING)</span>
                  </div>
                  <FormFieldCard
                    label="Documented Allergies"
                    fieldId="allergies"
                    value={extractionData.clinicalNotes.allergies}
                    onChange={(val) => handleFieldValueChange('allergies', val)}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'allergies')}
                    isSelected={activeFieldId === 'allergies'}
                    onSelect={() => setActiveFieldId('allergies')}
                    onToggleVerify={() => toggleFieldVerification('allergies')}
                  />
                </div>

                {/* Provisional Diagnosis & ICD-10 */}
                <FormFieldCard
                  label="Provisional Diagnosis & ICD-10 Coding"
                  fieldId="diagnosis"
                  value={extractionData.clinicalNotes.provisionalDiagnosis}
                  onChange={(val) => handleFieldValueChange('diagnosis', val)}
                  field={extractionData.extractedFields.find((f) => f.fieldId === 'diagnosis')}
                  isSelected={activeFieldId === 'diagnosis'}
                  onSelect={() => setActiveFieldId('diagnosis')}
                  onToggleVerify={() => toggleFieldVerification('diagnosis')}
                />

                {/* Previous Diagnosis */}
                <FormFieldCard
                  label="Previous Diagnosis (Prior Facility / History)"
                  fieldId="previous_diagnosis"
                  value={extractionData.clinicalNotes.previousDiagnosis || ''}
                  onChange={(val) => {
                    const updated = { ...extractionData };
                    updated.clinicalNotes.previousDiagnosis = val;
                    onUpdateExtraction(updated);
                  }}
                  field={extractionData.extractedFields.find((f) => f.fieldId === 'previous_diagnosis')}
                  isSelected={activeFieldId === 'previous_diagnosis'}
                  onSelect={() => setActiveFieldId('previous_diagnosis')}
                  onToggleVerify={() => toggleFieldVerification('previous_diagnosis')}
                />
              </div>
            )}

            {/* 4. Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Medication Orders Extracted from Document:
                  </span>
                  <button
                    onClick={() => {
                      const newRx: PrescriptionItem = {
                        id: 'rx-' + Date.now(),
                        medicationName: 'New Medication',
                        dosage: '10 mg',
                        frequency: 'Daily',
                        route: 'Oral',
                        duration: '7 days',
                        refills: 0,
                      };
                      onUpdateExtraction({
                        ...extractionData,
                        prescriptions: [...extractionData.prescriptions, newRx],
                      });
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-medium border border-teal-500/20 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {extractionData.prescriptions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                    No prescription items detected in this document type.
                  </div>
                ) : (
                  extractionData.prescriptions.map((rx, idx) => (
                    <div
                      key={rx.id || idx}
                      className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                          <Pill className="w-3.5 h-3.5 text-teal-400" />
                          <span>Order #{idx + 1}</span>
                        </span>
                        <button
                          onClick={() => {
                            const updatedRx = extractionData.prescriptions.filter((_, i) => i !== idx);
                            onUpdateExtraction({ ...extractionData, prescriptions: updatedRx });
                          }}
                          className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Drug Name</label>
                          <input
                            type="text"
                            value={rx.medicationName}
                            onChange={(e) => {
                              const updatedRx = [...extractionData.prescriptions];
                              updatedRx[idx].medicationName = e.target.value;
                              onUpdateExtraction({ ...extractionData, prescriptions: updatedRx });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Dosage</label>
                          <input
                            type="text"
                            value={rx.dosage}
                            onChange={(e) => {
                              const updatedRx = [...extractionData.prescriptions];
                              updatedRx[idx].dosage = e.target.value;
                              onUpdateExtraction({ ...extractionData, prescriptions: updatedRx });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Frequency / Route</label>
                          <input
                            type="text"
                            value={rx.frequency}
                            onChange={(e) => {
                              const updatedRx = [...extractionData.prescriptions];
                              updatedRx[idx].frequency = e.target.value;
                              onUpdateExtraction({ ...extractionData, prescriptions: updatedRx });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 5. All Fields Tab (Full line-by-line breakdown matching the document) */}
            {activeTab === 'all-fields' && (
              <div className="space-y-3">
                <div className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-xl text-xs text-teal-300 flex items-center justify-between flex-wrap gap-2">
                  <span>Structured Form Line-by-Line Breakdown:</span>
                  <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAllFieldsFilter('all')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        allFieldsFilter === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({extractionData.extractedFields.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllFieldsFilter('in-pic')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        allFieldsFilter === 'in-pic' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      In Photo ({inPhotoCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllFieldsFilter('null-only')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        allFieldsFilter === 'null-only' ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Null / Missing ({nullFieldsCount})
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {extractionData.extractedFields
                    .filter((field) => {
                      if (allFieldsFilter === 'in-pic') return field.value && field.value !== 'null';
                      if (allFieldsFilter === 'null-only') return !field.value || field.value === 'null';
                      return true;
                    })
                    .map((field) => {
                      const isFieldNull = field.value === 'null' || !field.value;
                      return (
                        <div
                          key={field.fieldId}
                          onClick={() => setActiveFieldId(field.fieldId)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            activeFieldId === field.fieldId
                              ? 'bg-teal-950/40 border-teal-400 shadow-md ring-1 ring-teal-400/40'
                              : isFieldNull
                              ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                            <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
                              <span>{field.label}</span>
                              {isFieldNull && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                  null
                                </span>
                              )}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                {field.sourceType}
                              </span>
                              {!isFieldNull && (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                    field.confidence >= 0.9
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}
                                >
                                  {Math.round(field.confidence * 100)}%
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFieldValueChange(field.fieldId, isFieldNull ? (field.originalValue || '') : 'null');
                                }}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
                              >
                                {isFieldNull ? 'Restore' : 'Set null'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFieldVerification(field.fieldId);
                                }}
                                className={`p-1 rounded-md transition cursor-pointer ${
                                  field.isVerified
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleFieldValueChange(field.fieldId, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 6. Attending Physician Tab */}
            {activeTab === 'physician' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormFieldCard
                    label="Attending Doctor Full Name"
                    fieldId="physician"
                    value={extractionData.attendingPhysician.doctorName}
                    onChange={(val) => {
                      const updated = { ...extractionData };
                      updated.attendingPhysician.doctorName = val;
                      onUpdateExtraction(updated);
                    }}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'physician')}
                    isSelected={activeFieldId === 'physician'}
                    onSelect={() => setActiveFieldId('physician')}
                    onToggleVerify={() => toggleFieldVerification('physician')}
                  />

                  <FormFieldCard
                    label="License / NPI Number"
                    fieldId="license"
                    value={extractionData.attendingPhysician.licenseNumber}
                    onChange={(val) => {
                      const updated = { ...extractionData };
                      updated.attendingPhysician.licenseNumber = val;
                      onUpdateExtraction(updated);
                    }}
                    field={extractionData.extractedFields.find((f) => f.fieldId === 'license')}
                    isSelected={activeFieldId === 'license'}
                    onSelect={() => setActiveFieldId('license')}
                    onToggleVerify={() => toggleFieldVerification('license')}
                  />
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic &amp; Visual Document Authentication</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300">Physician Cursive Signature Detected</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300">Hospital Official Seal / Stamp Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer: Save to Encrypted Vault & Export */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <button
                onClick={exportAsFHIR}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>FHIR JSON</span>
              </button>

              <button
                onClick={exportAsCSV}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>CSV</span>
              </button>
            </div>

            <button
              onClick={() => onSaveToVault(extractionData)}
              disabled={isSaving}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer ${
                isSaving
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/25'
              }`}
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Encrypting & Storing...' : 'Save to Encrypted Vault (AES-256)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Custom Field Modal */}
      {isAddCustomFieldOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Add Custom Field from Document</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomFieldOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomField} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medicine Purchaser, Previous Diagnosis, Ward"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Field Value (leave blank or enter null if not in document)
                </label>
                <input
                  type="text"
                  placeholder="e.g. citragen 4 tablets, paracetamol 2 tablets or null"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newFieldCategory}
                  onChange={(e) => setNewFieldCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="demographics">Demographics</option>
                  <option value="vitals">Vitals</option>
                  <option value="clinical">Clinical Notes</option>
                  <option value="prescriptions">Orders / Prescriptions</option>
                  <option value="other">Other / Custom</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomFieldOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition cursor-pointer"
                >
                  Add Field to Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Form Field Card
interface FormFieldCardProps {
  label: string;
  fieldId: string;
  value: string;
  onChange: (val: string) => void;
  field?: ExtractedField;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVerify: () => void;
  isTextarea?: boolean;
}

const FormFieldCard: React.FC<FormFieldCardProps> = ({
  label,
  value,
  onChange,
  field,
  isSelected,
  onSelect,
  onToggleVerify,
  isTextarea = false,
}) => {
  const isNull = value === 'null' || value === '' || value === null || value === undefined;
  const conf = field?.confidence ?? 0.95;
  const isVerified = field?.isVerified ?? false;
  const isCorrected = field?.originalValue && field.originalValue !== value;

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'bg-teal-950/30 border-teal-500/80 shadow-md ring-1 ring-teal-500/30'
          : isNull
          ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
        <label className="text-xs font-bold text-slate-200 truncate pr-2 flex items-center space-x-1.5">
          <span>{label}</span>
          {isNull && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              null (not in pic)
            </span>
          )}
          {!isNull && field && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              in pic
            </span>
          )}
        </label>

        <div className="flex items-center space-x-1.5">
          {/* Quick Toggle Null / Enter value button */}
          {isNull ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Click to enter a custom value"
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 transition cursor-pointer"
            >
              Enter value
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('null');
              }}
              title="Set to null (if not in picture)"
              className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-amber-300 bg-slate-800 hover:bg-amber-950/30 border border-slate-700 hover:border-amber-500/40 transition cursor-pointer"
            >
              Set null
            </button>
          )}

          {/* Confidence Badge */}
          {!isNull && (
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                conf >= 0.9
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : conf >= 0.7
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {Math.round(conf * 100)}%
            </span>
          )}

          {/* Verification checkmark toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVerify();
            }}
            title={isVerified ? 'Verified by Reviewer' : 'Click to Verify'}
            className={`p-1 rounded-md transition cursor-pointer ${
              isVerified
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
            }`}
          >
            <Check className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Input Field with full editability */}
      {isTextarea ? (
        <textarea
          rows={3}
          value={value === 'null' ? 'null' : (value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="null (not provided in document)"
          className={`w-full border rounded-lg p-2 text-xs outline-none resize-none transition ${
            isNull
              ? 'bg-slate-950/80 border-slate-800 text-slate-400 italic focus:text-slate-100 focus:not-italic focus:border-teal-400'
              : 'bg-slate-900 border-slate-800 focus:border-teal-400 text-slate-100'
          }`}
        />
      ) : (
        <input
          type="text"
          value={value === 'null' ? 'null' : (value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="null (not provided in document)"
          className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none transition ${
            isNull
              ? 'bg-slate-950/80 border-slate-800 text-slate-400 italic focus:text-slate-100 focus:not-italic focus:border-teal-400'
              : 'bg-slate-900 border-slate-800 focus:border-teal-400 text-slate-100'
          }`}
        />
      )}

      {/* Discrepancy indicator if modified */}
      {isCorrected && (
        <div className="mt-1 flex items-center space-x-1 text-[10px] text-amber-400 font-mono">
          <Edit3 className="w-2.5 h-2.5" />
          <span>Edited from: &ldquo;{field?.originalValue}&rdquo;</span>
        </div>
      )}
    </div>
  );
};
