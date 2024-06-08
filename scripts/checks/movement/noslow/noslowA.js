import config from "../../../data/config.js";
import { flag, getSpeed, getScore } from "../../../util";

/**
 * Checks for moving too fast while eating. (using right hand)
 * @name noslow_a
 * @param {player} player - The player to check
 */
export function noslow_a(player) {

    if (config.modules.noslowA.enabled) {

        const speed = getSpeed(player);

        let maxSpeed = config.modules.noslowA.speed;

        if (player.getEffect("speed")) maxSpeed += 0.2;

        if (
            player.hasTag("right") &&
            !player.getEffect("speed") && 
            !player.hasTag("ice") && 
            !player.hasTag("slime") && 
            !player.hasTag("damaged") &&
            !player.hasTag("trident") &&
            !player.isGliding && 
            !player.isInWater && 
            player.isOnGround &&
            getScore(player, "right", 0) >= 15 &&
            speed > maxSpeed
        ) {
            flag(player, "NoSlow", "A", "speed", speed, true);
        }
    }
}