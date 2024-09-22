import config from "../../../data/config.js";
import { flag, getEyeHeight } from "../../../util";
import { Block } from "../../../utils/Block.js";

/**
 * Checks for looking at the exact center of the placed block.
 * @param {import("@minecraft/server").Player} player - The player to check.
 * @param {import("@minecraft/server").Block} block - The placed block.
 */
export function scaffold_j(player, block) {

    if (!config.modules.scaffoldJ.enabled) return;

    // Define the threshold for how close the view direction must be to consider it as looking directly at the center
    const THRESHOLD = config.modules.scaffoldJ.threshold;

    // Define all possible center locations on the block-faces (API methods)
    const center = block.center();
    const bottomCenter = block.bottomCenter();

    // Calculate the center positions for each block face (as we don't have an API implementation yet)
    const topCenter = Block.topCenter(block);
    const northCenter = Block.northCenter(block);
    const eastCenter = Block.eastCenter(block);
    const southCenter = Block.southCenter(block);
    const westCenter = Block.westCenter(block);   

    // Get the player's position and view direction
    const viewDirection = player.getViewDirection();
    const playerPosition = player.location;
    const playerEyeHeight = getEyeHeight(player);
    
    const eyePosition = {
        x: playerPosition.x,
        y: playerPosition.y + playerEyeHeight,
        z: playerPosition.z
    };

    /**
     * Computes the vector from the player's eye position to the given center position.
     * @param {Object} center - The center position.
     * @returns {Object} - The vector from the player's eye to the center.
     */
    function vectorTo(center) {
        return {
            x: center.x - eyePosition.x,
            y: center.y - eyePosition.y,
            z: center.z - eyePosition.z
        };
    }

    /**
     * Normalizes a vector to have a unit length.
     * @param {Object} vector - The vector to normalize.
     * @returns {Object} - The normalized vector.
     */
    function normalizeVector(vector) {
        const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
        return {
            x: vector.x / length,
            y: vector.y / length,
            z: vector.z / length
        };
    }

    /**
     * Computes the difference between two vectors.
     * @param {Object} vector1 - The first vector.
     * @param {Object} vector2 - The second vector.
     * @returns {Object} - The difference between the two vectors.
     */
    function vectorDifference(vector1, vector2) {
        return {
            x: vector1.x - vector2.x,
            y: vector1.y - vector2.y,
            z: vector1.z - vector2.z
        };
    }

    /**
     * Computes the magnitude (length) of a vector.
     * @param {Object} vector - The vector to measure.
     * @returns {number} - The magnitude of the vector.
     */
    function vectorMagnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    }

    // Define all possible center locations with labels
    const centers = [
        { label: "center", position: center },
        { label: "bottomCenter", position: bottomCenter },
        { label: "topCenter", position: topCenter },
        { label: "northCenter", position: northCenter },
        { label: "eastCenter", position: eastCenter },
        { label: "southCenter", position: southCenter },
        { label: "westCenter", position: westCenter }
    ];

    let closestCenter = null;
    let closestDiffMagnitude = Infinity;

    // Iterate over each center and compute how close the player’s view direction is to each center
    for (const { label, position } of centers) {

        const toCenter = vectorTo(position); // Vector from player's eye to the center
        const normalizedToCenter = normalizeVector(toCenter); // Normalized vector

        const diff = vectorDifference(normalizedToCenter, viewDirection); // Difference between normalized vectors
        const diffMagnitude = vectorMagnitude(diff); // Magnitude of the difference

        // Check if the difference magnitude is below the threshold and is the smallest found so far
        if (diffMagnitude < THRESHOLD && diffMagnitude < closestDiffMagnitude) {
            closestCenter = label;
            closestDiffMagnitude = diffMagnitude;
        }
    }

    // If a close enough center was found, flag the player
    if (closestCenter) {
        flag(player, "Scaffold", "J", closestCenter, `precision=${closestDiffMagnitude}`);
    }
}