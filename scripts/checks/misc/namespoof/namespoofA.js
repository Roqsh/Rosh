import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a player's nametag length is invalid.
 * @name namespoof_a
 * @param {Object} player - The player to check.
 * @remarks If two players with the same Xbox account are connected via LAN,
 * the second player will be marked with Player(2), which adds 3 additional 
 * characters that we will account for by checking if the name ends with `)`.
 */
export function namespoof_a(player) {

    if (!config.modules.namespoofA.enabled) return;

    // Adjust length limits if the name ends with a closing parenthesis (')')
    if (player.name.endsWith(')')) {

        if (
            player.name.length < 3 || 
            player.name.length > 15
        ) {
            flag(player, "Namespoof", "A", "name-length", `${player.name.length}`);
        }

    } else {

        if (
            player.name.length < 3 || 
            player.name.length > 12
        ) {
            flag(player, "Namespoof", "A", "name-length", `${player.name.length}`);
        }
    }
}