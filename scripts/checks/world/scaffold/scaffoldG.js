import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

const playerBlockPlaceState = new Map();

/**
 * Checks for not triggering the 'itemUse' event.
 * @name scaffold_g
 * @param {import("@minecraft/server").Player} player - The player to check
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
    // TODO: Not only first ever block place, but everytime the the right mouse button is pressed again which requires a new itemUse event
    // Aslong as you keep holding the right mouse button down, you will not trigger the 'itemUse' event, only on the initial click/first block
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

// ! itemUse does not get triggered by mobile devices when placing blocks!