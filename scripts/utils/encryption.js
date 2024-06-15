/**
 * Encrypts the given data using AES encryption with a derived key and an IV.
 * @param {Object} data - The data to encrypt.
 * @param {string} passphrase - The passphrase used to derive the encryption key.
 * @returns {string} - The encrypted data in Base64 format, including the IV and salt.
 * @throws {Error} - Throws an error if input validation fails or encryption fails.
 */
export function encrypt(data, passphrase) {
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