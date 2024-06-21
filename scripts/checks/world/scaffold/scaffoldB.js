import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for placing with an integer x/y rotation
 * @name scaffold_b
 * @param {player} player - The player to check
 * @remarks While riding minecraft sets your rotation to 90, therefore
 * it is getting excluded. After your initial spawn your rotation is 0,
 * therefore it will be ignored too.
 */
export function scaffold_b(player) {
    
    if (config.modules.scaffoldB.enabled) {

        if (!player.hasTag("riding")) {

            const rotation = player.getRotation();

            if (
                (Number.isInteger(rotation.x)) && rotation.x !== 0 || 
                (Number.isInteger(rotation.y)) && rotation.y !== 0
            ) {
                flag(player, "Scaffold", "B", "xRot", `${rotation.x},yRot=${rotation.y}`);
            }   
        }  	
    }
}