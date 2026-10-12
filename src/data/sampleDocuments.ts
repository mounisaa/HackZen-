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

// Generate realistic SVG image Data URIs for medical forms
function createHospitalIntakeSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#f8f9fa; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.08"/>
      </filter>
    </defs>

    <!-- Paper Sheet -->
    <rect x="25" y="25" width="800" height="1050" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#paper-shadow)"/>

    <!-- Document Header -->
    <rect x="25" y="25" width="800" height="95" fill="#0f172a"/>
    <circle cx="75" cy="72" r="28" fill="#0d9488"/>
    <path d="M75 56 v32 M59 72 h32" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <text x="120" y="62" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="0.5">METRO GENERAL HOSPITAL</text>
    <text x="120" y="85" font-size="13" font-weight="600" fill="#94a3b8">EMERGENCY CLINICAL INTAKE &amp; TRIAGE RECORD</text>
    <text x="650" y="55" font-size="11" font-weight="700" fill="#38bdf8">TRIAGE: LEVEL 2 (EMERGENT)</text>
    <rect x="650" y="65" width="145" height="36" fill="#1e293b" rx="4"/>
    <text x="660" y="88" font-size="13" font-weight="700" fill="#38bdf8" font-family="monospace">MRN: 784920</text>

    <!-- Barcode simulation -->
    <g transform="translate(650, 130)">
      <rect x="0" y="0" width="4" height="26" fill="#334155"/>
      <rect x="7" y="0" width="2" height="26" fill="#334155"/>
      <rect x="12" y="0" width="6" height="26" fill="#334155"/>
      <rect x="22" y="0" width="3" height="26" fill="#334155"/>
      <rect x="28" y="0" width="5" height="26" fill="#334155"/>
      <rect x="36" y="0" width="2" height="26" fill="#334155"/>
      <rect x="42" y="0" width="4" height="26" fill="#334155"/>
      <rect x="50" y="0" width="6" height="26" fill="#334155"/>
      <rect x="60" y="0" width="2" height="26" fill="#334155"/>
      <rect x="66" y="0" width="5" height="26" fill="#334155"/>
      <rect x="75" y="0" width="3" height="26" fill="#334155"/>
      <rect x="82" y="0" width="4" height="26" fill="#334155"/>
      <text x="15" y="38" font-size="9" fill="#64748b" font-family="monospace">*784920-MGH*</text>
    </g>

    <!-- Section 1: Demographics -->
    <rect x="50" y="130" width="580" height="24" fill="#f1f5f9" rx="3"/>
    <text x="60" y="147" font-size="12" font-weight="700" fill="#0f172a">1. PATIENT DEMOGRAPHIC IDENTIFICATION</text>

    <!-- Field grid -->
    <line x1="50" y1="210" x2="800" y2="210" stroke="#e2e8f0" stroke-width="1"/>
    <text x="55" y="180" font-size="11" font-weight="600" fill="#64748b">PATIENT NAME (LAST, FIRST, MI):</text>
    <!-- Handwritten simulation -->
    <text x="235" y="182" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">Eleanor Vance</text>

    <text x="440" y="180" font-size="11" font-weight="600" fill="#64748b">DOB:</text>
    <text x="480" y="182" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">06/18/1984</text>

    <text x="610" y="180" font-size="11" font-weight="600" fill="#64748b">AGE:</text>
    <text x="645" y="182" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">42</text>

    <text x="700" y="180" font-size="11" font-weight="600" fill="#64748b">SEX:</text>
    <rect x="735" y="170" width="12" height="12" fill="none" stroke="#64748b"/>
    <text x="752" y="180" font-size="10" fill="#64748b">M</text>
    <rect x="770" y="170" width="12" height="12" fill="#0d9488" stroke="#0d9488"/>
    <path d="M772 176 l3 4 l6 -8" stroke="#fff" stroke-width="2" fill="none"/>
    <text x="787" y="180" font-size="10" fill="#0f172a" font-weight="bold">F</text>

    <text x="55" y="240" font-size="11" font-weight="600" fill="#64748b">PHONE NUMBER:</text>
    <text x="165" y="242" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">(555) 382-9014</text>

    <text x="360" y="240" font-size="11" font-weight="600" fill="#64748b">EMERGENCY CONTACT:</text>
    <text x="510" y="242" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">David Vance (Spouse) - 555-382-9015</text>
    <line x1="50" y1="265" x2="800" y2="265" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Section 2: Clinical Vitals -->
    <rect x="50" y="280" width="750" height="24" fill="#f1f5f9" rx="3"/>
    <text x="60" y="297" font-size="12" font-weight="700" fill="#0f172a">2. TRIAGE VITALS &amp; PHYSIOLOGICAL BASELINE</text>

    <g transform="translate(50, 315)">
      <rect x="0" y="0" width="140" height="55" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="10" y="18" font-size="10" font-weight="700" fill="#64748b">BLOOD PRESSURE</text>
      <text x="10" y="45" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#0369a1">138/88</text>
      <text x="85" y="45" font-size="10" fill="#64748b">mmHg</text>

      <rect x="150" y="0" width="140" height="55" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="160" y="18" font-size="10" font-weight="700" fill="#64748b">PULSE / HR</text>
      <text x="160" y="45" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#0369a1">92</text>
      <text x="210" y="45" font-size="10" fill="#64748b">bpm</text>

      <rect x="300" y="0" width="140" height="55" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="310" y="18" font-size="10" font-weight="700" fill="#64748b">TEMPERATURE</text>
      <text x="310" y="45" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#dc2626">101.4</text>
      <text x="375" y="45" font-size="10" fill="#64748b">°F (oral)</text>

      <rect x="450" y="0" width="140" height="55" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="460" y="18" font-size="10" font-weight="700" fill="#64748b">SpO2 (PULSE OX)</text>
      <text x="460" y="45" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#0369a1">97%</text>
      <text x="520" y="45" font-size="10" fill="#64748b">room air</text>

      <rect x="600" y="0" width="150" height="55" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="610" y="18" font-size="10" font-weight="700" fill="#64748b">PAIN SCALE (1-10)</text>
      <text x="610" y="45" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#dc2626">7 / 10</text>
      <text x="680" y="45" font-size="10" fill="#dc2626">Severe</text>
    </g>

    <!-- Section 3: Chief Complaint & Clinical Notes -->
    <rect x="50" y="395" width="750" height="24" fill="#f1f5f9" rx="3"/>
    <text x="60" y="412" font-size="12" font-weight="700" fill="#0f172a">3. CHIEF COMPLAINT &amp; HISTORY OF PRESENT ILLNESS</text>

    <text x="55" y="445" font-size="11" font-weight="600" fill="#64748b">PRIMARY REASON FOR VISIT / ONSET:</text>
    <path d="M50 480 h750 M50 515 h750" stroke="#e2e8f0" stroke-dasharray="3 3"/>
    <text x="60" y="475" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
      Acute persistent right lower quadrant (RLQ) abdominal pain x 18 hours.
    </text>
    <text x="60" y="508" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
      Associated with nausea, non-bilious emesis x 2, and worsening with cough. McBurney's point tenderness noted.
    </text>

    <!-- Section 4: Allergies Alert Box -->
    <rect x="50" y="535" width="750" height="55" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5" rx="4"/>
    <text x="65" y="555" font-size="11" font-weight="800" fill="#dc2626">⚠️ KNOWN DRUG ALLERGIES (CRITICAL REVIEW):</text>
    <text x="65" y="578" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#b91c1c">
      PENICILLIN (Severe: Anaphylaxis, throat tightness) | SULFA DRUGS (Urticaria/Rash)
    </text>

    <!-- Section 5: Provisional Diagnosis -->
    <rect x="50" y="605" width="750" height="24" fill="#f1f5f9" rx="3"/>
    <text x="60" y="622" font-size="12" font-weight="700" fill="#0f172a">4. PROVISIONAL CLINICAL DIAGNOSIS &amp; ICD-10</text>
    <text x="60" y="660" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">
      Suspected Acute Appendicitis without perforation (ICD-10: K35.80) - Urgent Surgical Consult
    </text>
    <line x1="50" y1="675" x2="800" y2="675" stroke="#e2e8f0"/>

    <!-- Section 6: Emergency Orders & Medications -->
    <rect x="50" y="695" width="750" height="24" fill="#f1f5f9" rx="3"/>
    <text x="60" y="712" font-size="12" font-weight="700" fill="#0f172a">5. IMMEDIATE PHARMACEUTICAL ORDERS &amp; IV PROTOCOL</text>
    
    <text x="65" y="748" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">1. Ciprofloxacin IV 400 mg q12h in 200mL D5W over 60 mins</text>
    <text x="65" y="780" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">2. Metronidazole (Flagyl) 500 mg IV infusion TID</text>
    <text x="65" y="812" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">3. Ondansetron (Zofran) 4 mg IV push PRN severe nausea / vomiting</text>
    <line x1="50" y1="835" x2="800" y2="835" stroke="#e2e8f0"/>

    <!-- Section 7: Attending & Stamp -->
    <g transform="translate(50, 860)">
      <text x="0" y="20" font-size="11" font-weight="600" fill="#64748b">ATTENDING PHYSICIAN:</text>
      <text x="0" y="48" font-size="16" font-weight="700" fill="#0f172a">Dr. Sarah Lin, MD</text>
      <text x="0" y="68" font-size="11" fill="#64748b">License #: MD-892401 | Dept: Emergency Medicine</text>

      <!-- Signature -->
      <g transform="translate(300, -10)">
        <text x="0" y="20" font-size="11" font-weight="600" fill="#64748b">PHYSICIAN SIGNATURE:</text>
        <path d="M 0 55 C 30 20, 60 70, 90 35 C 120 10, 150 65, 180 40 L 210 45" stroke="#1e3a8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <text x="40" y="75" font-size="14" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">Dr. S. Lin, MD</text>
        <line x1="0" y1="85" x2="240" y2="85" stroke="#94a3b8" stroke-width="1"/>
      </g>

      <!-- Hospital Stamp -->
      <g transform="translate(560, -25)">
        <rect x="0" y="0" width="180" height="85" rx="6" fill="#f8fafc" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="90" cy="42" r="32" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-opacity="0.3"/>
        <text x="90" y="26" font-size="11" font-weight="800" fill="#dc2626" text-anchor="middle">METRO GENERAL</text>
        <text x="90" y="46" font-size="13" font-weight="900" fill="#dc2626" text-anchor="middle">OFFICIAL CLINICAL RECORD</text>
        <text x="90" y="66" font-size="10" font-weight="700" fill="#dc2626" text-anchor="middle">STATUS: TRIAGED &amp; VERIFIED</text>
      </g>
    </g>

    <!-- Footer Security Notice -->
    <rect x="25" y="1035" width="800" height="40" fill="#f8fafc"/>
    <text x="50" y="1058" font-size="10" fill="#64748b">CONFIDENTIAL MEDICAL INFORMATION - PROTECTED UNDER FEDERAL HEALTHCARE PRIVACY STATUTES. UNAUTHORIZED DISCLOSURE PROHIBITED.</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createPrescriptionSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 950" width="750" height="950" style="background:#fffbeb; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
    <rect x="20" y="20" width="710" height="910" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- Header -->
    <rect x="20" y="20" width="710" height="110" fill="#1e293b"/>
    <text x="50" y="60" font-size="20" font-weight="800" fill="#ffffff">ST. JUDE COMPREHENSIVE MEDICAL CLINIC</text>
    <text x="50" y="85" font-size="13" fill="#cbd5e1">DEPARTMENT OF AMBULATORY &amp; INTERNAL MEDICINE</text>
    <text x="50" y="105" font-size="11" fill="#94a3b8">Tel: (555) 728-1920 | DEA #: BL8912401 | NPI: 1982736410</text>
    <text x="560" y="60" font-size="16" font-weight="800" fill="#38bdf8">Rx SLIP #4912</text>

    <!-- Patient Details -->
    <g transform="translate(50, 150)">
      <text x="0" y="20" font-size="11" font-weight="700" fill="#64748b">PATIENT NAME:</text>
      <text x="120" y="22" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">Marcus Thorne</text>
      
      <text x="400" y="20" font-size="11" font-weight="700" fill="#64748b">AGE / SEX:</text>
      <text x="490" y="22" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">58 / Male</text>

      <text x="0" y="60" font-size="11" font-weight="700" fill="#64748b">DATE ISSUED:</text>
      <text x="120" y="62" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">October 12, 2026</text>

      <text x="400" y="60" font-size="11" font-weight="700" fill="#64748b">ALLERGIES:</text>
      <text x="490" y="62" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#dc2626">Aspirin (Bronchospasm)</text>
      <line x1="0" y1="85" x2="650" y2="85" stroke="#e2e8f0"/>
    </g>

    <!-- Rx Symbol -->
    <g transform="translate(50, 260)">
      <text x="0" y="65" font-size="70" font-family="serif" font-weight="bold" fill="#0d9488">℞</text>

      <!-- Handwritten Prescription Lines -->
      <g transform="translate(65, 20)">
        <text x="0" y="20" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">
          1. Amoxicillin / Clavulanate (Augmentin) 875/125 mg
        </text>
        <text x="25" y="48" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
          Sig: Take 1 tablet PO twice daily with meals x 10 days
        </text>
        <text x="25" y="74" font-size="15" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#64748b">
          Disp: #20 (Twenty) | Refills: 0 (Zero)
        </text>

        <text x="0" y="125" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">
          2. Benzonatate (Tessalon Perles) 200 mg
        </text>
        <text x="25" y="153" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
          Sig: Take 1 capsule TID prn cough. Swallow whole, do not chew.
        </text>
        <text x="25" y="179" font-size="15" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#64748b">
          Disp: #30 (Thirty) | Refills: 1 (One)
        </text>

        <text x="0" y="230" font-size="20" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">
          3. Fluticasone Propionate Nasal Spray 50 mcg/actuation
        </text>
        <text x="25" y="258" font-size="17" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
          Sig: 2 sprays each nostril once daily every morning
        </text>
        <text x="25" y="284" font-size="15" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#64748b">
          Disp: 1 bottle (16g) | Refills: 2 (Two)
        </text>
      </g>
    </g>

    <!-- Diagnosis code & Clinical Indication -->
    <g transform="translate(50, 620)">
      <rect x="0" y="0" width="650" height="48" fill="#f8fafc" stroke="#cbd5e1" rx="4"/>
      <text x="15" y="22" font-size="11" font-weight="700" fill="#64748b">CLINICAL INDICATION / DIAGNOSIS:</text>
      <text x="15" y="40" font-size="15" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#0369a1">
        Acute Bacterial Sinusitis with severe cough (ICD-10: J01.90)
      </text>
    </g>

    <!-- Signature & Doctor block -->
    <g transform="translate(50, 710)">
      <text x="0" y="18" font-size="11" font-weight="600" fill="#64748b">PRESCRIBER SIGNATURE:</text>
      <path d="M 0 50 C 40 10, 80 60, 120 25 C 160 5, 200 65, 240 30" stroke="#1e3a8a" stroke-width="2.5" fill="none"/>
      <line x1="0" y1="65" x2="300" y2="65" stroke="#94a3b8"/>
      <text x="0" y="85" font-size="13" font-weight="700" fill="#0f172a">Dr. Christopher Ross, MD, FACP</text>
      <text x="0" y="102" font-size="11" fill="#64748b">Board Certified Internal Medicine | Lic: CA-G78921</text>

      <g transform="translate(420, -10)">
        <rect x="0" y="0" width="220" height="90" rx="4" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="110" y="28" font-size="11" font-weight="800" fill="#16a34a" text-anchor="middle">ST. JUDE PHARMACY NETWORK</text>
        <text x="110" y="50" font-size="13" font-weight="800" fill="#15803d" text-anchor="middle">ELECTRONIC REFILL AUTHORIZED</text>
        <text x="110" y="72" font-size="10" font-family="monospace" fill="#16a34a" text-anchor="middle">SECURE HASH: #B892F-AES256</text>
      </g>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createLabReportSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#ffffff; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
    <rect x="25" y="25" width="800" height="1050" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    
    <!-- Top banner -->
    <rect x="25" y="25" width="800" height="80" fill="#0284c7"/>
    <text x="60" y="60" font-size="22" font-weight="800" fill="#ffffff">ADVANCED DIAGNOSTICS LABCORP</text>
    <text x="60" y="82" font-size="12" fill="#e0f2fe">COMPREHENSIVE METABOLIC PANEL &amp; COMPLETE BLOOD COUNT</text>
    <text x="640" y="65" font-size="12" font-weight="700" fill="#ffffff">CLIA #: 05D98214</text>

    <!-- Patient bar -->
    <g transform="translate(50, 130)">
      <rect x="0" y="0" width="750" height="70" fill="#f8fafc" stroke="#e2e8f0" rx="4"/>
      <text x="20" y="25" font-size="11" font-weight="700" fill="#64748b">PATIENT:</text>
      <text x="80" y="25" font-size="13" font-weight="800" fill="#0f172a">Vance, Eleanor (F, 42y)</text>
      
      <text x="320" y="25" font-size="11" font-weight="700" fill="#64748b">MRN / ID:</text>
      <text x="385" y="25" font-size="13" font-weight="700" fill="#0284c7">MRN-784920</text>

      <text x="540" y="25" font-size="11" font-weight="700" fill="#64748b">COLLECTION DATE:</text>
      <text x="660" y="25" font-size="12" font-weight="600" fill="#0f172a">Oct 12, 2026 07:15</text>

      <text x="20" y="55" font-size="11" font-weight="700" fill="#64748b">ORDERING MD:</text>
      <text x="120" y="55" font-size="13" font-weight="700" fill="#0f172a">Dr. Sarah Lin, MD</text>

      <text x="320" y="55" font-size="11" font-weight="700" fill="#64748b">STATUS:</text>
      <text x="380" y="55" font-size="12" font-weight="800" fill="#16a34a">FINAL VERIFIED REPORT</text>
    </g>

    <!-- Lab Table -->
    <g transform="translate(50, 230)">
      <rect x="0" y="0" width="750" height="30" fill="#0f172a"/>
      <text x="20" y="20" font-size="11" font-weight="700" fill="#ffffff">TEST COMPONENT</text>
      <text x="280" y="20" font-size="11" font-weight="700" fill="#ffffff">VALUE</text>
      <text x="400" y="20" font-size="11" font-weight="700" fill="#ffffff">FLAG</text>
      <text x="480" y="20" font-size="11" font-weight="700" fill="#ffffff">REFERENCE RANGE</text>
      <text x="660" y="20" font-size="11" font-weight="700" fill="#ffffff">UNITS</text>

      <!-- Row 1: WBC (High) -->
      <rect x="0" y="30" width="750" height="35" fill="#fef2f2"/>
      <text x="20" y="52" font-size="12" font-weight="700" fill="#0f172a">White Blood Count (WBC)</text>
      <text x="280" y="52" font-size="14" font-weight="800" fill="#dc2626">14.8</text>
      <rect x="395" y="38" width="45" height="18" fill="#dc2626" rx="2"/>
      <text x="405" y="51" font-size="10" font-weight="800" fill="#ffffff">HIGH</text>
      <text x="480" y="52" font-size="12" fill="#64748b">4.5 - 11.0</text>
      <text x="660" y="52" font-size="12" fill="#64748b">x10^3/uL</text>

      <!-- Row 2: Neutrophils % -->
      <rect x="0" y="65" width="750" height="35" fill="#fef2f2"/>
      <text x="20" y="87" font-size="12" font-weight="700" fill="#0f172a">Neutrophils %</text>
      <text x="280" y="87" font-size="14" font-weight="800" fill="#dc2626">82.5</text>
      <rect x="395" y="73" width="45" height="18" fill="#dc2626" rx="2"/>
      <text x="405" y="86" font-size="10" font-weight="800" fill="#ffffff">HIGH</text>
      <text x="480" y="87" font-size="12" fill="#64748b">40.0 - 75.0</text>
      <text x="660" y="87" font-size="12" fill="#64748b">%</text>

      <!-- Row 3: Hemoglobin -->
      <rect x="0" y="100" width="750" height="35" fill="#ffffff"/>
      <text x="20" y="122" font-size="12" font-weight="700" fill="#0f172a">Hemoglobin</text>
      <text x="280" y="122" font-size="13" font-weight="600" fill="#0f172a">13.6</text>
      <text x="480" y="122" font-size="12" fill="#64748b">12.0 - 16.0</text>
      <text x="660" y="122" font-size="12" fill="#64748b">g/dL</text>

      <!-- Row 4: Platelets -->
      <rect x="0" y="135" width="750" height="35" fill="#f8fafc"/>
      <text x="20" y="157" font-size="12" font-weight="700" fill="#0f172a">Platelet Count</text>
      <text x="280" y="157" font-size="13" font-weight="600" fill="#0f172a">285</text>
      <text x="480" y="157" font-size="12" fill="#64748b">150 - 450</text>
      <text x="660" y="157" font-size="12" fill="#64748b">x10^3/uL</text>

      <!-- Row 5: CRP -->
      <rect x="0" y="170" width="750" height="35" fill="#fef2f2"/>
      <text x="20" y="192" font-size="12" font-weight="700" fill="#0f172a">C-Reactive Protein (CRP, Inflammatory)</text>
      <text x="280" y="192" font-size="14" font-weight="800" fill="#dc2626">34.2</text>
      <rect x="395" y="178" width="45" height="18" fill="#dc2626" rx="2"/>
      <text x="405" y="191" font-size="10" font-weight="800" fill="#ffffff">HIGH</text>
      <text x="480" y="192" font-size="12" fill="#64748b">&lt; 3.0</text>
      <text x="660" y="192" font-size="12" fill="#64748b">mg/L</text>
    </g>

    <!-- Pathologist Handwritten Clinical Remarks -->
    <g transform="translate(50, 480)">
      <rect x="0" y="0" width="750" height="180" fill="#fffbeb" stroke="#fcd34d" rx="4"/>
      <text x="20" y="28" font-size="12" font-weight="800" fill="#92400e">PATHOLOGIST CLINICAL CORRELATION &amp; HANDWRITTEN NOTES:</text>
      
      <text x="25" y="65" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" fill="#1e3a8a">
        Significant leukocytosis (WBC 14.8k) with neutrophil predominance &amp; elevated CRP (34.2).
      </text>
      <text x="25" y="100" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
        Strongly indicates acute bacterial inflammatory / infectious process. Compatible with acute appendicitis.
      </text>
      <text x="25" y="135" font-size="18" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
        Recommend urgent abdominal ultrasound or contrast-enhanced CT.
      </text>
      <text x="480" y="160" font-size="16" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" fill="#1e3a8a">
        Dr. Harold Gomez, MD (Pathology)
      </text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PRESETS: SampleDocumentPreset[] = [
  {
    id: 'hospital-intake-1',
    name: 'Hospital Intake & Triage Chart',
    category: 'Hospital Intake',
    badge: 'Handwritten & Printed',
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
        {
          id: 'rx-2',
          medicationName: 'Metronidazole (Flagyl)',
          dosage: '500 mg',
          frequency: 'TID (3x daily)',
          route: 'IV infusion',
          duration: '5 days',
          refills: 0,
        },
        {
          id: 'rx-3',
          medicationName: 'Ondansetron (Zofran)',
          dosage: '4 mg',
          frequency: 'PRN severe nausea',
          route: 'IV push',
          duration: 'As needed',
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
        {
          fieldId: 'mrn',
          label: 'Medical Record Number (MRN)',
          value: 'MRN-784920',
          originalValue: 'MRN-784920',
          confidence: 0.99,
          sourceType: 'printed',
          category: 'demographics',
          boundingBox: { x: 76.5, y: 6.2, width: 17.0, height: 3.2 },
          rawSnippet: 'MRN: 784920',
          isVerified: true,
        },
        {
          fieldId: 'dob',
          label: 'Date of Birth',
          value: '1984-06-18',
          originalValue: '06/18/1984',
          confidence: 0.93,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 55.0, y: 15.8, width: 14.5, height: 3.2 },
          rawSnippet: '06/18/1984',
          isVerified: true,
        },
        {
          fieldId: 'age',
          label: 'Age',
          value: '42',
          originalValue: '42',
          confidence: 0.95,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 74.5, y: 15.8, width: 5.5, height: 3.2 },
          rawSnippet: '42',
          isVerified: true,
        },
        {
          fieldId: 'bp',
          label: 'Blood Pressure',
          value: '138/88 mmHg',
          originalValue: '138/88',
          confidence: 0.91,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 6.0, y: 28.5, width: 16.0, height: 5.0 },
          rawSnippet: '138/88 mmHg',
          isVerified: true,
        },
        {
          fieldId: 'pulse',
          label: 'Heart Rate (Pulse)',
          value: '92 bpm',
          originalValue: '92',
          confidence: 0.94,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 23.5, y: 28.5, width: 16.0, height: 5.0 },
          rawSnippet: '92 bpm',
          isVerified: true,
        },
        {
          fieldId: 'temp',
          label: 'Body Temperature',
          value: '101.4 °F',
          originalValue: '101.4',
          confidence: 0.89,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 41.0, y: 28.5, width: 16.0, height: 5.0 },
          rawSnippet: '101.4 °F',
          isVerified: true,
        },
        {
          fieldId: 'spo2',
          label: 'Oxygen Saturation',
          value: '97%',
          originalValue: '97%',
          confidence: 0.97,
          sourceType: 'handwritten',
          category: 'vitals',
          boundingBox: { x: 59.0, y: 28.5, width: 16.0, height: 5.0 },
          rawSnippet: '97% room air',
          isVerified: true,
        },
        {
          fieldId: 'chief_complaint',
          label: 'Chief Complaint & Symptoms',
          value: 'Acute persistent right lower quadrant (RLQ) abdominal pain x 18 hours, nausea, fever',
          originalValue: 'Acute persistent RLQ abd pain x 18h',
          confidence: 0.88,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 6.0, y: 41.5, width: 88.0, height: 5.5 },
          rawSnippet: 'Acute persistent right lower quadrant (RLQ) abdominal pain x 18 hours...',
          isVerified: false,
        },
        {
          fieldId: 'allergies',
          label: 'Critical Drug Allergies',
          value: 'PENICILLIN (Anaphylaxis) | SULFA DRUGS (Urticaria/Rash)',
          originalValue: 'Penicillin (Anaph), Sulfa',
          confidence: 0.92,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 6.0, y: 48.5, width: 88.0, height: 5.2 },
          rawSnippet: 'PENICILLIN (Severe: Anaphylaxis) | SULFA DRUGS (Urticaria/Rash)',
          isVerified: true,
        },
        {
          fieldId: 'diagnosis',
          label: 'Provisional Diagnosis & ICD-10',
          value: 'Suspected Acute Appendicitis without perforation (ICD-10: K35.80)',
          originalValue: 'Rule out Appendicitis (K35.80)',
          confidence: 0.90,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 6.0, y: 56.5, width: 88.0, height: 4.8 },
          rawSnippet: 'Suspected Acute Appendicitis (ICD-10: K35.80)',
          isVerified: true,
        },
        {
          fieldId: 'physician',
          label: 'Attending Physician & License',
          value: 'Dr. Sarah Lin, MD (Lic: MD-892401)',
          originalValue: 'Dr. Sarah Lin, MD',
          confidence: 0.98,
          sourceType: 'printed',
          category: 'physician',
          boundingBox: { x: 6.0, y: 78.0, width: 34.0, height: 6.5 },
          rawSnippet: 'Dr. Sarah Lin, MD | License #: MD-892401',
          isVerified: true,
        },
        {
          fieldId: 'signature',
          label: 'Doctor Signature Verification',
          value: 'Signed & Validated: Dr. S. Lin, MD',
          originalValue: '[Signature Present]',
          confidence: 0.97,
          sourceType: 'handwritten',
          category: 'physician',
          boundingBox: { x: 41.0, y: 76.5, width: 28.0, height: 8.0 },
          rawSnippet: 'Dr. S. Lin, MD [Signature]',
          isVerified: true,
        },
      ],
    },
  },
  {
    id: 'prescription-slip-2',
    name: 'Physician Outpatient Rx Slip',
    category: 'Prescription',
    badge: 'Cursive Handwriting Rx',
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
        {
          id: 'rx-22',
          medicationName: 'Benzonatate (Tessalon Perles)',
          dosage: '200 mg',
          frequency: 'TID PRN cough (swallow whole)',
          route: 'Oral',
          duration: '10 days (Disp: #30)',
          refills: 1,
        },
        {
          id: 'rx-23',
          medicationName: 'Fluticasone Propionate Nasal Spray',
          dosage: '50 mcg/actuation',
          frequency: '2 sprays each nostril daily morning',
          route: 'Nasal',
          duration: '1 bottle',
          refills: 2,
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
        {
          fieldId: 'age_gender',
          label: 'Age / Gender',
          value: '58 / Male',
          originalValue: '58 / Male',
          confidence: 0.93,
          sourceType: 'handwritten',
          category: 'demographics',
          boundingBox: { x: 67.5, y: 17.5, width: 18.0, height: 3.5 },
          rawSnippet: '58 / Male',
          isVerified: true,
        },
        {
          fieldId: 'allergies',
          label: 'Drug Allergies',
          value: 'Aspirin (Bronchospasm)',
          originalValue: 'Aspirin (Bronchospasm)',
          confidence: 0.91,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 67.5, y: 21.5, width: 25.0, height: 3.5 },
          rawSnippet: 'Aspirin (Bronchospasm)',
          isVerified: true,
        },
        {
          fieldId: 'rx_med1',
          label: 'Prescription Item 1',
          value: 'Augmentin 875/125mg PO BID with meals x 10d',
          originalValue: 'Amoxicillin / Clav 875/125 mg',
          confidence: 0.88,
          sourceType: 'handwritten',
          category: 'prescriptions',
          boundingBox: { x: 15.0, y: 31.0, width: 75.0, height: 7.0 },
          rawSnippet: '1. Amoxicillin / Clavulanate (Augmentin) 875/125 mg...',
          isVerified: true,
        },
        {
          fieldId: 'rx_med2',
          label: 'Prescription Item 2',
          value: 'Benzonatate 200mg TID PRN cough x 10d (Disp: #30)',
          originalValue: 'Benzonatate 200mg TID prn cough',
          confidence: 0.85,
          sourceType: 'handwritten',
          category: 'prescriptions',
          boundingBox: { x: 15.0, y: 41.5, width: 75.0, height: 7.0 },
          rawSnippet: '2. Benzonatate (Tessalon Perles) 200 mg...',
          isVerified: true,
        },
        {
          fieldId: 'doctor_name',
          label: 'Prescribing Physician',
          value: 'Dr. Christopher Ross, MD, FACP',
          originalValue: 'Dr. Christopher Ross, MD',
          confidence: 0.97,
          sourceType: 'printed',
          category: 'physician',
          boundingBox: { x: 6.5, y: 81.0, width: 45.0, height: 4.5 },
          rawSnippet: 'Dr. Christopher Ross, MD, FACP',
          isVerified: true,
        },
      ],
    },
  },
  {
    id: 'lab-report-3',
    name: 'Diagnostic Pathology & Lab Panel',
    category: 'Lab Report',
    badge: 'Lab Values & Notes',
    description: 'Pathology metabolic panel with abnormal flags and handwritten pathologist notes.',
    imageUrl: createLabReportSvg(),
    defaultExtraction: {
      documentInfo: {
        title: 'Complete Blood Count & Metabolic Panel',
        facilityName: 'Advanced Diagnostics LabCorp',
        documentType: 'Hematology & Pathology Report',
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
        emergencyContact: 'David Vance - (555) 382-9015',
      },
      encounter: {
        encounterDate: '2026-10-12',
        department: 'Clinical Pathology',
        triageLevel: 'Stat Lab Priority',
        roomBed: 'Inpatient Core Lab',
        admittingPhysician: 'Dr. Harold Gomez, MD (Pathologist)',
      },
      vitals: {
        bloodPressure: '138/88 mmHg',
        heartRate: '92 bpm',
        respiratoryRate: '18 breaths/min',
        temperature: '101.4 °F',
        spo2: '97%',
        painScore: 'N/A (Lab)',
      },
      clinicalNotes: {
        chiefComplaint: 'Pre-op diagnostic workup for acute RLQ abdominal pain.',
        symptomOnset: '18 hours ago',
        allergies: 'Penicillin, Sulfa drugs',
        medicalHistory: 'Acute appendicitis under evaluation',
        provisionalDiagnosis: 'Severe Leukocytosis secondary to acute bacterial infection',
      },
      prescriptions: [],
      attendingPhysician: {
        doctorName: 'Dr. Harold Gomez, MD (Board Certified Pathologist)',
        licenseNumber: 'MD-551982',
        signatureDetected: true,
        hospitalStampPresent: true,
      },
      extractedFields: [
        {
          fieldId: 'wbc_count',
          label: 'White Blood Count (WBC)',
          value: '14.8 x10^3/uL (ABNORMAL HIGH, Ref: 4.5 - 11.0)',
          originalValue: '14.8',
          confidence: 0.99,
          sourceType: 'printed',
          category: 'clinical',
          boundingBox: { x: 6.0, y: 23.5, width: 88.0, height: 3.5 },
          rawSnippet: 'WBC 14.8 HIGH',
          isVerified: true,
        },
        {
          fieldId: 'crp_level',
          label: 'C-Reactive Protein (CRP)',
          value: '34.2 mg/L (ABNORMAL HIGH, Ref: < 3.0)',
          originalValue: '34.2',
          confidence: 0.99,
          sourceType: 'printed',
          category: 'clinical',
          boundingBox: { x: 6.0, y: 36.5, width: 88.0, height: 3.5 },
          rawSnippet: 'CRP 34.2 HIGH',
          isVerified: true,
        },
        {
          fieldId: 'pathologist_note',
          label: 'Handwritten Pathologist Clinical Note',
          value: 'Significant leukocytosis with neutrophil shift & elevated CRP. Strongly indicates acute bacterial inflammatory infection.',
          originalValue: 'Significant leukocytosis (WBC 14.8k) with neutrophil predominance...',
          confidence: 0.92,
          sourceType: 'handwritten',
          category: 'clinical',
          boundingBox: { x: 6.0, y: 44.0, width: 88.0, height: 16.0 },
          rawSnippet: 'Significant leukocytosis with neutrophil predominance...',
          isVerified: true,
        },
      ],
    },
  },
];
