import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, endsWithNumberInParentheses } from "../../../util";

/**
 * Checks if a player's name contains invalid characters.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks 
 * If two players with the same Xbox account are connected via LAN,
 * the second player will be marked with Player(2), which adds 3 additional 
 * characters that we will account for by checking if the name ends with `)`.
 */
export function namespoofB(player) {
   
    if (!config.modules.namespoofB.enabled) return;

    // Define the allowed characters regex pattern
    const allowedCharsRegex = /^[A-Za-z0-9_\-() ]*$/;

    // Remove the potential suffix "(2)" if present for the check
    const playerName = endsWithNumberInParentheses(player.name) ? player.name.slice(0, -3) : player.name;

    // Check if the base name contains only allowed characters
    if (!allowedCharsRegex.test(playerName)) {
        flag(player, "Namespoof", "B", "invalid-characters", player.name);

        // Sanitize the player's nametag to only display valid characters
        player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/g, '').trim();
    }
}