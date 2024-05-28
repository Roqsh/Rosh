import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name motion_b
 * @param {player} player - The player to check
 * @remarks Checks for having a high velocity (pretty much useless... 4urxra ??)
*/

export function motion_b(player) {

    if(config.modules.motionB.enabled) {

        const yVelocity = player.getVelocity().y;

        if(Math.abs(yVelocity) > 30) {
            flag(player, "Motion", "B", "yVelocity", yVelocity);
        }
    }
}