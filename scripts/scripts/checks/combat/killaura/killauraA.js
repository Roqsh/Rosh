import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name killaura_a
 * @param {player} player - The player to check
 * @remarks Checks for attacking with an integer x/y rotation
*/

export function killaura_a(player) {
	
    if(config.modules.killauraA.enabled) {

        if(!player.hasTag("riding")) {

            const rotation = player.getRotation();

            if((Number.isInteger(rotation.x)) && rotation.x !== 0 || (Number.isInteger(rotation.y)) && rotation.y !== 0) {
                flag(player, "Killaura", "A", "xRot", `${rotation.x},yRot=${rotation.y}`);
            }   
        } 
    }	
}