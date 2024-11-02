import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * Checks if a player is breaking a covered block.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The block being broken.
 * @param {Object} blockBreakEvent - The event object for block breaking.
 * @param {Object} Minecraft - The Minecraft game object.
 */
export function nukerC(player, block, blockBreakEvent, Minecraft) {

    if (!config.modules.nukerC.enabled) return;

    // Define directions to check surrounding blocks (6 faces of a cube)
    const directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 }
    ];

    let solidBlockCount = 0;

    // Check each surrounding position to see if it is a solid block
    for (const direction of directions) {

        const adjacentPos = {
            x: block.location.x + direction.x,
            y: block.location.y + direction.y,
            z: block.location.z + direction.z
        };

        const adjacentBlock = player.dimension.getBlock(adjacentPos);

        // Increase solid block count if adjacent block is solid and not air
        if (adjacentBlock && adjacentBlock.isSolid && adjacentBlock.typeId !== "minecraft:air") {
            solidBlockCount++;
        }

        // Special handling if adjacent block is a bed, ensuring `solidBlockCount` is properly updated
        if (adjacentBlock && adjacentBlock.typeId === "minecraft:bed") {
            let solidCoverage = true;

            for (const bedDir of directions) {

                const bedPos = {
                    x: adjacentPos.x + bedDir.x,
                    y: adjacentPos.y + bedDir.y,
                    z: adjacentPos.z + bedDir.z
                };
                const bedAdjacentBlock = player.dimension.getBlock(bedPos);

                // If any of the adjacent blocks are air, the bed is not fully covered
                if (!bedAdjacentBlock || bedAdjacentBlock.typeId === "minecraft:air") {
                    solidCoverage = false;
                    break;
                }
            }

            // If the second bed part is fully surrounded, treat the whole bed as fully covered
            if (solidCoverage) {
                solidBlockCount++;
            }
        }
    }

    // Flag the player if block is fully surrounded by solid blocks
    if (solidBlockCount === 6) {
        blockBreakEvent.cancel = true;

        // Schedule the flag for the player in Minecraft's system queue
        Minecraft.system.run(() => {
            flag(player, "Nuker", "C", `${block.typeId.replace("minecraft:", "")}`, "covered");
        });
    }
}