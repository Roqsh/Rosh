import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getAngle, debug } from "../../../util";

/**
 * Checks for not looking at the placed block. (angle)
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The placed block.
 * @remarks [WIP] This check will be updated in the near future.
 */
export function scaffold_d(player, block) {

    if (!config.modules.scaffoldD.enabled || player.isFlying || player.isMobile()) return;

    const MAX_ANGLE = config.modules.scaffoldD.angle;
    const DISTANCE_THRESHOLD = config.modules.scaffoldD.distance;

    const distance = Math.sqrt(
        Math.pow(block.location.x - player.location.x, 2) + 
        Math.pow(block.location.z - player.location.z, 2)
    );

    const angle = getAngle(player, block);

    debug(player, "Angle", `${angle}, Distance: ${distance}`, "angleblock");

    if (angle > MAX_ANGLE && distance > DISTANCE_THRESHOLD) {
        flag(player, "Scaffold", "D", "angle", `${angle},distance=${distance}`);
    }
}