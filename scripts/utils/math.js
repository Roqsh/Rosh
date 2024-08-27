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
 * defined by minimum and maximum coordinates. It provides methods for checking 
 * whether points or other bounding boxes intersect with it, and includes functionality 
 * to dynamically adjust its size and check player positions based on their current state.
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
}

/**
 * A collection of statistical functions for analyzing datasets.
 */
export class Statistics {

    /**
     * Calculates the standard deviation of a dataset, which is the square root of the variance.
     * @param {number[]} data - The dataset to calculate the standard deviation for.
     * @returns {number} The standard deviation value.
     */
    static getStandardDeviation(data) {
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
    static simplifyFraction(numerator, denominator) {

        const gcd = this.getAbsoluteGcd(numerator, denominator);

        return {
            numerator: numerator / gcd,
            denominator: denominator / gcd
        };
    }
}