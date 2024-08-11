import config from "../../../data/config.js";
import { flag, getScore, setScore, debug } from "../../../util";

/**
 * Checks for placing too many blocks scaffold-ish per 20 ticks
 * @name scaffold_f
 * @param {import("@minecraft/server").Player} player - The player to check
 * @param {import("@minecraft/server").Block} block - The placed block
 */
export function scaffold_f(player, block) {

    if (config.modules.scaffoldF.enabled) {

        if (player.isFlying) return;

        const distance = Math.sqrt(
            Math.pow(block.location.x - player.location.x, 2) + 
            Math.pow(block.location.y - player.location.y, 2) + 
            Math.pow(block.location.z - player.location.z, 2)
        );

        if (distance < 1.85) {
            const valueOfBlocks = getScore(player, "scaffoldAmount", 0);
            setScore(player, "scaffoldAmount", valueOfBlocks + 1);
        }
    }
}


export function dependencies_f(player, tickValue, velocity) {

    if (config.modules.scaffoldF.enabled) {

        const valueOfBlocks = getScore(player, "scaffoldAmount", 0);

        if (tickValue > 20 - 2.67e-11 && velocity.y < 0.3) {

            let maxBlocks = 7;

            if (player.getEffect("speed")) maxBlocks += 2;

            if (valueOfBlocks > maxBlocks) {
                flag(player, "Scaffold", "F", "amount", valueOfBlocks);
            } 

            setScore(player, "scaffoldAmount", 0);
            setScore(player, "tickValue", 0);

        } else {
            if (valueOfBlocks > 0) {
                debug(player, "Blocks", `${valueOfBlocks} per ${tickValue} tick's`, "block");
            }
        }
    }
}