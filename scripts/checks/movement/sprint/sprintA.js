import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for sprinting while having the blindness effect.
 * @name sprint_a
 * @param {Object} player - The player to check.
 */
export function sprint_a(player) {
       
    if (!config.modules.invalidsprintA.enabled) return;

    if (player.getEffect("blindness") && player.isSprinting) {
        flag(player, "InvalidSprint", "A", "blindness", ">sprinting", true);
    }   
}