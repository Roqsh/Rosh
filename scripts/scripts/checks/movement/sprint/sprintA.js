import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name sprint_a
 * @param {player} player - The player to check
 * @remarks Checks for sprinting while having the blindness effect
*/

export function sprint_a(player) {
       
    if(config.modules.invalidsprintA.enabled) {

        if(player.getEffect("blindness") && player.isSprinting) {
            flag(player, "InvalidSprint", "A", "blindness", ">sprinting", true);
        }
    }     
}