import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

/**
 * Enables or disables Auto-baning.
 * @name autoban
 * @param {object} message - Message object
 * @throws {TypeError} If message is not an object
 */
export function autoban(message) {
    // Check if message is an object.
    if (typeof message !== "object" || message === null) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    }

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    if (config.autoban === false) {
        // Set autoban to true in config
        config.autoban = true;

        // Notify the player
        player.sendMessage(`§r${themecolor}Rosh §j> §aAuto-baning is now enabled!`);
    
        // Save the updated config to the world properties
        world.setDynamicProperty("config", JSON.stringify(config));
    } else {
        // Set autoban to false in config
        config.autoban = false;

        // Notify the player
        player.sendMessage(`§r${themecolor}Rosh §j> §cAuto-baning is now disabled!`);

        // Save the updated config to the world properties
        world.setDynamicProperty("config", JSON.stringify(config));
    }
}