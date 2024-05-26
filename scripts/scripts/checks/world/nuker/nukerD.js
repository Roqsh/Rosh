import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * @name nuker_d
 * @param {player} player - The player to check
 * @param {block} block - The broken block
 * @remarks Checks for not looking at the broken block
*/

export function nuker_d(player, block, revertBlock) {

    if(config.modules.nukerD.enabled) {

        const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));
        const rotation = player.getRotation();

        if(rotation.x > 75 && distance > 2.21) {
            flag(player, "Nuker", "D", "distance", `${distance},xRot=${rotation.x}`);
            revertBlock = true;
        }
    }
}  