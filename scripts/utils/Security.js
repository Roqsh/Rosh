const CryptoJS = require('crypto-js');

/**
 * A collection of security functions for encrypting and decrypting data using AES encryption.
 */
export class Security {

    /**
     * Encrypts the given data using AES encryption with a derived key and an IV.
     * @param {Object} data - The data to encrypt. Must be a non-null object.
     * @param {string} passphrase - The passphrase used to derive the encryption key. Must be at least 16 characters long.
     * @returns {string} - The encrypted data in Base64 format, including the salt and IV.
     * @throws {Error} - Throws an error if input validation fails or encryption fails.
     */
    static encrypt(data, passphrase) {
        // Validate inputs
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw new Error('Invalid data: Data must be a non-null object');
        }
        if (!passphrase || typeof passphrase !== 'string') {
            throw new Error('Invalid passphrase: Passphrase must be a non-empty string');
        }
        if (passphrase.length < 16) {
            throw new Error('Invalid passphrase: Passphrase must be at least 16 characters long');
        }

        try {
            // Convert data to a JSON string
            const jsonData = JSON.stringify(data);

            // Generate a random salt (16 bytes)
            const salt = CryptoJS.lib.WordArray.random(128 / 8);

            // Derive a key using PBKDF2 with the generated salt
            const key = CryptoJS.PBKDF2(passphrase, salt, { keySize: 256 / 32, iterations: 10000 });

            // Generate a random IV (16 bytes)
            const iv = CryptoJS.lib.WordArray.random(128 / 8);

            // Encrypt the JSON string using AES encryption with CBC mode and PKCS7 padding
            const encrypted = CryptoJS.AES.encrypt(jsonData, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

            // Combine the salt, IV, and encrypted data into a single Base64 encoded string
            const encryptedData = CryptoJS.enc.Base64.stringify(salt) + ':' +
                                  CryptoJS.enc.Base64.stringify(iv) + ':' +
                                  encrypted.toString();

            // Return the combined encrypted data
            return encryptedData;
            
        } catch (error) {
            // Handle any errors that occur during encryption
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypts the given encrypted data using AES decryption.
     * @param {string} encryptedData - The encrypted data in Base64 format, including the salt and IV.
     * @param {string} passphrase - The passphrase used to derive the encryption key. Must be at least 16 characters long.
     * @returns {Object} - The decrypted data as an object.
     * @throws {Error} - Throws an error if input validation fails or decryption fails.
     */
    static decrypt(encryptedData, passphrase) {
        // Validate inputs
        if (!encryptedData || typeof encryptedData !== 'string') {
            throw new Error('Invalid data: Encrypted data must be a non-empty string');
        }
        if (!passphrase || typeof passphrase !== 'string') {
            throw new Error('Invalid passphrase: Passphrase must be a non-empty string');
        }
        if (passphrase.length < 16) {
            throw new Error('Invalid passphrase: Passphrase must be at least 16 characters long');
        }
    
        try {
            // Split the encrypted data into salt, IV, and ciphertext components
            const [saltB64, ivB64, ciphertext] = encryptedData.split(':');

            if (!saltB64 || !ivB64 || !ciphertext) {
                throw new Error('Invalid encrypted data format');
            }

            // Decode the salt and IV from Base64
            const salt = CryptoJS.enc.Base64.parse(saltB64);
            const iv = CryptoJS.enc.Base64.parse(ivB64);

            // Derive the key using PBKDF2 with the extracted salt
            const key = CryptoJS.PBKDF2(passphrase, salt, { keySize: 256 / 32, iterations: 10000 });

            // Decrypt the ciphertext using AES with CBC mode and PKCS7 padding
            const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

            // Convert the decrypted data from Base64 to a UTF-8 string
            const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

            if (!decryptedData) {
                throw new Error('Decryption failed: Invalid passphrase or corrupted data');
            }

            // Parse the decrypted JSON string into an object and return it
            return JSON.parse(decryptedData);

        } catch (error) {
            // Handle any errors that occur during decryption
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
}