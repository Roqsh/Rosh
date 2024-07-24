import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for looking at the exact center of the placed block.
 * @name scaffold_j
 * @param {player} player - The player to check.
 * @param {block} block - The placed block.
 */
export function scaffold_j(player, block) {

    if (!config.modules.scaffoldJ.enabled) return;

    // Define the threshold for how close the view direction must be to consider it as looking directly at the center
    const THRESHOLD = config.modules.scaffoldJ.threshold;

    // Define all possible center locations on the block-faces
    const center = block.center();
    const bottomCenter = block.bottomCenter();

    // Calculate the center positions for each block face (as we dont have an API implementation yet)
    const topCenter = {
        x: block.location.x + 0.5,
        y: block.location.y + 1.0,
        z: block.location.z + 0.5
    };

    const northCenter = {
        x: block.location.x + 0.5,
        y: block.location.y + 0.5,
        z: block.location.z
    };

    const eastCenter = {
        x: block.location.x + 1.0,
        y: block.location.y + 0.5,
        z: block.location.z + 0.5
    };

    const southCenter = {
        x: block.location.x + 0.5,
        y: block.location.y + 0.5,
        z: block.location.z + 1.0
    };

    const westCenter = {
        x: block.location.x,
        y: block.location.y + 0.5,
        z: block.location.z + 0.5
    };   

    // Get the player's position and view direction
    const playerPosition = player.location;
    const viewDirection = player.getViewDirection();

    /**
     * Computes the vector from the player to the given center position.
     * @param {Object} center - The center position.
     * @returns {Object} - The vector from the player to the center.
     */
    function vectorTo(center) {
        return {
            x: center.x - playerPosition.x,
            y: center.y - playerPosition.y,
            z: center.z - playerPosition.z
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
     * @param {Object} v1 - The first vector.
     * @param {Object} v2 - The second vector.
     * @returns {Object} - The difference between the two vectors.
     */
    function vectorDifference(v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z
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

        const toCenter = vectorTo(position); // Vector from player to the center
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