import CryptoJS from 'crypto-js';

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('Missing encryption key in environment variables');
}

/**
 * Encrypts sensitive data
 * @param {string} data - The data to encrypt
 * @returns {string} - The encrypted data
 */
export const encrypt = (data) => {
    if (!data) return data;
    try {
        return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * Decrypts sensitive data
 * @param {string} encryptedData - The data to decrypt
 * @returns {string} - The decrypted data
 */
export const decrypt = (encryptedData) => {
    if (!encryptedData) return encryptedData;
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

/**
 * Encrypts sensitive fields in an object
 * @param {Object} data - The object containing sensitive data
 * @param {Array<string>} sensitiveFields - Array of field names to encrypt
 * @returns {Object} - Object with encrypted sensitive fields
 */
export const encryptSensitiveData = (data, sensitiveFields = ['password']) => {
    if (!data) return data;
    
    const encryptedData = { ...data };
    sensitiveFields.forEach(field => {
        if (encryptedData[field]) {
            encryptedData[field] = encrypt(encryptedData[field]);
        }
    });
    
    return encryptedData;
};

/**
 * Decrypts sensitive fields in an object
 * @param {Object} data - The object containing encrypted data
 * @param {Array<string>} sensitiveFields - Array of field names to decrypt
 * @returns {Object} - Object with decrypted sensitive fields
 */
export const decryptSensitiveData = (data, sensitiveFields = ['password']) => {
    if (!data) return data;
    
    const decryptedData = { ...data };
    sensitiveFields.forEach(field => {
        if (decryptedData[field]) {
            decryptedData[field] = decrypt(decryptedData[field]);
        }
    });
    
    return decryptedData;
}; 