import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * Checks if a player is breaking an unbreakable block in survival.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The block being broken.
 * @param {Object} blockBreakEvent - The event object for block breaking.
 * @param {Object} Minecraft - The Minecraft game object.
 */
export function nukerD(player, block, blockBreakEvent, Minecraft) {

    if (!config.modules.nukerD.enabled || player.getGameMode() !== "survival") return;

    // Define a set of blocks that cant be broken in survival
    const invalidBlocks = new Set([
        "minecraft:bedrock",
        "minecraft:end_portal_frame",
        "minecraft:end_gateway",
        "minecraft:end_portal",
        "minecraft:barrier",
        "minecraft:structure_void",
        "minecraft:structure_block",
        "minecraft:command_block",
        "minecraft:repeating_command_block",
        "minecraft:chain_command_block",
        "minecraft:jigsaw",
        "minecraft:light"
    ]);

    // Flag the player if they are breaking an invalid block and cancel the block break
    if (invalidBlocks.has(block.typeId)) {
        blockBreakEvent.cancel = true;

        // Schedule the flag for the player in Minecraft's system queue
        Minecraft.system.run(() => {
            flag(player, "Nuker", "D", "broke", `${block.typeId.replace("minecraft:", "")} in survival`);
        });
    }
}