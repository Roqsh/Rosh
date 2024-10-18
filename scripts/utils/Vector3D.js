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

        if (length === 0) return;

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
     * Adds two vectors together in 3D space.
     * @param {{x: number, y: number, z: number}} vectorA - The first vector.
     * @param {{x: number, y: number, z: number}} vectorB - The second vector.
     * @returns {{x: number, y: number, z: number}} - The resulting vector.
     */
    static getVectorAddition(vectorA, vectorB) {
        return {
            x: vectorA.x + vectorB.x,
            y: vectorA.y + vectorB.y,
            z: vectorA.z + vectorB.z
        };
    }

    /**
     * Divides two vectors together in 3D space.
     * @param {{x: number, y: number, z: number}} vectorA - The first vector.
     * @param {{x: number, y: number, z: number}} vectorB - The second vector.
     * @returns {{x: number, y: number, z: number}} - The resulting vector.
     * @throws {Error} If any of the components of vectorB are zero.
     */
    static getVectorDivision(vectorA, vectorB) {

        if (vectorB.x === 0 || vectorB.y === 0 || vectorB.z === 0) {
            throw new Error("Cannot divide by a vector with any zero components.");
        }

        return {
            x: vectorA.x / vectorB.x,
            y: vectorA.y / vectorB.y,
            z: vectorA.z / vectorB.z
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