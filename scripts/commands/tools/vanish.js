import config from "../../data/config.js";
import { tellStaff } from "../../util.js";

const oldGamemode = new Map();

/**
 * Toggle vanish state for a player.
 * @param {object} message - The message object containing the sender's information.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function vanish(message) {
    // Validate message
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`Invalid message: expected an object with a "sender" property, but got ${typeof message}.`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;

    if (player.hasTag("vanish")) {
        removeVanish(player, themecolor);
    } else {
        addVanish(player, themecolor);
    }
}

/**
 * Handle the player becoming visible again.
 * @param {object} player - The player object.
 * @param {string} themecolor - The theme color for messages.
 */
export function removeVanish(player, themecolor) {
    // Remove the invisible mark from the player
    player.removeTag("vanish");

    // Restore the old gamemode
    const oldMode = oldGamemode.get(player.name);
    player.setGameMode(oldMode || player.getGameMode());
    oldGamemode.delete(player.name);

    // Notify the player and staff
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §cis no longer vanished.`);
    player.sendMessage(`§r${themecolor}Rosh §j> §cYou are now no longer vanished.`);
}

/**
 * Handle the player becoming invisible.
 * @param {object} player - The player object.
 * @param {string} themecolor - The theme color for messages.
 */
export function addVanish(player, themecolor) {
    // Store the original gamemode of the player
    oldGamemode.set(player.name, player.getGameMode());

    // Mark the player as invisible and set to spectator mode
    player.addTag("vanish");
    player.setGameMode("spectator");

    // Notify the player and staff members
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ais now vanished.`);
    player.sendMessage(`§r${themecolor}Rosh §j> §aYou are now vanished.`);
}