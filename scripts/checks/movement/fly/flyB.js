import config from "../../../data/config.js";
import { flag, aroundAir, hVelocity } from "../../../util";

const fly_b_map = new Map();

/**
 * @name fly_b
 * @param {player} player - The player to check
 * @remarks Checks not going in the predicted direction (same y lvl)
 */
export function fly_b(player) {

    if(config.modules.flyB.enabled && aroundAir(player)) {

        if (
            player.hasTag("gmc") || 
            player.hasTag("elytra") || 
            player.hasTag("spec") ||
            player.hasTag("placing")
        ) return;

        const velocityY = player.getVelocity().y;

        if(fly_b_map.has(player)) {
            const count = fly_b_map.get(player);
            
            if(count >= config.modules.flyB.amount && velocityY == 0 && !player.isOnGround && hVelocity(player) !== 0) {
                flag(player, "Fly", "B", "Velocity", velocityY, false);
            }

            if(velocityY == 0) {
                fly_b_map.set(player, count + 1);
            } else {
                fly_b_map.set(player, 0);
            }
        } else {
            fly_b_map.set(player, velocityY == 0 ? 1 : 0);
        }
    }
}
