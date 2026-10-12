import { ExtractionResult } from '../types/document';

export interface SampleDocumentPreset {
  id: string;
  name: string;
  category: 'Hospital Intake' | 'Prescription' | 'Inpatient Admission' | 'Lab Report';
  badge: string;
  description: string;
  imageUrl: string;
  defaultExtraction: ExtractionResult;
}

// Generate realistic SVG image Data URI for Mounisaa's handwritten clinical intake note
function createMounisaaHandwrittenSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1000" width="750" height="1000" style="background:#e2e8f0; font-family:'Segoe Print', 'Bradley Hand', 'Chalkboard', cursive, sans-serif;">
    <defs>
      <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="2" dy="5" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Paper Sheet -->
    <rect x="25" y="20" width="700" height="960" rx="3" fill="#fcfcfd" stroke="#cbd5e1" stroke-width="1.5" filter="url(#paper-shadow)"/>

    <!-- Subtle paper texture lines -->
    <g stroke="#f1f5f9" stroke-width="1">
      <line x1="25" y1="90" x2="725" y2="90" />
      <line x1="25" y1="130" x2="725" y2="130" />
      <line x1="25" y1="180" x2="725" y2="180" />
      <line x1="25" y1="225" x2="725" y2="225" />
      <line x1="25" y1="270" x2="725" y2="270" />
      <line x1="25" y1="315" x2="725" y2="315" />
      <line x1="25" y1="360" x2="725" y2="360" />
      <line x1="25" y1="410" x2="725" y2="410" />
      <line x1="25" y1="465" x2="725" y2="465" />
      <line x1="25" y1="520" x2="725" y2="520" />
      <line x1="25" y1="580" x2="725" y2="580" />
      <line x1="25" y1="640" x2="725" y2="640" />
      <line x1="25" y1="710" x2="725" y2="710" />
      <line x1="25" y1="780" x2="725" y2="780" />
      <line x1="25" y1="850" x2="725" y2="850" />
    </g>

    <!-- Handwritten Text in dark ink matching image.png -->
    <g fill="#1e293b" font-size="22" letter-spacing="0.5">
      <!-- Line 1: Patient Name -->
      <text x="60" y="65" font-weight="bold">PATIENT NAME : <tspan fill="#0f172a">MOUNISAA.T</tspan></text>

      <!-- Line 2: DOB -->
      <text x="60" y="105" font-weight="bold">DATE OF BIRTH : <tspan fill="#0f172a">20 /03/2008 .</tspan></text>

      <!-- Line 3: Blood Pressure -->
      <text x="70" y="155" font-weight="bold">BLOOD PRESSURE : <tspan fill="#0f172a">138/88 mm Hg</tspan></text>

      <!-- Line 4: Heart Rate -->
      <text x="80" y="200" font-weight="bold">HEART RATE : <tspan fill="#0f172a">92 bpm</tspan></text>

      <!-- Line 5: Body Temperature -->
      <text x="85" y="245" font-weight="bold">BODY TEMPERATE : <tspan fill="#0f172a">100 °F</tspan></text>

      <!-- Line 6: Respiratory Rate -->
      <text x="90" y="290" font-weight="bold">RESPIRATORY RATE : <tspan fill="#0f172a">18 breaths/min</tspan></text>

      <!-- Line 7: Age -->
      <text x="100" y="340" font-weight="bold">Age : <tspan fill="#0f172a">30</tspan></text>

      <!-- Line 8: Gender -->
      <text x="100" y="388" font-weight="bold">Gender : <tspan fill="#0f172a">female .</tspan></text>

      <!-- Line 9: Phone -->
      <text x="100" y="445" font-weight="bold">Phone : <tspan fill="#0f172a">95978  44102</tspan></text>

      <!-- Line 10: Medical Record No -->
      <text x="100" y="500" font-weight="bold">MEDICAL RECORD NO : <tspan fill="#0f172a">788400</tspan></text>

      <!-- Line 11: Medicine Purchaser -->
      <text x="95" y="555" font-weight="bold">MEDICINE PURCHASER : <tspan font-size="20">citragen 4 tablets</tspan></text>
      <text x="460" y="595" font-size="20">paracetamol 2 tablets</text>

      <!-- Line 12: Present Illness -->
      <text x="90" y="660" font-weight="bold">PRESENT ILLNESS : <tspan font-size="21">Acute persistent RLQ</tspan></text>
      <text x="340" y="700" font-size="21">abdominal pain for 18 hours,</text>
      <text x="350" y="745" font-size="21">nausea &amp; fever .</text>

      <!-- Line 13: Previous Diagnosis -->
      <text x="90" y="805" font-weight="bold">PREVIOUS DIAGNOSIS : <tspan font-size="20">At government hospital</tspan></text>
      <text x="410" y="845" font-size="20">mohanur .</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate realistic SVG image Data URIs for medical forms
function createHospitalIntakeSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#f8f9fa; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
    <defs>
      <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.08"/>
      </filter>
    </defs>
    <rect x="25" y="25" width="800" height="1050" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#paper-shadow)"/>
    <rect x="25" y="25" width="800" height="95" fill="#0f172a"/>
    <circle cx="75" cy="72" r="28" fill="#0d9488"/>
    <path d="M75 56 v32 M59 72 h32" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <text x="120" y="62" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="0.5">METRO GENERAL HOSPITAL</text>
    <text x="120" y="85" font-size="13" font-weight="600" fill="#94a3b8">EMERGENCY CLINICAL INTAKE &amp; TRIAGE RECORD</text>
    <text x="650" y="55" font-size="11" font-weight="700" fill="#38bdf8">TRIAGE: LEVEL 2 (EMERGENT)</text>
    <rect x="650" y="65" width="145" height="36" fill="#1e293b" rx="4"/>
    <text x="660" y="88" font-size="13" font-weight="700" fill="#38bdf8" font-family="monospace">MRN: 784920</text>
    <rect x="50" y="130" width="580" height="24" fill="#f1f5f9" rx="3"/>
    <text x="60" y="147" font-size="12" font-weight="700" fill="#0f172a">1. PATIENT DEMOGRAPHIC IDENTIFICATION</text>
    <line x1="50" y1="210" x2="800" y2="210" stroke="#e2e8f0" stroke-width="1"/>
    <text x="55" y="180" font-size="11" font-weight="600" fill="#64748b">PATIENT NAME:</text>
    <text x="235" y="182" font-size="18" font-family="cursive" font-weight="bold" fill="#1e3a8a">Eleanor Vance</text>
    <text x="440" y="180" font-size="11" font-weight="600" fill="#64748b">DOB:</text>
    <text x="480" y="182" font-size="16" font-family="cursive" fill="#1e3a8a">06/18/1984</text>
    <text x="610" y="180" font-size="11" font-weight="600" fill="#64748b">AGE:</text>
    <text x="645" y="182" font-size="16" font-family="cursive" fill="#1e3a8a">42</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createPrescriptionSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 950" width="750" height="950" style="background:#fffbeb; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
    <rect x="20" y="20" width="710" height="910" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="20" y="20" width="710" height="110" fill="#1e293b"/>
    <text x="50" y="60" font-size="20" font-weight="800" fill="#ffffff">ST. JUDE COMPREHENSIVE CLINIC</text>
    <text x="50" y="85" font-size="13" fill="#cbd5e1">DEPARTMENT OF INTERNAL MEDICINE</text>
    <text x="560" y="60" font-size="16" font-weight="800" fill="#38bdf8">Rx #4912</text>
    <g transform="translate(50, 150)">
      <text x="0" y="20" font-size="11" font-weight="700" fill="#64748b">PATIENT NAME:</text>
      <text x="120" y="22" font-size="18" font-family="cursive" font-weight="bold" fill="#1e3a8a">Marcus Thorne</text>
      <text x="400" y="20" font-size="11" font-weight="700" fill="#64748b">AGE / SEX:</text>
      <text x="490" y="22" font-size="16" font-family="cursive" fill="#1e3a8a">58 / Male</text>
      <line x1="0" y1="85" x2="650" y2="85" stroke="#e2e8f0"/>
    </g>
    <g transform="translate(50, 260)">
      <text x="0" y="65" font-size="70" font-family="serif" font-weight="bold" fill="#0d9488">℞</text>
      <g transform="translate(65, 20)">
        <text x="0" y="20" font-size="20" font-family="cursive" font-weight="bold" fill="#1e3a8a">1. Amoxicillin / Clavulanate 875/125 mg</text>
        <text x="0" y="125" font-size="20" font-family="cursive" font-weight="bold" fill="#1e3a8a">2. Benzonatate 200 mg</text>
      </g>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PRESETS: SampleDocumentPreset[] = [
  {
    id: 'mounisaa-intake-note',
    name: 'Handwritten Intake Note (Mounisaa.T)',
    category: 'Hospital Intake',
    badge: '100% Verified Match',
    description: 'Actual handwritten clinical triage sheet with full patient details, vitals, present illness & diagnosis.',
    imageUrl: createMounisaaHandwrittenSvg(),
    defaultExtraction: {
      documentInfo: {
        title: 'Clinical Triage & Patient Intake Assessment',
        facilityName: 'Government Hospital Mohanur / General Ward',
        documentType: 'Handwritten Clinical Sheet',
        scannedDate: 'October 12, 2026',
        orientationAngle: 0,
        noiseLevel: 'low',
        handwritingLegibility: 'clear',
      },
      patientDemographics: {
        fullName: 'MOUNISAA.T',
        age: '30',
        gender: 'female',
        dob: '20/03/2008',
        mrn: '788400',
        contactPhone: '95978 44102',
        address: 'null',
        emergencyContact: 'null',
      },
      encounter: {
        encounterDate: 'null',
        department: 'null',
        triageLevel: 'null',
        roomBed: 'null',
        admittingPhysician: 'null',
      },
      vitals: {
        bloodPressure: '138/88 mm Hg',
        heartRate: '92 bpm',
        respiratoryRate: '18 breaths/min',
        temperature: '100 °F',
        spo2: 'null',
        painScore: 'null',
      },
      clinicalNotes: {
        chiefComplaint: 'Acute persistent RLQ abdominal pain for 18 hours, nausea & fever.',
        symptomOnset: 'null',
        allergies: 'null',
        medicalHistory: 'null',
        provisionalDiagnosis: 'null',
        previousDiagnosis: 'At government hospital mohanur.',
      },
      prescriptions: [
        {
          id: 'rx-m1',
          medicationName: 'Citragen',
          dosage: '4 tablets',
          frequency: 'null',
          route: 'Oral',
          duration: 'null',
          refills: 'null',
        },
        {
          id: 'rx-m2',
          medicationName: 'Paracetamol',
          dosage: '2 tablets',
          frequency: 'null',
          route: 'Oral',
          duration: 'null',
          refills: 'null',
        },
      ],
      attendingPhysician: {
        doctorName: 'null',
        licenseNumber: 'null',
        signatureDetected: false,
        hospitalStampPresent: false,
      },
      extractedFields: [
        {
          fieldId: 'patient_name',
          label: 'Patient Full Name',
          value: 'MOUNISAA.T',
          originalValue: 'MOUNISAA.T',
          confidence: 0.99,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 7.5, y: 3.5, width: 85.0, height: 4.2 },
          rawSnippet: 'PATIENT NAME : MOUNISAA.T',
          isVerified: true,
        },
        {
          fieldId: 'dob',
          label: 'Date of Birth (DOB)',
          value: '20/03/2008',
          originalValue: '20 /03/2008 .',
          confidence: 0.98,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 7.5, y: 7.5, width: 85.0, height: 4.2 },
          rawSnippet: 'DATE OF BIRTH : 20 /03/2008 .',
          isVerified: true,
        },
        {
          fieldId: 'bp',
          label: 'Blood Pressure',
          value: '138/88 mm Hg',
          originalValue: '138/88 mm Hg',
          confidence: 0.97,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 7.5, y: 12.5, width: 85.0, height: 4.2 },
          rawSnippet: 'BLOOD PRESSURE : 138/88 mm Hg',
          isVerified: true,
        },
        {
          fieldId: 'pulse',
          label: 'Heart Rate (Pulse)',
          value: '92 bpm',
          originalValue: '92 bpm',
          confidence: 0.96,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 7.5, y: 17.0, width: 85.0, height: 4.2 },
          rawSnippet: 'HEART RATE : 92 bpm',
          isVerified: true,
        },
        {
          fieldId: 'temp',
          label: 'Body Temperature',
          value: '100 °F',
          originalValue: '100 °F',
          confidence: 0.95,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 7.5, y: 21.5, width: 85.0, height: 4.2 },
          rawSnippet: 'BODY TEMPERATE : 100 °F',
          isVerified: true,
        },
        {
          fieldId: 'resp_rate',
          label: 'Respiratory Rate',
          value: '18 breaths/min',
          originalValue: '18 breaths/min',
          confidence: 0.96,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 7.5, y: 26.0, width: 85.0, height: 4.2 },
          rawSnippet: 'RESPIRATORY RATE : 18 breaths/min',
          isVerified: true,
        },
        {
          fieldId: 'age',
          label: 'Age',
          value: '30',
          originalValue: '30',
          confidence: 0.99,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 7.5, y: 31.0, width: 45.0, height: 4.0 },
          rawSnippet: 'Age : 30',
          isVerified: true,
        },
        {
          fieldId: 'gender',
          label: 'Gender',
          value: 'female',
          originalValue: 'female .',
          confidence: 0.98,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 7.5, y: 35.8, width: 55.0, height: 4.0 },
          rawSnippet: 'Gender : female .',
          isVerified: true,
        },
        {
          fieldId: 'phone',
          label: 'Contact Telephone',
          value: '95978 44102',
          originalValue: '95978 44102',
          confidence: 0.99,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 7.5, y: 41.5, width: 85.0, height: 4.2 },
          rawSnippet: 'Phone : 95978 44102',
          isVerified: true,
        },
        {
          fieldId: 'mrn',
          label: 'Medical Record Number (MRN)',
          value: '788400',
          originalValue: '788400',
          confidence: 0.99,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 7.5, y: 47.0, width: 85.0, height: 4.2 },
          rawSnippet: 'MEDICAL RECORD NO : 788400',
          isVerified: true,
        },
        {
          fieldId: 'medications',
          label: 'Medicine Purchaser',
          value: 'Citragen 4 tablets, Paracetamol 2 tablets',
          originalValue: 'citragen 4 tablets, paracetamol 2 tablets',
          confidence: 0.94,
          sourceType: 'handwritten',
          category: 'prescriptions',
          boundingBox: { x: 7.5, y: 52.5, width: 88.0, height: 8.5 },
          rawSnippet: 'MEDICINE PURCHASER : citragen 4 tablets, paracetamol 2 tablets',
          isVerified: true,
        },
        {
          fieldId: 'chief_complaint',
          label: 'Present Illness',
          value: 'Acute persistent RLQ abdominal pain for 18 hours, nausea & fever.',
          originalValue: 'Acute persistent RLQ abdominal pain for 18 hours, nausea & fever.',
          confidence: 0.93,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 7.5, y: 62.5, width: 88.0, height: 12.0 },
          rawSnippet: 'PRESENT ILLNESS : Acute persistent RLQ abdominal pain for 18 hours, nausea & fever.',
          isVerified: true,
        },
        {
          fieldId: 'previous_diagnosis',
          label: 'Previous Diagnosis',
          value: 'At government hospital mohanur.',
          originalValue: 'At government hospital mohanur.',
          confidence: 0.96,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 7.5, y: 77.0, width: 88.0, height: 8.5 },
          rawSnippet: 'PREVIOUS DIAGNOSIS : At government hospital mohanur.',
          isVerified: true,
        },
      ],
    },
  },
  {
    id: 'hospital-intake-1',
    name: 'Hospital Intake & Triage Chart',
    category: 'Hospital Intake',
    badge: 'Printed Hospital Grid',
    description: 'Emergency department triage slip with cursive notes, triage vital signs, and allergy flags.',
    imageUrl: createHospitalIntakeSvg(),
    defaultExtraction: {
      documentInfo: {
        title: 'Emergency Clinical Intake & Triage Record',
        facilityName: 'Metro General Hospital & Trauma Center',
        documentType: 'Emergency Triage Form',
        scannedDate: 'October 12, 2026',
        orientationAngle: 0,
        noiseLevel: 'low',
        handwritingLegibility: 'clear',
      },
      patientDemographics: {
        fullName: 'Eleanor Vance',
        age: '42',
        gender: 'Female',
        dob: '1984-06-18',
        mrn: 'MRN-784920',
        contactPhone: '(555) 382-9014',
        address: '742 Evergreen Terrace, Springfield',
        emergencyContact: 'David Vance (Spouse) - (555) 382-9015',
      },
      encounter: {
        encounterDate: '2026-10-12',
        department: 'Emergency Medicine',
        triageLevel: 'Level 2 - Emergent',
        roomBed: 'Bay 4A',
        admittingPhysician: 'Dr. Sarah Lin, MD',
      },
      vitals: {
        bloodPressure: '138/88 mmHg',
        heartRate: '92 bpm',
        respiratoryRate: '18 breaths/min',
        temperature: '101.4 °F',
        spo2: '97% on room air',
        painScore: '7 / 10',
      },
      clinicalNotes: {
        chiefComplaint: 'Acute persistent right lower quadrant (RLQ) abdominal pain for 18 hours, nausea & fever.',
        symptomOnset: '18 hours ago, worsening with cough & movement',
        allergies: 'PENICILLIN (Anaphylaxis), SULFA DRUGS (Urticaria/Rash)',
        medicalHistory: 'Mild hypertension, Appendectomy pending, No prior surgeries.',
        provisionalDiagnosis: 'Suspected Acute Appendicitis (ICD-10: K35.80)',
      },
      prescriptions: [
        {
          id: 'rx-1',
          medicationName: 'Ciprofloxacin IV',
          dosage: '400 mg',
          frequency: 'q12h (Every 12h)',
          route: 'Intravenous',
          duration: '3 days',
          refills: 0,
        },
      ],
      attendingPhysician: {
        doctorName: 'Dr. Sarah Lin, MD',
        licenseNumber: 'MD-892401',
        signatureDetected: true,
        hospitalStampPresent: true,
      },
      extractedFields: [
        {
          fieldId: 'patient_name',
          label: 'Patient Full Name',
          value: 'Eleanor Vance',
          originalValue: 'Eleanor Vance',
          confidence: 0.96,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 26.5, y: 15.8, width: 23.5, height: 3.2 },
          rawSnippet: 'Eleanor Vance',
          isVerified: true,
        },
      ],
    },
  },
  {
    id: 'prescription-slip-2',
    name: 'Physician Outpatient Rx Slip',
    category: 'Prescription',
    badge: 'Cursive Rx Slip',
    description: 'Handwritten prescription order slip with antibiotic dosages, refills, and clinic stamp.',
    imageUrl: createPrescriptionSvg(),
    defaultExtraction: {
      documentInfo: {
        title: 'Prescription Order Slip #4912',
        facilityName: 'St. Jude Comprehensive Medical Clinic',
        documentType: 'Outpatient Prescription',
        scannedDate: 'October 12, 2026',
        orientationAngle: 0,
        noiseLevel: 'low',
        handwritingLegibility: 'moderate',
      },
      patientDemographics: {
        fullName: 'Marcus Thorne',
        age: '58',
        gender: 'Male',
        dob: '1968-04-12',
        mrn: 'MRN-419022',
        contactPhone: '(555) 728-1920',
        address: '402 Highgrove Crescent, Los Angeles, CA',
        emergencyContact: 'Elena Thorne (Daughter) - (555) 728-9901',
      },
      encounter: {
        encounterDate: '2026-10-12',
        department: 'Internal Medicine',
        triageLevel: 'Routine Outpatient',
        roomBed: 'Exam Room 3',
        admittingPhysician: 'Dr. Christopher Ross, MD',
      },
      vitals: {
        bloodPressure: '128/82 mmHg',
        heartRate: '76 bpm',
        respiratoryRate: '16 breaths/min',
        temperature: '99.1 °F',
        spo2: '98%',
        painScore: '2 / 10',
      },
      clinicalNotes: {
        chiefComplaint: 'Facial pressure, purulent nasal discharge x 9 days, productive cough.',
        symptomOnset: '9 days ago following viral cold',
        allergies: 'Aspirin (Bronchospasm / Wheezing)',
        medicalHistory: 'Hyperlipidemia, Seasonal allergic rhinitis',
        provisionalDiagnosis: 'Acute Bacterial Sinusitis with cough (ICD-10: J01.90)',
      },
      prescriptions: [
        {
          id: 'rx-21',
          medicationName: 'Amoxicillin / Clavulanate (Augmentin)',
          dosage: '875/125 mg',
          frequency: 'PO twice daily with food',
          route: 'Oral',
          duration: '10 days (Disp: #20)',
          refills: 0,
        },
      ],
      attendingPhysician: {
        doctorName: 'Dr. Christopher Ross, MD, FACP',
        licenseNumber: 'CA-G78921',
        signatureDetected: true,
        hospitalStampPresent: true,
      },
      extractedFields: [
        {
          fieldId: 'patient_name',
          label: 'Patient Full Name',
          value: 'Marcus Thorne',
          originalValue: 'Marcus Thorne',
          confidence: 0.95,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 19.5, y: 17.5, width: 28.0, height: 3.5 },
          rawSnippet: 'Marcus Thorne',
          isVerified: true,
        },
      ],
    },
  },
];
