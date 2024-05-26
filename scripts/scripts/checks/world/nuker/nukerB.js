import config from "../../../data/config.js";
import { flag, angleCalc, getSpeed } from "../../../util.js";

/**
 * @name nuker_b
 * @param {player} player - The player to check
 * @param {block} block - The broken block
 * @remarks Checks for breaking with a too high angle (behind) or too low angle (precise)
*/

export function nuker_b(player, block, revertBlock) {

	if(config.modules.nukerB.enabled) {
        
        if(angleCalc(player, block) > config.modules.nukerB.angle) {

            const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));

            if(distance > 1.5) {
                flag(player, "Nuker", "B", "angle", angleCalc(player, block));
                revertBlock = true;
            }
        }

        if(angleCalc(player, block) < 2 && getSpeed(player) > 1.75) {
            flag(player, "Nuker", "B", "angle", `${angleCalc(player, block)},speed=${getSpeed(player)}`);
            revertBlock = true;
        }
    }
}