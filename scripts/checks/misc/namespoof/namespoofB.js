import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a player's nametag contains invalid characters.
 * @name namespoof_b
 * @param {Object} player - The player to check.
 * @remarks If two players with the same Xbox account are connected via LAN,
 * the second player will be marked with Player(2), which we will account for
 * by checking if the name ends with `)`.
 */
export function namespoof_b(player) {
   
    if (!config.modules.namespoofB.enabled) return;

    // Define the allowed characters regex pattern
    const allowedCharsRegex = /^[A-Za-z0-9_\-() ]*$/;

    // Remove the potential suffix "(2)" if present for the check
    const baseName = player.name.endsWith(')') ? player.name.slice(0, -3) : player.name;

    // Check if the base name contains only allowed characters
    if (!allowedCharsRegex.test(baseName)) {
        flag(player, "Namespoof", "B", "invalid-characters", player.name);
        player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/g, '').trim();
    }
}