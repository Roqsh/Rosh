import * as Minecraft from "@minecraft/server";
import { getEyeHeight } from "../util";

/**
 * The BoundingBox class represents a three-dimensional rectangular area in space, 
 * defined by minimum and maximum coordinates.
 */
export class BoundingBox {

    /**
     * Constructs a bounding box with minimum and maximum coordinates.
     * @param {{x: number, y: number, z: number}} min - The minimum coordinates of the bounding box.
     * @param {{x: number, y: number, z: number}} max - The maximum coordinates of the bounding box.
     */
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    /**
     * Checks if a point is inside the bounding box.
     * @param {{x: number, y: number, z: number}} point - The point to check.
     * @returns {boolean} - True if the point is inside the bounding box, false otherwise.
     */
    containsPoint(point) {
        return (
            point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y &&
            point.z >= this.min.z && point.z <= this.max.z
        );
    }

    /**
     * Checks if another bounding box intersects with this bounding box.
     * @param {BoundingBox} other - The other bounding box to check for intersection.
     * @returns {boolean} - True if the bounding boxes intersect, false otherwise.
     */
    intersects(other) {
        return (
            this.max.x >= other.min.x && this.min.x <= other.max.x &&
            this.max.y >= other.min.y && this.min.y <= other.max.y &&
            this.max.z >= other.min.z && this.min.z <= other.max.z
        );
    }

    /**
     * Expands the bounding box by a specified amount.
     * @param {number} amount - The amount to expand the bounding box.
     * @returns {BoundingBox} - The expanded bounding box.
     */
    expand(amount) {
        return new BoundingBox(
            { x: this.min.x - amount, y: this.min.y - amount, z: this.min.z - amount },
            { x: this.max.x + amount, y: this.max.y + amount, z: this.max.z + amount }
        );
    }

    /**
     * Shrinks the bounding box by a specified amount.
     * @param {number} amount - The amount to shrink the bounding box.
     * @returns {BoundingBox} - The shrunk bounding box.
     */
    shrink(amount) {
        return new BoundingBox(
            { x: this.min.x + amount, y: this.min.y + amount, z: this.min.z + amount },
            { x: this.max.x - amount, y: this.max.y - amount, z: this.max.z - amount }
        );
    }

    /**
     * Determines if a player (his hitbox) is inside the bounding box.
     * @param {Minecraft.Player} player - The player to check.
     * @returns {boolean} - True if the player is inside the bounding box, false otherwise.
     */
    containsPlayer(player) {
        // Determine the player's bounding box based on their current action
        const playerBoundingBox = this.getPlayerBoundingBox(player);
    
        // Check if the player's bounding box is inside this bounding box
        return this.intersects(playerBoundingBox);
    }

    /**
     * Determines if two players are inside the same bounding box.
     * @param {Minecraft.Player} player1 - The first player.
     * @param {Minecraft.Player} player2 - The second player.
     * @returns {boolean} - True if both players are inside the bounding box, false otherwise.
     */
    static arePlayersColliding(player1, player2) {
        const box1 = BoundingBox.getPlayerBoundingBox(player1);
        const box2 = BoundingBox.getPlayerBoundingBox(player2);
    
        return box1.intersects(box2);
    }

    /**
     * Checks if a ray intersects with this bounding box.
     * @param {{
     * origin: {x: number, y: number, z: number}, 
     * direction: {x: number, y: number, z: number}
     * }} ray - The ray to check, defined by its origin and direction.
     * @returns {boolean} - True if the ray intersects the bounding box, false otherwise.
     */
    collidesWithRay(ray) {
        const { origin, direction } = ray;

        // Define the slab method to test intersections
        const tMin = -Infinity;
        const tMax = Infinity;

        // Define the bounding box coordinates
        const { x: minX, y: minY, z: minZ } = this.min;
        const { x: maxX, y: maxY, z: maxZ } = this.max;

        // Check for intersection along each axis
        for (const [i, minCoord, maxCoord] of [
            [direction.x, minX, maxX],
            [direction.y, minY, maxY],
            [direction.z, minZ, maxZ]
        ]) {
            if (i === 0) {
                // Ray is parallel to the slab, ignore this axis
                if (origin[i] < minCoord || origin[i] > maxCoord) return false;
            } else {
                // Calculate t values for this slab
                const t1 = (minCoord - origin[i]) / direction[i];
                const t2 = (maxCoord - origin[i]) / direction[i];
                const tNear = Math.min(t1, t2);
                const tFar = Math.max(t1, t2);

                if (tNear > tMax || tFar < tMin) return false;
                if (tNear > tMin) tMin = tNear;
                if (tFar < tMax) tMax = tFar;
            }
        }

        return tMin <= tMax;
    }

    /**
     * Returns the player's current bounding box based on their state.
     * @param {Minecraft.Player} player - The player whose bounding box to get.
     * @returns {BoundingBox} - The player's current bounding box.
     */
    getPlayerBoundingBox(player) {
        const eyeHeight = getEyeHeight(player);

        let height = 1.8; // Default height for standing
        let width = 0.6;  // Default width for the bounding box
        let depth = 0.6;  // Depth is the same as width for simplicity
        let yOffset = 0;
    
        if (player.isSneaking) {
            height = 1.65;
        } else if (player.isSwimming || player.isCrawling) {
            height = 0.6;
            yOffset = 0.4 - eyeHeight; // Adjust for swimming/crawling
        } else if (player.isGliding) {
            height = 0.6;
            yOffset = 0.4 - eyeHeight; // Adjust for gliding
        } else if (player.isRiding()) {
            height = 0.75; // Approximate height when riding
            yOffset = 0.75 - eyeHeight; // Adjust based on riding position
        } else if (player.isSleeping) {
            height = 0.2;
            width = 0.6; // Width remains the same when sleeping
            yOffset = 0.1 - eyeHeight; // Adjust for lying down
        }
    
        return new BoundingBox(
            { x: player.location.x - width / 2, y: player.location.y + yOffset, z: player.location.z - depth / 2 },
            { x: player.location.x + width / 2, y: player.location.y + height + yOffset, z: player.location.z + depth / 2 }
        );
    }

    /**
     * Returns the positions of all 8 corners of the bounding box.
     * @returns {{
     *   topLeftFront: { x: number, y: number, z: number },
     *   topRightFront: { x: number, y: number, z: number },
     *   bottomLeftFront: { x: number, y: number, z: number },
     *   bottomRightFront: { x: number, y: number, z: number },
     *   topLeftBack: { x: number, y: number, z: number },
     *   topRightBack: { x: number, y: number, z: number },
     *   bottomLeftBack: { x: number, y: number, z: number },
     *   bottomRightBack: { x: number, y: number, z: number }
     * }} - An object with properties for each corner position.
     */
    getCornerPositions() {
        const { x: minX, y: minY, z: minZ } = this.min;
        const { x: maxX, y: maxY, z: maxZ } = this.max;
 
        return {
            topLeftFront: { x: minX, y: maxY, z: minZ },
            topRightFront: { x: maxX, y: maxY, z: minZ },
            bottomLeftFront: { x: minX, y: minY, z: minZ },
            bottomRightFront: { x: maxX, y: minY, z: minZ },
            topLeftBack: { x: minX, y: maxY, z: maxZ },
            topRightBack: { x: maxX, y: maxY, z: maxZ },
            bottomLeftBack: { x: minX, y: minY, z: maxZ },
            bottomRightBack: { x: maxX, y: minY, z: maxZ }
        };
    }
}