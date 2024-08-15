import config from "../../../data/config.js";
import { flag, angleCalc } from "../../../util";

/**
 * Checks for not looking at the placed block (with the angle diff)
 * @name scaffold_d
 * @param {import("@minecraft/server").Player} player - The player to check
 * @param {import("@minecraft/server").Block} block - The placed block
 */
export function scaffold_d(player, block) {

    if (config.modules.scaffoldD.enabled) {

        const distance = Math.sqrt(
            Math.pow(block.location.x - player.location.x, 2) + 
            Math.pow(block.location.z - player.location.z, 2)
        );

        if (angleCalc(player, block) > 75 && distance > 2.75 && !player.getGameMode() === "creative") {
            flag(player, "Scaffold", "D", "distance", `${distance},angle=${angleCalc(player, block)}`)
        }
    }
}