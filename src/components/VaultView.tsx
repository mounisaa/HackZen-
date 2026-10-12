import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Database,
  Search,
  Eye,
  Trash2,
  Download,
  CheckCircle2,
  FileText,
  Clock,
  Fingerprint,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { EncryptedRecordMeta, AuditLogEntry } from '../types/document';
import { decryptData } from '../utils/crypto';

interface VaultViewProps {
  records: EncryptedRecordMeta[];
  auditLogs: AuditLogEntry[];
  onDeleteRecord: (id: string) => void;
  onRefreshVault: () => void;
  isLoading: boolean;
}

export const VaultView: React.FC<VaultViewProps> = ({
  records,
  auditLogs,
  onDeleteRecord,
  onRefreshVault,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'audit'>('records');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vaultPassphrase, setVaultPassphrase] = useState<string>('DocScanSecureMasterKey2026');
  const [selectedRecord, setSelectedRecord] = useState<EncryptedRecordMeta | null>(null);
  const [decryptedData, setDecryptedData] = useState<any | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter records
  const filteredRecords = records.filter(
    (r) =>
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Decrypt record on-the-fly
  const handleInspectRecord = async (record: EncryptedRecordMeta) => {
    setSelectedRecord(record);
    setDecryptError(null);
    setDecryptedData(null);
    setIsDecrypting(true);

    try {
      const result = await decryptData(
        record.encryptedData,
        record.iv,
        vaultPassphrase,
        record.keySalt
      );
      setDecryptedData(result);
    } catch (err: any) {
      console.error('Decryption failed:', err);
      setDecryptError(
        'Decryption key mismatch: The provided Vault Passphrase could not authenticate or decrypt this AES-256-GCM ciphertext payload.'
      );
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Methodology Step 7 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              METHODOLOGY STAGE 7
            </span>
            <h1 className="text-xl font-extrabold text-white">
              Encrypted Medical Database &amp; HIPAA Audit Vault
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            All verified patient records are encrypted via client-side AES-256-GCM with PBKDF2 key derivation and unique initialization vectors (IV). Records remain cryptographically sealed until decrypted by an authorized clinical passphrase.
          </p>
        </div>

        {/* Master Passphrase Bar */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <Key className="w-4 h-4 text-teal-400" />
          <div>
            <label className="text-[10px] text-slate-400 block font-mono">PRACTITIONER KEY</label>
            <input
              type="password"
              value={vaultPassphrase}
              onChange={(e) => setVaultPassphrase(e.target.value)}
              className="bg-transparent border-none text-xs text-teal-300 font-mono outline-none w-44"
              title="Vault Key used for AES-256-GCM derivation"
            />
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
            256-Bit
          </span>
        </div>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('records')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Encrypted Records ({records.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Immutable Audit Trail ({auditLogs.length})</span>
            </button>
          </div>

          <button
            onClick={onRefreshVault}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition cursor-pointer"
            title="Refresh Vault Records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          </button>
        </div>

        {activeTab === 'records' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search MRN or Document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-teal-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none transition"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Encrypted Records Grid / Table */}
      {activeTab === 'records' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No Encrypted Records Stored Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Go to the &ldquo;Verify &amp; Digital Form&rdquo; step to inspect an extracted medical document and click &ldquo;Save to Encrypted Vault&rdquo;.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Record Identifier</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">MRN / ID</th>
                    <th className="py-3 px-4">Security Algorithm</th>
                    <th className="py-3 px-4">Status &amp; Verification</th>
                    <th className="py-3 px-4">Integrity Hash</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-teal-300">{r.id}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{r.documentType}</div>
                        <div className="text-[10px] text-slate-400">{r.patientNameEncrypted}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200">{r.recordNumber}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Lock className="w-2.5 h-2.5 mr-1" />
                          <span>AES-256-GCM</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-teal-400" />
                          <span>{r.status}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Verified by: {r.verifiedBy?.slice(0, 16)}...
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                          <span>{r.checksum.slice(0, 10)}...</span>
                          <button
                            onClick={() => copyToClipboard(r.checksum, r.id)}
                            className="p-1 hover:text-white transition cursor-pointer"
                            title="Copy SHA-256 checksum"
                          >
                            {copiedId === r.id ? (
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleInspectRecord(r)}
                            className="p-1.5 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-300 rounded-lg transition cursor-pointer"
                            title="Decrypt & Inspect Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(r.id)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg transition cursor-pointer"
                            title="Purge Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tamper-Evident Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Fingerprint className="w-4 h-4 text-teal-400" />
              <span>Compliance &amp; Access Audit Trail</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              HIPAA Security Rule 164.312(b) Audit Controls
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Audit logs are automatically recorded when documents are captured, enhanced, verified, and encrypted.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start space-x-3 text-xs"
                >
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                    <div className="flex items-center space-x-3 mt-1 text-[10px] font-mono text-slate-400">
                      <span>Operator: {log.operator}</span>
                      <span>SHA-256: {log.hash.slice(0, 12)}...</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Decrypt & Record Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Decrypted Clinical Record View
                  </h3>
                  <span className="text-[11px] font-mono text-teal-400">
                    {selectedRecord.id} | {selectedRecord.recordNumber}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {isDecrypting ? (
                <div className="p-8 text-center text-teal-400 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Deriving AES-256 Key &amp; Decrypting GCM Payload...</span>
                </div>
              ) : decryptError ? (
                <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl text-rose-300 space-y-2">
                  <div className="flex items-center space-x-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Cryptographic Decryption Error</span>
                  </div>
                  <p className="text-[11px]">{decryptError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Demographics Card */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      Patient Demographics
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Full Name:</span>
                        <span className="font-bold text-white">
                          {decryptedData?.patientDemographics?.fullName || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">MRN:</span>
                        <span className="font-mono text-teal-300">
                          {decryptedData?.patientDemographics?.mrn || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">DOB / Age:</span>
                        <span className="text-white">
                          {decryptedData?.patientDemographics?.dob} (
                          {decryptedData?.patientDemographics?.age}y)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Gender:</span>
                        <span className="text-white">
                          {decryptedData?.patientDemographics?.gender || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Card */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      Clinical Vitals
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Blood Pressure:</span>
                        <span className="font-bold text-white">
                          {decryptedData?.vitals?.bloodPressure || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Heart Rate:</span>
                        <span className="font-bold text-white">
                          {decryptedData?.vitals?.heartRate || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Temperature:</span>
                        <span className="font-bold text-white">
                          {decryptedData?.vitals?.temperature || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">SpO2:</span>
                        <span className="font-bold text-white">
                          {decryptedData?.vitals?.spo2 || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis & Allergies */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      Clinical Assessment
                    </span>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Provisional Diagnosis:</span>
                      <p className="font-medium text-white">
                        {decryptedData?.clinicalNotes?.provisionalDiagnosis || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Drug Allergies:</span>
                      <p className="font-medium text-rose-300">
                        {decryptedData?.clinicalNotes?.allergies || 'NKDA'}
                      </p>
                    </div>
                  </div>

                  {/* Ciphertext Raw Inspection */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                    <span className="text-slate-400 font-bold block">CIPHERTEXT DETAILS:</span>
                    <div className="truncate">Ciphertext (Base64): {selectedRecord.encryptedData.slice(0, 60)}...</div>
                    <div>IV (Hex): {selectedRecord.iv}</div>
                    <div>Salt: {selectedRecord.keySalt}</div>
                    <div>Algorithm: {selectedRecord.encryptionMethod}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
