import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * Checks if a player is exceeding the reach distance of a block.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The block being broken.
 * @param {Object} blockEvent - The event object.
 * @param {Object} Minecraft - The Minecraft game object.
 */
export function reachB(player, block, blockEvent, Minecraft) {

    if (!config.modules.reachB.enabled || block.typeId === "minecraft:scaffolding" || player.getGameMode() === "creative") return;

    // Calculate horizontal distance between the player and the block
    const distance = Math.hypot(block.location.x - player.location.x, block.location.z - player.location.z);

    // Flag and cancel block break if distance exceeds the limit
    if (distance > config.modules.reachB.reach) {
        blockEvent.cancel = true;

        // Schedule the flag for the player in Minecraft's system queue
        Minecraft.system.run(() => {
            flag(player, "Reach", "B", "distance", `${distance}`);
        });
    }
}