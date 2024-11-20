import * as Minecraft from "@minecraft/server";

/**
 * Block utility class for handling various block-related operations.
 */
export class Block {

    /**
     * Gets the friction of the given block.
     * @param {Minecraft.Block} block - The block to get the friction of.
     * @returns {number} - The friction of the given block.
     * @remarks The friction values are based on the vanilla Minecraft physics.
     */
    static getFriction(block) {
        switch(block.typeId) {
            case "minecraft:air":
                return 0;
            case "minecraft:water":
                return 0.8;
            case "minecraft:lava":
                return 0.5;
            case "minecraft:ice" || "minecraft:packed_ice":
                return 0.098;
            case "minecraft:blue_ice":
                return 0.089;
            case "minecraft:soul_sand":
                return 0.4;
            case "minecraft:slime_block":
                return 0.8;
            case "minecraft:honey_block":
                return 0.4;
            case "minecraft:cobweb":
                return 0.9;
            default:
                return 0.6;
        }
    }

    /**
     * Returns a string representing the state of the given block.
     * @param {Minecraft.Block} block - The reference block.
     * @returns {string} - A string indicating the type of the block (Air, Liquid, Waterlogged, Solid, Invalid or Unknown).
     */
    static getType(block) {
        switch (true) {
            case block.isAir:
                return "Air";
            case block.isLiquid:
                return "Liquid";
            case block.isWaterlogged:
                return "Waterlogged";
            case block.isSolid:
                return "Solid";
            case !block.isValid():
                return "Invalid";
            default:
                return "Unknown";
        }
    }

    /**
     * TODO: Recode with proper raytracing
     * Gets the face of the block being interacted with.
     * @param {Minecraft.Block} block - The block being interacted with.
     * @param {Minecraft.Player} player - The player interacting with the block.
     * @returns {string} - The face of the block (Nort, South, East, West, Top, Bottom, Invalid or Unknown).
     * @remarks **Note:**
     * - This does **not** return the face of the block at which a block was placed.
     * - It does only work in scenarios where the player is interacting with the block.
     * - This does not work if a players view directions is wrong/spoofed (through cheating).
     */
    static getFace(block, player) {
        if (!block.isValid()) return "Invalid";

        const playerDirection = player.getViewDirection();
        const blockCenter = Block.center(block);
        
        if (player.location.y > blockCenter.y) return "Top";
        if (player.location.y < blockCenter.y) return "Bottom";
        
        if (playerDirection.z > 0) return "North";
        if (playerDirection.z < 0) return "South";
        if (playerDirection.x > 0) return "East";
        if (playerDirection.x < 0) return "West";
        
        return "Unknown";
    }


    /**
     * Finds every possible coordinate between two sets of Vector3.
     * @param {object} pos1 - First set of coordinates {x: number, y: number, z: number}.
     * @param {object} pos2 - Second set of coordinates {x: number, y: number, z: number}.
     * @returns {Array<object>} - Each possible coordinate within the given ranges [{x: number, y: number, z: number}].
     * @remarks If the input is not a number, it will return an empty array.
     */
    static getBlocksBetween({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
        // Validate inputs
        if (
            [x1, y1, z1, x2, y2, z2].some(val => typeof val !== 'number')
        ) {
            return [];
        }

        // Ensure min and max coordinates are correctly assigned
        const [minX, maxX] = [Math.min(x1, x2), Math.max(x1, x2)];
        const [minY, maxY] = [Math.min(y1, y2), Math.max(y1, y2)];
        const [minZ, maxZ] = [Math.min(z1, z2), Math.max(z1, z2)];

        const coordinates = [];

        // Efficient iteration over coordinates
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    coordinates.push({ x, y, z });
                }
            }
        }

        return coordinates;
    }

    /**
     * Calculates the center coordinates of the given block.
     * @param {Minecraft.Block} block - The block whose center coordinates to calculate.
     * @returns {object} - The center coordinates of the block {x: number, y: number, z: number}.
     */
    static center(block) {
        return {
            x: block.location.x + 0.5,
            y: block.location.y + 0.5,
            z: block.location.z + 0.5
        };
    }

    /**
     * Calculates the center coordinates of the top face of the given block.
     * @param {Minecraft.Block} block - The block whose top face center coordinates to calculate.
     * @returns {object} - The center coordinates of the top face of the block {x: number, y: number, z: number}.
     */
    static topCenter(block) {
        return {
            x: block.location.x + 0.5,
            y: block.location.y + 1.0,
            z: block.location.z + 0.5
        };
    }

    /**
     * Calculates the center coordinates of the bottom face of the given block.
     * @param {Minecraft.Block} block - The block whose bottom face center coordinates to calculate.
     * @returns {object} - The center coordinates of the bottom face of the block {x: number, y: number, z: number}.
     */
    static bottomCenter(block) {
        return {
            x: block.location.x + 0.5,
            y: block.location.y,
            z: block.location.z + 0.5
        };
    }

    /**
     * Calculates the center coordinates of the north face of the given block.
     * @param {Minecraft.Block} block - The block whose north face center coordinates to calculate.
     * @returns {object} - The center coordinates of the north face of the block {x: number, y: number, z: number}.
     */
    static northCenter(block) {
        return {
            x: block.location.x + 0.5,
            y: block.location.y + 0.5,
            z: block.location.z
        };
    }

    /**
     * Calculates the center coordinates of the east face of the given block.
     * @param {Minecraft.Block} block - The block whose east face center coordinates to calculate.
     * @returns {object} - The center coordinates of the east face of the block {x: number, y: number, z: number}.
     */
    static eastCenter(block) {
        return {
            x: block.location.x + 1.0,
            y: block.location.y + 0.5,
            z: block.location.z + 0.5
        };
    }

    /**
     * Calculates the center coordinates of the south face of the given block.
     * @param {Minecraft.Block} block - The block whose south face center coordinates to calculate.
     * @returns {object} - The center coordinates of the south face of the block {x: number, y: number, z: number}.
     */
    static southCenter(block) {
        return {
            x: block.location.x + 0.5,
            y: block.location.y + 0.5,
            z: block.location.z + 1.0
        };
    }

    /**
     * Calculates the center coordinates of the west face of the given block.
     * @param {Minecraft.Block} block - The block whose west face center coordinates to calculate.
     * @returns {object} - The center coordinates of the west face of the block {x: number, y: number, z: number}.
     */
    static westCenter(block) {
        return {
            x: block.location.x,
            y: block.location.y + 0.5,
            z: block.location.z + 0.5
        };
    }

    /**
     * Checks if the given block is in the air.
     * @param {Minecraft.Block} block - The block to check.
     * @returns {boolean} - True if the block is in the air, false otherwise.
     */
    static isInAir(block) {
        if (
            block.above(1).isAir &&
            block.below(1).isAir &&
            block.north(1).isAir &&
            block.east(1).isAir &&
            block.south(1).isAir &&
            block.west(1).isAir
        ) {
            return true;
        } else {
            return false;
        }
    }

    
    /**
     * Checks if the given block is in a liquid (water or lava).
     * @param {Minecraft.Block} block - The block to check.
     * @returns {boolean} - True if the block is in a liquid, false otherwise.
     */
    static isInLiquid(block) {
        if (
            block.above(1).isLiquid &&
            block.below(1).isLiquid &&
            block.north(1).isLiquid &&
            block.east(1).isLiquid &&
            block.south(1).isLiquid &&
            block.west(1).isLiquid
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if the block is considered on the ground (with a solid block below).
     * @param {Minecraft.Block} block - The block to check.
     * @returns {boolean} - True if the block is on the ground, false otherwise.
     */
    static isOnGround(block) {
        const belowBlock = block.dimension.getBlock({ 
            x: block.location.x, 
            y: block.location.y - 1, 
            z: block.location.z 
        });
        
        return belowBlock && belowBlock.isSolid;
    }

    /**
     * Checks if the given blocks are arranged diagonally.
     * @param {Array<Minecraft.Block>} blocks - Array of blocks to check.
     * @returns {boolean} - True if blocks are arranged diagonally, false otherwise.
     * @remarks The function only works if there are at least 3 blocks in the array and all blocks have the same y coordinate.
     */
    static isDiagonal(blocks) {
        if (!Array.isArray(blocks) || blocks.length < 3) {
            return false;
        }

        const firstBlock = blocks[0];

        // Ensure all blocks have the same Y coordinate
        const yLevel = firstBlock.location.y;
        if (!blocks.every(block => block.location.y === yLevel)) {
            return false;
        }

        // Check diagonal relationship between blocks using x and z differences
        for (let i = 1; i < blocks.length - 1; i++) {
            const prevBlock = blocks[i - 1];
            const currBlock = blocks[i];
            const nextBlock = blocks[i + 1];

            const dx1 = currBlock.location.x - prevBlock.location.x;
            const dz1 = currBlock.location.z - prevBlock.location.z;
            const dx2 = nextBlock.location.x - currBlock.location.x;
            const dz2 = nextBlock.location.z - currBlock.location.z;

            // For diagonal blocks, the difference between x and z should have the same magnitude
            if (Math.abs(dx1) !== Math.abs(dz1) || Math.abs(dx2) !== Math.abs(dz2)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if two blocks are adjacent (connected on any face).
     * @param {Minecraft.Block} block1 - The first block.
     * @param {Minecraft.Block} block2 - The second block.
     * @returns {boolean} - True if the blocks are adjacent, false otherwise.
     */
    static areAdjacent(block1, block2) {
        const dx = Math.abs(block1.location.x - block2.location.x);
        const dy = Math.abs(block1.location.y - block2.location.y);
        const dz = Math.abs(block1.location.z - block2.location.z);
        
        return (dx === 1 && dy === 0 && dz === 0) || 
               (dx === 0 && dy === 1 && dz === 0) || 
               (dx === 0 && dy === 0 && dz === 1);
    }
}