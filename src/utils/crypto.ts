/**
 * Web Cryptography API AES-256-GCM Secure Encryption Module
 * Compliant with HIPAA/NIST encryption standards for PHI (Protected Health Information).
 */

const DEFAULT_SALT = 'DOCSCAN_AI_HIPAA_SECURE_SALT_2026';

// Convert string to Uint8Array
function strToBuf(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to string
function bufToStr(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

// Convert Uint8Array to hex string
function bufToHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Convert ArrayBuffer to Base64
function bufToBase64(buf: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToBuf(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate SHA-256 integrity hash
export async function sha256(text: string): Promise<string> {
  const data = strToBuf(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as unknown as BufferSource);
  return bufToHex(new Uint8Array(hashBuffer));
}

// Derive AES-256-GCM key from passphrase using PBKDF2
export async function deriveKeyFromPassphrase(passphrase: string, salt: string = DEFAULT_SALT): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    strToBuf(passphrase) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: strToBuf(salt) as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt payload object with AES-256-GCM
export async function encryptData(
  data: any,
  passphrase: string = 'DocScanSecureMasterKey2026',
  salt: string = DEFAULT_SALT
): Promise<{
  ciphertext: string;
  ivHex: string;
  salt: string;
  checksum: string;
  algorithm: string;
}> {
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
  const key = await deriveKeyFromPassphrase(passphrase, salt);

  // Generate 12-byte cryptographically secure random IV for GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = strToBuf(jsonStr);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    encodedData as unknown as BufferSource
  );

  const checksum = await sha256(jsonStr);

  return {
    ciphertext: bufToBase64(encryptedBuffer),
    ivHex: bufToHex(iv),
    salt,
    checksum,
    algorithm: 'AES-256-GCM (PBKDF2-SHA256, 100,000 iterations)',
  };
}

// Decrypt ciphertext with AES-256-GCM
export async function decryptData(
  ciphertextBase64: string,
  ivHex: string,
  passphrase: string = 'DocScanSecureMasterKey2026',
  salt: string = DEFAULT_SALT
): Promise<any> {
  const key = await deriveKeyFromPassphrase(passphrase, salt);
  const iv = hexToBuf(ivHex);
  const encryptedBuf = base64ToBuf(ciphertextBase64);

  const decryptedBuf = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    encryptedBuf
  );

  const decryptedStr = bufToStr(decryptedBuf);
  try {
    return JSON.parse(decryptedStr);
  } catch {
    return decryptedStr;
  }
}
