import config from "../../../data/config.js";
import { flag } from "../../../util";
import { Block } from "../../../utils/Block.js";

/**
 * Checks for placing blocks at liquid or air.
 * @param {import("@minecraft/server").Player} player - The player to check.
 * @param {import("@minecraft/server").Block} block - The placed block.
 */
export function scaffold_k(player, block) {

    if (!config.modules.scaffoldK.enabled) return;

    // Special case handling for water lily and frog spawn blocks
    if (block.typeId === "minecraft:waterlily" || block.typeId === "minecraft:frog_spawn") {

        if (!block.below(1).isLiquid && !block.below(1).isWaterlogged) {
            flag(player, "Scaffold", "K", "invalid-placement", `${block.typeId},below: ${Block.getType(block.below(1))}`);
        }
        return;
    }

    // Webs break under water, sometimes leading to a mismatch where the web is surrounded by water
    if (block.typeId === "minecraft:web") return;

    // Due to gravity, when spammed sand-like blocks sometimes end up being surrounded by air/water
    if (
        block.typeId === "minecraft:sand" || 
        block.typeId === "minecraft:suspicious_sand" || 
        block.typeId === "minecraft:red_sand" || 
        block.typeId === "minecraft:gravel" ||
        block.typeId === "minecraft:suspicious_gravel" ||
        /.*concrete_powder$/.test(block.typeId)
    ) {
        return;
    }

    // Define adjacent blocks with their relative directions
    const adjacentBlocks = [
        { direction: "above", block: block.above(1) },
        { direction: "below", block: block.below(1) },
        { direction: "north", block: block.north(1) },
        { direction: "east", block: block.east(1) },
        { direction: "south", block: block.south(1) },
        { direction: "west", block: block.west(1) }
    ];

    const invalidBlocks = adjacentBlocks.filter(adjacent => adjacent.block.isAir || adjacent.block.isLiquid);

    // Check if all adjacent blocks are either air or liquid
    if (invalidBlocks.length === adjacentBlocks.length) {

        const details = invalidBlocks.map(adjacent => `${adjacent.direction}: ${adjacent.block.isAir ? "Air" : "Liquid"}`).join(", ");
        flag(player, "Scaffold", "K", "invalid-placement", `${block.typeId},${details}`);
    }
}