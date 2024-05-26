import config from "../../../data/config.js";
import { flag, getSpeed, getScore } from "../../../util";

/**
 * @name noslow_a
 * @param {player} player - The player to check
 * @remarks Checks for moving too fast while eating (using right hand)
*/

export function noslow_a(player) {

    if(config.modules.noslowA.enabled) {

        const speed = getSpeed(player);

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(!player.getEffect("speed") && speed >= config.modules.noslowA.speed && !player.hasTag("ice") && !player.hasTag("slime") && player.hasTag("right") && player.isOnGround && !player.isGliding && !player.isInWater && !player.hasTag("trident") && getScore(player, "right", 0) >= 5 && !player.hasTag("damaged")) {
            flag(player, "NoSlow", "A", "speed", speed, true);
        }
    }
}