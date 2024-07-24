
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for returning to the original yaw/pitch rotation before the placement happened.
 * @name scaffold_i
 * @param {player} player - The player to check.
 * @param {block} block - The placed block.
 */
export function scaffold_i(player, block) {

    if (!config.modules.scaffoldI.enabled) return;

    // If the rotation during the placement is the same as before, return (avoid false positives).

}