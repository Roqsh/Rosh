import * as Minecraft from "@minecraft/server";

/**
 * This class serves as a simple in-memory data store for player information.
 * It is used to keep track of when players log in and out.
 */
export class Memory {

    static playerData = new Map();

    /**
     * Registers a player and stores their information.
     * @param {Minecraft.Player} player - The player object to register.
     */
    static register(player) {
        const loginTime = new Date();
        const loginMs = Date.now();
        const playerInfo = {
            id: player.id,
            name: player.name,
            loginTime: loginTime,
            loginMs: loginMs
        };

        // Store player information
        this.playerData.set(player.id, playerInfo);
        console.log(`[Rosh] Registered Player: ${player.name}, ID: ${player.id} at: ${loginTime} (ms: ${loginMs})`);
    }

    /**
     * Unregisters a player and removes their stored information.
     * @param {Minecraft.Player} player - The player object to unregister.
     */
    static unregister(player) {
        if (this.playerData.has(player.id)) {
            this.playerData.delete(player.id);
            console.log(`[Rosh] Unregistered Player: ${player.name}, ID: ${player.id} at: ${new Date()} (ms: ${Date.now()})`);
        }
    }

    /**
     * Retrieves the stored information for a player by their ID.
     * @param {string} playerId - The ID of the player to retrieve information for.
     * @returns {Object|null} - The player information object or null if not found.
     */
    static get(playerId) {
        return this.playerData.get(playerId) || null;
    }

    /**
     * Retrieves all registered players' information.
     * @returns {Array<Object>} - An array of all registered player information.
     */
    static getAll() {
        return Array.from(this.playerData.values());
    }

    /**
     * Gets the count of logged-in players.
     * @returns {number} - The number of logged-in players.
     */
    static getCurrentSize() {
        return this.playerData.size;
    }

    /**
     * Checks if no players are registered.
     * @returns {boolean} - True if no players are registered, false otherwise.
     */
    static isEmpty() {
        return this.playerData.size === 0;
    }
}