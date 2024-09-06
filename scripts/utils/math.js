import * as Minecraft from "@minecraft/server";
import { getEyeHeight } from "../util";

/**
 * A class that provides various helper functions to perform operations on vectors in 3D space.
 */
export class Vector3D {

    /**
     * Calculates the angle between two vectors in 3D space.
     * @param {{x: number, y: number, z: number}} vectorA - The first vector.
     * @param {{x: number, y: number, z: number}} vectorB - The second vector.
     * @returns {number} - The angle between the two vectors in degrees.
     */
    static getVectorAngle(vectorA, vectorB) {

        const dot = this.getVectorDotProduct(vectorA, vectorB);
        const mag1 = this.getVectorLength(vectorA);
        const mag2 = this.getVectorLength(vectorB);

        return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
    }

    /**
     * Calculates the dot product of two vectors in 3D space.
     * @param {{x: number, y: number, z: number}} vectorA - The first vector.
     * @param {{x: number, y: number, z: number}} vectorB - The second vector.
     * @returns {number} - The dot product of the two vectors.
     */
    static getVectorDotProduct(vectorA, vectorB) {
        return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
    }

    /**
     * Calculates the cross product of two vectors in 3D space.
     * @param {{x: number, y: number, z: number}} vectorA - The first vector.
     * @param {{x: number, y: number, z: number}} vectorB - The second vector.
     * @returns {{x: number, y: number, z: number}} - The cross product vector.
     */
    static getVectorCrossProduct(vectorA, vectorB) {
        return {
            x: vectorA.y * vectorB.z - vectorA.z * vectorB.y,
            y: vectorA.z * vectorB.x - vectorA.x * vectorB.z,
            z: vectorA.x * vectorB.y - vectorA.y * vectorB.x
        };
    }

    /**
     * Calculates the length (magnitude) of a vector in 3D space.
     * @param {{x: number, y: number, z: number}} vector - The vector object with x, y, and z components.
     * @returns {number} - The length (magnitude) of the vector.
     */
    static getVectorLength(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    }

    /**
     * Computes the vector from the origin position to the given target position in 3D space.
     * @param {{x: number, y: number, z: number}} originPosition - The position from where to start.
     * @param {{x: number, y: number, z: number}} targetPosition - The target position at which the vector will be facing towards.
     * @returns {{x: number, y: number, z: number}} - The vector between the two given positions.
     */
    static getVectorBetweenPositions(originPosition, targetPosition) {
        return {
            x: targetPosition.x - originPosition.x,
            y: targetPosition.y - originPosition.y,
            z: targetPosition.z - originPosition.z
        };
    }

    /**
     * Calculates the distance between two vectors (or points) in 3D space.
     * @param {{x: number, y: number, z: number}} vectorA - The first vector (or point).
     * @param {{x: number, y: number, z: number}} vectorB - The second vector (or point).
     * @returns {number} - The distance between the two vectors.
     */
    static getDistanceBetweenVectors(vectorA, vectorB) {

        const diffX = vectorB.x - vectorA.x;
        const diffY = vectorB.y - vectorA.y;
        const diffZ = vectorB.z - vectorA.z;

        return Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
    }

    /**
     * Calculates the direction vector from yaw and pitch of a player.
     * @param {number} yaw - The yaw angle in degrees.
     * @param {number} pitch - The pitch angle in degrees.
     * @returns {{x: number, y: number, z: number}} - The direction vector.
     */
    static getPlayerDirectionVector(yaw, pitch) {

        const yawRadians = yaw * (Math.PI / 180);
        const pitchRadians = pitch * (Math.PI / 180);

        return {
            x: -Math.sin(yawRadians) * Math.cos(pitchRadians),
            y: -Math.sin(pitchRadians),
            z: Math.cos(yawRadians) * Math.cos(pitchRadians)
        };
    }

    /**
     * Scales a vector by a scalar in 3D space.
     * @param {{x: number, y: number, z: number}} vector - The vector to scale.
     * @param {number} scalar - The scalar value to multiply the vector by.
     * @returns {{x: number, y: number, z: number}} - The resulting scaled vector.
     */
    static getScaledVector(vector, scalar) {
        return {
            x: vector.x * scalar,
            y: vector.y * scalar,
            z: vector.z * scalar
        };
    }

    /**
     * Normalizes a vector in 3D space.
     * @param {{x: number, y: number, z: number}} vector - The vector object with x, y, and z components.
     * @returns {{x: number, y: number, z: number}} - The normalized vector.
     */
    static getNormalizedVector(vector) {

        const length = this.getVectorLength(vector);

        if (length === 0) {
            throw new Error("Cannot normalize a vector with a length of zero.");
        }

        return {
            x: vector.x / length,
            y: vector.y / length,
            z: vector.z / length
        };
    }

    /**
     * Reverses a vector in 3D space.
     * @param {{x: number, y: number, z: number}} vector - The vector to reverse.
     * @returns {{x: number, y: number, z: number}} - The reversed vector.
     */
    static getReversedVector(vector) {
        return {
            x: -vector.x,
            y: -vector.y,
            z: -vector.z
        };
    }

    /**
     * Calculates the eye position of the player.
     * @param {Minecraft.Player} player - The player object.
     * @returns {{x: number, y: number, z: number}} - The eye position.
     */
    static getEyePosition(player) {

        const eyeHeight = getEyeHeight(player);

        return {
            x: player.location.x,
            y: player.location.y + eyeHeight,
            z: player.location.z
        };
    }
}

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
        } else if (player.isRiding) {
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

/**
 * A collection of statistical functions for analyzing datasets.
 */
export class Statistics {

    /**
     * Calculates the mean (average) of an array of numbers.
     * @param {number[]} values - The array of numbers.
     * @returns {number} The mean of the array.
     */
    static getMean(values) {
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    /**
     * Calculates the median of a dataset.
     * @param {number[]} data - The dataset to calculate the median from.
     * @returns {number} The median value.
     */
    static getMedian(data) {

        const sortedData = [...data].sort((a, b) => a - b);
        const midIndex = Math.floor(sortedData.length / 2);

        return sortedData.length % 2 === 0
            ? (sortedData[midIndex - 1] + sortedData[midIndex]) / 2
            : sortedData[midIndex];
    }

    /**
     * Calculates the standard deviation of a dataset, which is the square root of the variance.
     * @param {number[]} data - The dataset to calculate the standard deviation for.
     * @returns {number} The standard deviation value.
     */
    static getDeviation(data) {
        const variance = this.getVariance(data);
        return Math.sqrt(variance);
    }

    /**
     * Identifies outliers in a dataset using the Interquartile Range (IQR) method.
     * @param {number[]} data - The dataset to analyze.
     * @returns {{lowOutliers: number[], highOutliers: number[]}} An object containing the low and high outliers.
     */
    static getOutliers(data) {

        data.sort((a, b) => a - b);  // Sort the dataset

        const midIndex = Math.floor(data.length / 2);
        const firstQuartile = this.getMedian(data.slice(0, midIndex));
        const thirdQuartile = this.getMedian(data.slice(Math.ceil(data.length / 2)));

        const interquartileRange = thirdQuartile - firstQuartile;
        const lowerBound = firstQuartile - 1.5 * interquartileRange;
        const upperBound = thirdQuartile + 1.5 * interquartileRange;

        const lowOutliers = data.filter(value => value < lowerBound);
        const highOutliers = data.filter(value => value > upperBound);

        return { lowOutliers, highOutliers };
    }

    /**
     * Calculates the Z-score of each data point in a dataset to detect outliers with a Z-score greater than 2.
     * @param {number[]} data - The dataset to analyze.
     * @returns {{zScores: number[], outliers: number[]}} An object containing the z-scores and identified outliers.
     */
    static getZScoreOutliers(data) {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const stdDev = this.getDeviation(data);
        
        const zScores = data.map(value => (value - mean) / stdDev);
        const outliers = data.filter((_, i) => Math.abs(zScores[i]) > 2); // Z-score > 2 as a threshold
        
        return { zScores, outliers };
    }

    /**
     * Calculates the skewness of a dataset, a measure of the asymmetry of the distribution.
     * @param {number[]} data - The dataset to calculate skewness for.
     * @returns {number} The skewness value.
     */
    static getSkewness(data) {

        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const median = this.getMedian(data);
        const variance = this.getVariance(data);

        if (variance === 0) return 0;

        return (3 * (mean - median)) / Math.sqrt(variance);
    }

    /**
     * Calculates the variance of a dataset, a measure of the dispersion of the data from the mean.
     * @param {number[]} data - The dataset to calculate variance for.
     * @returns {number} The variance value.
     */
    static getVariance(data) {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    }

    /**
     * Calculates the kurtosis of a dataset, a measure of the "tailedness" of the distribution.
     * @param {number[]} data - The dataset to calculate kurtosis for.
     * @returns {number} The kurtosis value.
     */
    static getKurtosis(data) {

        const sampleSize = data.length;
        if (sampleSize < 3) return 0;

        const mean = data.reduce((sum, val) => sum + val, 0) / sampleSize;
        const variance = this.getVariance(data);
        if (variance === 0) return 0;

        const fourthMoment = data.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / sampleSize;
        const kurtosis = fourthMoment / Math.pow(variance, 2);

        return kurtosis - 3; // Excess kurtosis (relative to normal distribution)
    }

    /**
     * Calculates the Pearson correlation coefficient between two datasets.
     * @param {number[]} x - The first dataset.
     * @param {number[]} y - The second dataset.
     * @returns {number} The Pearson correlation coefficient, or NaN if it cannot be computed.
     */
    static getCorrelation(x, y) {
        // Check for equal length and non-empty arrays
        if (x.length !== y.length || x.length === 0) {
            return NaN;
        }

        const n = x.length;
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXSquare = x.reduce((sum, val) => sum + val * val, 0);
        const sumYSquare = y.reduce((sum, val) => sum + val * val, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    /**
     * Calculates the Greatest Common Divisor (GCD) of two integers.
     * This function returns the absolute value of the GCD to ensure the result is non-negative.
     * @param {number} a - The first integer.
     * @param {number} b - The second integer.
     * @returns {number} - The absolute value of the GCD of the two integers.
     */
    static getAbsoluteGcd(a, b) {

        function gcd(x, y) {
            while (y !== 0) {
                let temp = y;
                y = x % y;
                x = temp;
            }
            return x;
        }

        return gcd(Math.abs(a), Math.abs(b));
    }

    /**
     * Simplifies a fraction represented by two integers.
     * @param {number} numerator - The numerator of the fraction.
     * @param {number} denominator - The denominator of the fraction.
     * @returns {{numerator: number, denominator: number}} - The simplified fraction.
     */
    static getSimplifiedFraction(numerator, denominator) {

        const gcd = this.getAbsoluteGcd(numerator, denominator);

        return {
            numerator: numerator / gcd,
            denominator: denominator / gcd
        };
    }

    /**
     * Compares two arrays to see if they are similar within a specified tolerance.
     * @param {number[]} arrayA - The first array to compare.
     * @param {number[]} arrayB - The second array to compare.
     * @param {number} tolerance - The allowable difference between corresponding elements in the arrays.
     * @returns {boolean} - True if the arrays are similar, false otherwise.
     */
    static areArraysSimilar(arrayA, arrayB, tolerance = 0.7) {

        if (arrayA.length !== arrayB.length) return false;

        for (let i = 0; i < arrayA.length; i++) {
            if (Math.abs(arrayA[i] - arrayB[i]) > tolerance) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if there are more than a specified number of consecutive duplicate values in an array
     * @param {number[]} arr - The array of numbers to check.
     * @param {number} threshold - The maximum number of consecutive duplicates allowed.
     * @returns {number} The index where the threshold is met, or NaN if not met.
     */
    static checkConsecutiveDuplicates(arr, threshold) {

        let duplicateCount = 0;

        for (let i = 1; i < arr.length; i++) {
            // If the current element is equal to the previous one, increment the duplicate count
            if (arr[i] === arr[i - 1]) {
                duplicateCount++;
                if (duplicateCount >= threshold) {
                    // Return the index where duplicates start
                    return i - duplicateCount;
                }
            } else {
                duplicateCount = 0;
            }
        }

        return NaN;
    }
}

/**
 * Implements a FIFO (First In, First Out) cache.
 * Once the capacity is reached, the oldest element (first added) will be evicted.
 */
export class EvictingList {

    /**
     * Creates an instance of EvictingList.
     * @param {number} capacity - The maximum number of elements the list can hold.
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.queue = []; // Array to keep track of the order of elements
        this.map = new Map(); // Map to store the key-value pairs
    }

    /**
     * Adds a new key-value pair to the list.
     * If the list exceeds the capacity, the oldest item is evicted.
     * If the key already exists, it will be overwritten.
     * @param {string} key - The key of the element to add.
     * @param {*} value - The value of the element to add.
     */
    add(key, value) {
        // If the key already exists, remove it from the queue and map
        if (this.map.has(key)) {
            this.queue = this.queue.filter(item => item !== key);
        }
        // If at capacity, evict the oldest item (first in the queue)
        if (this.queue.length === this.capacity) {
            const oldestKey = this.queue.shift(); // Remove the oldest item from the queue
            this.map.delete(oldestKey); // Remove the oldest item from the map
        }
        // Add the new key-value pair
        this.queue.push(key); // Add the key to the end of the queue
        this.map.set(key, value); // Store the key-value pair in the map
    }

    /**
     * Retrieves the value associated with the given key.
     * @param {string} key - The key of the element to retrieve.
     * @returns {*} The value associated with the key, or null if the key does not exist.
     */
    get(key) {
        return this.map.has(key) ? this.map.get(key) : null;
    }

    /**
     * Retrieves all key-value pairs currently stored in the list.
     * @returns {Array<{key: string, value: *}>} An array of objects containing all stored key-value pairs.
     */
    getAll() {
        return this.queue.map(key => ({ key, value: this.map.get(key) }));
    }

    /**
     * Removes the key-value pair associated with the given key.
     * @param {string} key - The key of the element to remove.
     * @returns {boolean} True if the key was removed, false if the key does not exist.
     */
    remove(key) {
        if (!this.map.has(key)) return false;
        this.queue = this.queue.filter(item => item !== key); // Remove the key from the queue
        this.map.delete(key); // Remove the key-value pair from the map
        return true;
    }

    /**
     * Gets the current size of the evicting list.
     * @returns {number} The number of elements currently in the list.
     */
    getCurrentSize() {
        return this.map.size;
    }

    /**
     * Gets the maximum capacity of the evicting list.
     * @returns {number} The maximum number of elements the list can hold.
     */
    getMaxSize() {
        return this.capacity;
    }

    /**
     * Checks if the evicting list has no stored data.
     * @returns {boolean} True if the list is empty, false otherwise.
     */
    isEmpty() {
        return this.getCurrentSize() === 0;
    }

    /**
     * Checks if the evicting list is at its maximum capacity.
     * @returns {boolean} True if the list is at its maximum capacity, false otherwise.
     */ 
    isFull() {
        return this.getCurrentSize() === this.getMaxSize();
    }

    /**
     * Checks if the evicting list contains a specific key.
     * @param {string} key - The key to check for.
     * @returns {boolean} True if the list contains the key, false otherwise.
     */
    containsKey(key) {
        return this.map.has(key);
    }

    /**
     * Clears all elements from the evicting list.
     */
    clear() {
        this.queue = [];
        this.map.clear();
    }
}