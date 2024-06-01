import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

const playerBlockPlaceState = new Map();

/**
 * Checks for not triggering the 'itemUse' event. [Beta]
 * @name scaffold_g
 * @param {player} player - The player to check
 * @remarks When placing a single block (not while keep holding the press button/or jumpbridging) you will trigger the 'itemUse' event.
 * Some cheat clients forget to trigger this event on their first block place, which we can detect.
 */
export function scaffold_g(player) {

    if (!player.hasTag("itemUse")) {
        debug(player, "itemUse", `§cfalse`, "item");
    } else {
        debug(player, "itemUse", `§atrue`, "item");
    }

    // Check if this is the first block place for the player (it doesnt only occur on the first block place, but with bds limitations i cant implement it further atm)
    if (!playerBlockPlaceState.has(player.name)) {
        playerBlockPlaceState.set(player.name, true);

        if (!player.hasTag("itemUse")) {

            if (config.modules.scaffoldG.enabled) {
                flag(player, "Scaffold", "G", "itemUse", `false`);
                playerBlockPlaceState.delete(player.name);
            }

        } 
    }
}