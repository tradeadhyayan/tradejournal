import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET || 'ta_nexus_default_1234567890abcdef';

/**
 * Encrypts a sensitive token using AES-256.
 * Rule: Tokens must never be stored in plain text.
 */
export function encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

/**
 * Decrypts a token using AES-256.
 * Rule: Only decrypt on the client side just before use, or in a secure server-side context.
 */
export function decryptToken(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
