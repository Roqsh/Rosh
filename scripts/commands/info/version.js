import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

/**
 * Displays the current Rosh version.
 * @name version
 * @param {object} message - Message object
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @throws {TypeError} If message is not an object
 */
export function version(message) { 
    // Check if message is an object.
    if (typeof message !== "object" || message === null) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    }

    const player = message.sender; 
    const themecolor = config.themecolor;

    // Send the player the version message
    player.sendMessage(`§r${themecolor}Rosh §j> §aRosh is currently at §8v1.24§a!`);
}