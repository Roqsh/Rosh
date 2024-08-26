

/**
 * A collection of security functions for encrypting and decrypting.
 */
export class Security {

    /**
     * Encrypts the given data using AES encryption with a derived key and an IV.
     * @param {Object} data - The data to encrypt.
     * @param {string} passphrase - The passphrase used to derive the encryption key.
     * @returns {string} - The encrypted data in Base64 format, including the IV and salt.
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

            // Derive a key using PBKDF2 with salt and iterations
            const salt = CryptoJS.lib.WordArray.random(128/8);
            const key = CryptoJS.PBKDF2(passphrase, salt, { keySize: 256/32, iterations: 1000 });

            // Generate an IV
            const iv = CryptoJS.lib.WordArray.random(128/8);

            // Encrypt the JSON string using AES encryption
            const encrypted = CryptoJS.AES.encrypt(jsonData, key, { iv: iv });

            // Combine salt, iv, and encrypted data
            const encryptedData = CryptoJS.enc.Base64.stringify(salt) + ':' +
                                  CryptoJS.enc.Base64.stringify(iv) + ':' +
                                  encrypted.toString();

            return encryptedData;
        } catch (error) {
            // Handle any errors that occur during encryption
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypts the given encrypted data using AES decryption.
     * @param {string} encryptedData - The encrypted data in Base64 format, including the salt and IV.
     * @param {string} passphrase - The passphrase used to derive the encryption key.
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
            // Extract the salt, IV, and ciphertext from the encrypted data
            const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
            const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
            const ciphertext = encryptedData.substr(64);

            // Derive the key using PBKDF2 with 1000 iterations
            const key = CryptoJS.PBKDF2(passphrase, salt, {
                keySize: 256 / 32,
                iterations: 1000
            });

            // Decrypt the ciphertext using AES
            const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // Convert the decrypted data from Base64
            const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

            // Parse the JSON string to an object
            return JSON.parse(decryptedData);
        } catch (error) {
            // Handle any errors that occur during decryption
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
}