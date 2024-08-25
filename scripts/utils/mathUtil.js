import * as Minecraft from "@minecraft/server";
import { getEyeHeight } from "../util";

/**
 * Helper function to calculate the angle between two vectors in 3D space.
 * @param {{x: number, y: number, z: number}} vectorA - The first vector.
 * @param {{x: number, y: number, z: number}} vectorB - The second vector.
 * @returns {number} - The angle between the two vectors in degrees.
 */
export function getVectorAngle(vectorA, vectorB) {

    const dot = getVectorDotProduct(vectorA, vectorB);
    const mag1 = Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y + vectorA.z * vectorA.z);
    const mag2 = Math.sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y + vectorB.z * vectorB.z);

    return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

/**
 * Helper function to calculate the dot product of two vectors in 3D space.
 * @param {{x: number, y: number, z: number}} vectorA - The first vector.
 * @param {{x: number, y: number, z: number}} vectorB - The second vector.
 * @returns {number} - The dot product of the two vectors.
 */
export function getVectorDotProduct(vectorA, vectorB) {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
}

/**
 * Helper function to calculate the cross product of two vectors in 3D space.
 * @param {{x: number, y: number, z: number}} vectorA - The first vector.
 * @param {{x: number, y: number, z: number}} vectorB - The second vector.
 * @returns {{x: number, y: number, z: number}} - The cross product vector.
 */
export function getVectorCrossProduct(vectorA, vectorB) {
    return {
        x: vectorA.y * vectorB.z - vectorA.z * vectorB.y,
        y: vectorA.z * vectorB.x - vectorA.x * vectorB.z,
        z: vectorA.x * vectorB.y - vectorA.y * vectorB.x
    };
}

/**
 * Helper function to calculate the length of a vector in 3D space.
 * @param {{x: number, y: number, z: number}} vector - The vector object with x, y, and z components.
 * @returns {number} - The length (magnitude) of the vector.
 */
export function getVectorLength(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

/**
 * Computes the vector from the origin position to the given target position in 3D space.
 * @param {object} originPosition - The position from where to start.
 * @param {object} targetPosition - The target position at which the vector will be facing towards.
 * @returns {{x: number, y: number, z: number}} - The vector between the two given positons.
 */
export function getVectorBetweenPositions(originPosition, targetPosition) {
    return {
        x: targetPosition.x - originPosition.x,
        y: targetPosition.y - originPosition.y,
        z: targetPosition.z - originPosition.z
    };
}

/**
 * Helper function to calculate the distance between two vectors (or points) in 3D space.
 * @param {{x: number, y: number, z: number}} vectorA - The first vector (or point).
 * @param {{x: number, y: number, z: number}} vectorB - The second vector (or point).
 * @returns {number} - The distance between the two vectors.
 */
export function getDistanceBetweenVectors(vectorA, vectorB) {

    const diffX = vectorB.x - vectorA.x;
    const diffY = vectorB.y - vectorA.y;
    const diffZ = vectorB.z - vectorA.z;

    return Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
}

/**
 * Helper function to calculate the direction vector from yaw and pitch of a player.
 * @param {number} yaw - The yaw angle in degrees.
 * @param {number} pitch - The pitch angle in degrees.
 * @returns {{x: number, y: number, z: number}} - The direction vector.
 */
export function getPlayerDirectionVector(yaw, pitch) {

    const yawRadians = yaw * (Math.PI / 180);
    const pitchRadians = pitch * (Math.PI / 180);

    return {
        x: -Math.sin(yawRadians) * Math.cos(pitchRadians),
        y: -Math.sin(pitchRadians),
        z: Math.cos(yawRadians) * Math.cos(pitchRadians)
    };
}

/**
 * Helper function to scale a vector by a scalar in 3D space.
 * @param {{x: number, y: number, z: number}} vector - The vector to scale.
 * @param {number} scalar - The scalar value to multiply the vector by.
 * @returns {{x: number, y: number, z: number}} - The resulting scaled vector.
 */
export function getScaledVector(vector, scalar) {
    return {
        x: vector.x * scalar,
        y: vector.y * scalar,
        z: vector.z * scalar
    };
}

/**
 * Helper function to normalize a vector in 3D space.
 * @param {{x: number, y: number, z: number}} vector - The vector object with x, y, and z components.
 * @returns {{x: number, y: number, z: number}} - The normalized vector.
 */
export function getNormalizedVector(vector) {

    const length = getVectorLength(vector);

    return {
        x: vector.x / length,
        y: vector.y / length,
        z: vector.z / length
    };
}

/**
 * Helper function to reverse a vector in 3D space.
 * @param {{x: number, y: number, z: number}} vector - The vector to reverse.
 * @returns {{x: number, y: number, z: number}} - The reversed vector.
 */
export function getReversedVector(vector) {
    return {
        x: -vector.x,
        y: -vector.y,
        z: -vector.z
    }
}

/**
 * Helper function to calculate the eye position of the player.
 * @param {Minecraft.Player} player - The player object.
 * @returns {{x: number, y: number, z: number}} - The eye position.
 */
export function getEyePosition(player) {

    const eyeHeight = getEyeHeight(player);

    return {
        x: player.location.x,
        y: player.location.y + eyeHeight,
        z: player.location.z
    }
}



// The following functions will be recoded soon.
export function getAbsoluteGcd(current, last) {
    const EXPANDER = 1.6777216E7;

    let currentExpanded = Math.floor(current * EXPANDER);
    let lastExpanded = Math.floor(last * EXPANDER);

    return gcd(currentExpanded, lastExpanded);
}


export function gcd(a, b) {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
}


export function getDistanceY(one, two) {
    return Math.sqrt(Math.pow(two.location.y - one.location.y, 2));
}


export function hVelocity_2(player) {
    return Math.abs(player.getVelocity().x - player.getVelocity().z);
}


export function getAverage(data) {
    return data.reduce((acc, val) => acc + val, 0) / data.length;
}


export function getStandardDeviation(data) {
    const variance = getVariance(data);
    return Math.sqrt(variance);
}


export const EXPANDER = Math.pow(2, 24);


export function getVariance(data) {
    let count = 0;
    let sum = 0.0;
    let variance = 0.0;
    let average;

    data.forEach(number => {
        sum += number;
        ++count;
    });

    average = sum / count;

    data.forEach(number => {
        variance += Math.pow(number - average, 2.0);
    });

    return variance;
}