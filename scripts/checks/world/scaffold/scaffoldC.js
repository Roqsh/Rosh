import config from "../../../data/config.js";
import { flag, setScore, getScore } from "../../../util";

/**
 * Checks for not looking at the placed block
 * @name scaffold_c
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 */
export function scaffold_c(player, block) {

    if (config.modules.scaffoldC.enabled) {

        const rotation = player.getRotation();

        const blockUnder = player.dimension.getBlock({
            x: Math.floor(player.location.x), 
            y: Math.floor(player.location.y) - 1, 
            z: Math.floor(player.location.z)
        });

        if (blockUnder.location.x === block.location.x && 
            blockUnder.location.y === block.location.y && 
            blockUnder.location.z === block.location.z
        ) { 
                                
            if (!player.hasTag("right")) {

                if (rotation.x < 44.035) {
                    flag(player, "Scaffold", "C", "xRot", rotation.x);
                    setScore(player, "c", 1);
                }
            }   
        }

        if (getScore(player, "c", 0) !== 1 && player.location.y > block.location.y && rotation.x < 16 && !player.hasTag("riding") && !player.isSwimming) {           
            flag(player, "Scaffold", "C", "xRot", rotation.x);
        } else {
            setScore(player, "c", 0);
        }

        const distance = Math.sqrt(
            Math.pow(block.location.x - player.location.x, 2) + 
            Math.pow(block.location.z - player.location.z, 2)
        );

        if (Math.abs(rotation.x) > 75 && distance > 2.75) {
            flag(player, "Scaffold", "C", "distance", `${distance},xRot=${rotation.x}`);
        }
    }
}