import config from "../../../data/config.js";
import { flag, hVelocity } from "../../../util";

/**
 * @name strafe_a
 * @param {player} player - The player to check
 * @remarks Checks for unlegit XZ differences
*/

const lastXZv = new Map();

export function strafe_a(player) {

    const playerVelocity = player.getVelocity();
    
    if(config.modules.strafeA.enabled) {

        if(player.hasTag("damaged") || player.isFlying || player.hasTag("elytra")) return;

        let value = 0.1;

        if(player.getEffect("speed")) value + 0.8;

        if(lastXZv.has(player.name)) {
            
            const x_diff = Math.abs(lastXZv.get(player.name).x - playerVelocity.x);
            const z_diff = Math.abs(lastXZv.get(player.name).z - playerVelocity.z);

            if(hVelocity(player) > 1 && (x_diff > value || z_diff > value)) {
                flag(player, "Strafe", "A", "xDiff", `${x_diff},zDiff=${z_diff}`, true);
            }
        }
        
        lastXZv.set(player, {x: playerVelocity.x, z: playerVelocity.z});
    }
}