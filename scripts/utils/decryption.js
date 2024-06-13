/**
 * Decrypts the given encrypted data using AES decryption.
 * @param {string} encryptedData - The encrypted data in Base64 format, including the salt and IV.
 * @param {string} passphrase - The passphrase used to derive the encryption key.
 * @returns {Object} - The decrypted data as an object.
 * @throws {Error} - Throws an error if input validation fails or decryption fails.
 */
export function decrypt(encryptedData, passphrase) {
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

        // Derive the key using PBKDF2
        const key = CryptoJS.PBKDF2(passphrase, salt, { keySize: 256/32 });

        // Decrypt the ciphertext using AES
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });

        // Convert the decrypted data from Base64
        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

        // Parse the JSON string to an object
        return JSON.parse(decryptedData);
    } catch (error) {
        // Handle any errors that occur during decryption
        throw new Error(`Decryption failed: ${error.message}`);
    }
}