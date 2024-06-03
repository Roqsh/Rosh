import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

/**
 * @name scaffold_e
 * @param {player} player - The player to check
 * @remarks Checks for going too fast while placing
 */
export function scaffold_e(player) {
    
    if (config.modules.scaffoldE.enabled) {

        const speed = getSpeed(player);

        if (!player.isFlying) {

            if (player.getEffect("speed") && speed > 0.8) {
                flag(player, "Scaffold", "E", "speed", speed);
            }

            if (!player.getEffect("speed") && speed > 0.7) {
                flag(player, "Scaffold", "E", "speed", speed);
            }
        }
    }
}