import config from "../../../data/config.js";
import { flag } from "../../../util";
import { Statistics } from "../../../utils/Statistics.js";

/**
 * Checks for placing with an integer x/y rotation.
 * @param {import("@minecraft/server").Player} player - The player to check.
 * @remarks After your initial spawn, your rotation is 0, which is therefore excluded.
 */
export function scaffold_b(player) {
    
    if (!config.modules.scaffoldB.enabled) return;

    // While riding, your rotation will occasionally change to an integer value
    if (player.isRiding()) return;

    const rotation = player.getRotation();
    
    // Define excluded rotations
    const excludedPitch = [0, 90, -90];

    // Check the rotations only if they are not excluded
    if (!excludedPitch.includes(rotation.x)) {

        if (
            Statistics.isNearlyInteger(rotation.x) || 
            Statistics.isNearlyInteger(rotation.y)
        ) {
            flag(player, "Scaffold", "B", "xRot", `${rotation.x}, yRot=${rotation.y}`);
        }
    }  	
}