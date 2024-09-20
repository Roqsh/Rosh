import config from "../../../data/config.js";
import { flag, getAngle, getSpeed } from "../../../util.js";

/**
 * Checks for breaking with a too high angle (behind) or too low angle (precise)
 * @name nuker_b
 * @param {player} player - The player to check
 * @param {block} block - The broken block
 * @param {object} blockBreak - The event object for block breaking
 * @param {object} Minecraft - The Minecraft game object
 * @remarks Really high sensitivities ***may*** false flag
 */
export function nuker_b(player, block, blockBreak, Minecraft) {

	if(config.modules.nukerB.enabled) {

        const angle = getAngle(player, block);
        
        if(angle > config.modules.nukerB.angle) {

            const distance = Math.sqrt(
                Math.pow(block.location.x - player.location.x, 2) + 
                Math.pow(block.location.z - player.location.z, 2)
            );

            if(distance > 1.5) {

                blockBreak.cancel = true;

                Minecraft.system.run(() => {
                    flag(player, "Nuker", "B", "angle", angle);
                });
            }
        }

        if(angle < 3 && getSpeed(player) > 1.25) {

            blockBreak.cancel = true;

            Minecraft.system.run(() => {
                flag(player, "Nuker", "B", "angle", `${angle},speed=${getSpeed(player)}`);
            });
        }
    }
}