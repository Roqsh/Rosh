import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

// Map to track the state of each player's block placement
const playerBlockPlaceState = new Map();

/**
 * Checks for not triggering the 'itemUse' event. [Beta]
 * @name scaffold_g
 * @param {player} player - The player to check
 * @remarks When placing a single block (not while keep holding the press button/or jumpbridging) you will trigger the 'itemUse' event.
 * Some cheat clients forget to trigger this event on their first block place, which we can detect.
 */
export function scaffold_g(player) {

    // Check if this is the first block place for the player
    if (!playerBlockPlaceState.has(player.name)) {
        playerBlockPlaceState.set(player.name, true);

        if (!player.hasTag("itemUse")) {
            debug(player, "itemUse", `§cfalse`, "item");

            if (config.modules.scaffoldG.enabled) {
                flag(player, "Scaffold", "G", "itemUse", `false`);
                playerBlockPlaceState.delete(player.name);
            }

        } else {
            debug(player, "itemUse", `§atrue`, "item");
        }
    }
}