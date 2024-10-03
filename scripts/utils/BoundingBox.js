import * as Minecraft from "@minecraft/server";

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
     * Determines if a player (his hitbox) is inside the bounding box.
     * @param {Minecraft.Player} player - The player to check.
     * @returns {boolean} - True if the player is inside the bounding box, false otherwise.
     */
    containsPlayer(player) {
        // Determine the player's bounding box based on their current action
        const playerBoundingBox = this.getPlayerBoundingBox(player);
    
        // Check if the player's bounding box is inside this bounding box
        return this.intersectsWith(playerBoundingBox);
    }

    /**
     * Checks if another bounding box intersects with this bounding box.
     * @param {BoundingBox} other - The other bounding box to check for intersection.
     * @returns {boolean} - True if the bounding boxes intersect, false otherwise.
     */
    intersectsWith(other) {
        return (
            this.max.x >= other.min.x && this.min.x <= other.max.x &&
            this.max.y >= other.min.y && this.min.y <= other.max.y &&
            this.max.z >= other.min.z && this.min.z <= other.max.z
        );
    }

    /**
     * Checks if a ray intersects with this bounding box.
     * @param {{
     * origin: {x: number, y: number, z: number}, 
     * direction: {x: number, y: number, z: number}
     * }} ray - The ray to check, defined by its origin and direction.
     * @returns {boolean} - True if the ray intersects the bounding box, false otherwise.
     */
    intersectsWithRay(ray) {
        const { origin, direction } = ray;
   
        let tMin = -Infinity;
        let tMax = Infinity;
   
        // Define the bounding box coordinates
        const { x: minX, y: minY, z: minZ } = this.min;
        const { x: maxX, y: maxY, z: maxZ } = this.max;
   
        // Check for intersection along each axis
        for (const [axis, minCoord, maxCoord] of [
            ['x', minX, maxX],
            ['y', minY, maxY],
            ['z', minZ, maxZ]
        ]) {
            const dir = direction[axis];
            const orig = origin[axis];
   
            if (dir === 0) {
                // Ray is parallel to the axis, so check if origin is within bounds
                if (orig < minCoord || orig > maxCoord) return false;
            } else {
                // Calculate t values for this slab (entry and exit points)
                const t1 = (minCoord - orig) / dir;
                const t2 = (maxCoord - orig) / dir;
                const tNear = Math.min(t1, t2);
                const tFar = Math.max(t1, t2);
   
                if (tNear > tMax || tFar < tMin) return false;
                tMin = Math.max(tMin, tNear);
                tMax = Math.min(tMax, tFar);
            }
        }
   
        // If tMin is greater than tMax, there's no intersection
        return tMin <= tMax;
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
     * Checks if this bounding box is equal to another bounding box.
     * @param {BoundingBox} other - The other bounding box to compare with.
     * @returns {boolean} - True if the bounding boxes are equal, false otherwise.
     */
    equals(other) {
        return (
            this.min.x === other.min.x &&
            this.min.y === other.min.y &&
            this.min.z === other.min.z &&
            this.max.x === other.max.x &&
            this.max.y === other.max.y &&
            this.max.z === other.max.z
        );
    }

    /**
     * Gets the span of the bounding box (i.e. the difference between its maximum and minimum coordinates).
     * @returns {{x: number, y: number, z: number}} - The span of the bounding box.
     */
    getSpan() {
        return {
            x: this.max.x - this.min.x,
            y: this.max.y - this.min.y,
            z: this.max.z - this.min.z
        };
    }
    
    /**
     * Returns the center of the bounding box.
     * @returns {{x: number, y: number, z: number}} - The center of the bounding box.
     */
    getCenter() {
        return {
            x: (this.min.x + this.max.x) / 2,
            y: (this.min.y + this.max.y) / 2,
            z: (this.min.z + this.max.z) / 2
        };
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
    getCorners() {
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

    /**
     * Calculates the volume of the bounding box.
     * @returns {number} - The volume of the bounding box.
     */
    getVolume() {
        const span = this.getSpan();
        return span.x * span.y * span.z;
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
    
        return box1.intersectsWith(box2);
    }

    /**
     * Returns the player's current bounding box based on their state.
     * @param {Minecraft.Player} player - The player whose bounding box to get.
     * @returns {BoundingBox} - The player's current bounding box.
     */
    static getPlayerBoundingBox(player) {
        let height = 1.8; // Default height for standing
        let width = 0.6;  // Default width for the bounding box
        let depth = 0.6;  // Depth is the same as width for simplicity
    
        // Adjust the height based on the player's state
        if (player.isSneaking) {
            height = 1.65;
        } else if (player.isSwimming || player.isGliding /**|| player.isCrawling*/) {
            height = 0.6;
        } else if (player.isSleeping) {
            height = 0.2;
        }

        return new BoundingBox(
            { x: player.location.x - width / 2, y: player.location.y, z: player.location.z - depth / 2 },
            { x: player.location.x + width / 2, y: player.location.y + height, z: player.location.z + depth / 2 }
        );
    }
}