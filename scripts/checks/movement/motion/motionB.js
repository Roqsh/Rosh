import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for high velocity changes.
 * @name motion_b
 * @param {player} player - The player to check
 * @remarks Not really effective (set minVlbeforePunishment to 1 for it to do anything)
 */
export function motion_b(player) {

    if (config.modules.motionB.enabled) {

        const velocity = player.getVelocity();

        if (Math.abs(velocity.y) > config.modules.motionB.yVelocity) {
            flag(player, "Motion", "B", "yVelocity", velocity.y);
        }
    }
}