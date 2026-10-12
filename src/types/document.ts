export type SourceType = 'handwritten' | 'printed' | 'checkbox' | 'stamp';

export interface BoundingBox {
  x: number; // percentage [0, 100]
  y: number; // percentage [0, 100]
  width: number; // percentage [0, 100]
  height: number; // percentage [0, 100]
}

export interface ExtractedField {
  fieldId: string;
  label: string;
  value: string;
  originalValue?: string; // OCR initial value before human verification
  confidence: number; // 0.0 - 1.0
  sourceType: SourceType;
  boundingBox: BoundingBox;
  rawSnippet?: string;
  category: 'demographics' | 'vitals' | 'clinical' | 'prescriptions' | 'physician' | 'other';
  isVerified?: boolean;
  isFlagged?: boolean;
  editHistory?: Array<{
    timestamp: string;
    from: string;
    to: string;
    by: string;
  }>;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  refills: number | string;
}

export interface DocumentInfo {
  title: string;
  facilityName: string;
  documentType: string;
  scannedDate: string;
  orientationAngle: number;
  noiseLevel: 'low' | 'medium' | 'high';
  handwritingLegibility: 'clear' | 'moderate' | 'challenging' | 'poor';
}

export interface PatientDemographics {
  fullName: string;
  age: string;
  gender: string;
  dob: string;
  mrn: string;
  contactPhone: string;
  address: string;
  emergencyContact: string;
}

export interface EncounterDetails {
  encounterDate: string;
  department: string;
  triageLevel: string;
  roomBed: string;
  admittingPhysician: string;
}

export interface ClinicalVitals {
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  spo2: string;
  painScore: string;
}

export interface ClinicalNotes {
  chiefComplaint: string;
  symptomOnset: string;
  allergies: string;
  medicalHistory: string;
  provisionalDiagnosis: string;
}

export interface AttendingPhysician {
  doctorName: string;
  licenseNumber: string;
  signatureDetected: boolean;
  hospitalStampPresent: boolean;
}

export interface ExtractionResult {
  documentInfo: DocumentInfo;
  patientDemographics: PatientDemographics;
  encounter: EncounterDetails;
  vitals: ClinicalVitals;
  clinicalNotes: ClinicalNotes;
  prescriptions: PrescriptionItem[];
  attendingPhysician: AttendingPhysician;
  extractedFields: ExtractedField[];
}

export interface CVProcessingOptions {
  grayscale: boolean;
  binarization: boolean;
  binarizeThreshold: number; // 0 - 255
  contrast: number; // 0.5 - 2.5
  brightness: number; // -100 - 100
  noiseReduction: boolean; // Gaussian/median blur
  deskewAngle: number; // -15 to +15
  rotationStep: number; // 0, 90, 180, 270
  edgeDetection: boolean; // Sobel filter
}

export interface EncryptedRecordMeta {
  id: string;
  createdAt: string;
  updatedAt: string;
  documentType: string;
  patientNameEncrypted: string;
  recordNumber: string;
  encryptionMethod: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'EXPORTED' | 'ARCHIVED';
  verifiedBy?: string;
  confidenceScoreAvg: number;
  checksum: string;
  encryptedData: string;
  iv: string;
  authTag?: string;
  keySalt: string;
  auditTrailCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  operator: string;
  details: string;
  recordId?: string;
  hash: string;
}
