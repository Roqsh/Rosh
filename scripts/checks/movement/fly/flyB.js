import config from "../../../data/config.js";
import { flag, getScore, aroundAir, hVelocity } from "../../../util";

/**
 * @name fly_b
 * @param {player} player - The player to check
 * @remarks Checks not going in the predicted direction (same y lvl)
*/

const fly_b_map = new Map();

export function fly_b(player) {

    if(config.modules.flyB.enabled && aroundAir(player)) {

        if (
            player.hasTag("gmc") || 
            player.hasTag("elytra") || 
            player.hasTag("spec")
        ) return;

        const velocityY = player.getVelocity().y;

        if(fly_b_map.has(player)) {

            if(fly_b_map.get(player) == 0 && velocityY == 0 && getScore(player, "tick_counter2", 0) > 2 && !player.isOnGround && hVelocity(player) !== 0) {
                flag(player, "Fly", "B", "Velocity", velocityY, false);
            }
        }
        
        fly_b_map.set(player, velocityY);
    }
}