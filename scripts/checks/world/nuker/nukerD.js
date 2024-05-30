import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * Checks for not looking at the broken block.
 * @name nuker_d
 * @param {player} player - The player to check
 * @param {block} block - The broken block
 * @param {object} blockBreak - The event object for block breaking
 * @param {object} Minecraft - The Minecraft game object
 * @remarks Really high sensitivities ***may*** false flag
 */
export function nuker_d(player, block, blockBreak, Minecraft) {

    if(config.modules.nukerD.enabled) {

        const distance = Math.sqrt(
            Math.pow(block.location.x - player.location.x, 2) + 
            Math.pow(block.location.z - player.location.z, 2)
        );
        const rotation = player.getRotation();

        if(rotation.x > 75 && distance > 2.15) {

            blockBreak.cancel = true;

            Minecraft.system.run(() => {
                flag(player, "Nuker", "D", "distance", `${distance},xRot=${rotation.x}`);
            });
        }
    }
}  