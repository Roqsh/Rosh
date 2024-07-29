import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for placing blocks at liquid or air.
 * @name scaffold_k
 * @param {player} player - The player to check.
 * @param {block} block - The placed block.
 */
export function scaffold_k(player, block) {

    if (!config.modules.scaffoldK.enabled) return;

    // Special case handling for water lily and frog spawn blocks
    if (block.typeId === "minecraft:waterlily" || block.typeId === "minecraft:frog_spawn") {

        if (!block.below(1).isLiquid && !block.below(1).isWaterlogged) {
            flag(player, "Scaffold", "K", "invalid-placement", `${block.typeId},below: ${blockBelow(block)}`);
        }
        return;
    }

    // Webs break under water, sometimes leading to a mismatch where the web is surrounded by water
    if (block.typeId === "minecraft:web") return;

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

/**
 * Returns a string representation of the block below the given block.
 * @name blockBelow
 * @param {block} block - The reference block.
 * @returns {string} - A string indicating the type of block below (Air, Liquid, Waterlogged, Solid).
 */
function blockBelow(block) {
    
    switch (true) {
        case block.below(1).isAir:
            return "Air";

        case block.below(1).isLiquid:
            return "Liquid";

        case block.below(1).isWaterlogged:
            return "Waterlogged";
        
        default:
            return "Solid";
    }
}