import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, endsWithNumberInParentheses } from "../../../util";

/**
 * Checks if a player's name length is invalid.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks 
 * If two players with the same Xbox account are connected via LAN,
 * the second player will be marked with Player(2), which adds 3 additional 
 * characters that we will account for by checking if the name ends with `)`.
 */
export function namespoofA(player) {

    if (!config.modules.namespoofA.enabled) return;

    // Adjust length limits if the name ends with a closing parenthesis (")")
    const playerName = player.name;
    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(playerName) ? 15 : 12;

    if (playerName.length < minNameLength || playerName.length > maxNameLength) {  
        flag(player, "Namespoof", "A", "name-length", playerName.length);
    }
}