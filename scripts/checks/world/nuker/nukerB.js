import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getAngle } from "../../../util.js";

/**
 * Checks if a player is breaking a block at an unusual angle.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The block being broken.
 * @param {Object} blockBreakEvent - The event object for block breaking.
 * @param {Object} Minecraft - The Minecraft game object.
 */
export function nukerB(player, block, blockBreakEvent, Minecraft) {

    if (!config.modules.nukerB.enabled) return;

    // Calculate the angle between the player and the block
    const angle = getAngle(player, block);

    // Check if the angle exceeds the allowed threshold
    if (angle <= config.modules.nukerB.angle) return;

    // Calculate horizontal distance between the player and the block
    const distance = Math.hypot(block.location.x - player.location.x, block.location.z - player.location.z);

    // Flag and cancel block break if distance exceeds the limit
    if (distance > 1.5) {
        blockBreakEvent.cancel = true;

        // Schedule the flag for the player in Minecraft's system queue
        Minecraft.system.run(() => {
            flag(player, "Nuker", "B", "angle", `${angle}°`);
        });
    }
}