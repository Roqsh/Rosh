import config from "../../../data/config.js";
import { flag, hVelocity } from "../../../util";

const lastXZ = new Map();

/**
 * Checks for drastically changing xz velocity whilst in air.
 * @name strafe_a
 * @param {player} player - The player to check
 * @remarks 
 */
export function strafe_a(player) {
    
    if (config.modules.strafeA.enabled) {

        const velocity = player.getVelocity();

        if (
            player.hasTag("damaged") || 
            player.hasTag("elytra") ||
            player.isOnGround ||
            player.isFlying
        ) return;

        let maxChange = config.modules.strafeA.maxChange;

        if (player.getEffect("speed")) value += 0.75;

        if (lastXZ.has(player.name)) {
            
            const x_diff = Math.abs(lastXZ.get(player.name)?.x - velocity.x);
            const z_diff = Math.abs(lastXZ.get(player.name)?.z - velocity.z);

            if (hVelocity(player) > 1 && (x_diff > maxChange || z_diff > maxChange)) {
                flag(player, "Strafe", "A", "xDiff", `${x_diff},zDiff=${z_diff}`);
            }
        }
        
        lastXZ.set(player, {
            x: velocity.x, 
            z: velocity.z
        });
    }
}