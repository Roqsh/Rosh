import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { Vector3D } from "../../../utils/math.js";

// Map to store the previous position of players
const playerPreviousPosition = new Map();
// Map to store the buffer count of invalid sprinting events for players
const playerInvalidSprintBuffer = new Map();

/**
 * Checks for sprinting in invalid directions. (Omni-Sprint)
 * @param {Minecraft.Player} player - The player to check.
 */
export function sprint_a(player) {

    if (!config.modules.invalidsprintA.enabled || !player.isSprinting || player.isInWater) return;

    // Define the threshold angle (e.g., 75 degrees) and buffer threshold (e.g., 8 events)
    const ANGLE_THRESHOLD = config.modules.invalidsprintA.angle_threshold || 75;
    const BUFFER_THRESHOLD = config.modules.invalidsprintA.buffer_threshold || 8;

    // Get the player's current position
    const currentPosition = player.location;

    // Retrieve or initialize the previous position for the player
    let previousPosition = playerPreviousPosition.get(player.id);

    if (!previousPosition) {
        // If there's no previous position, initialize it with the current position
        previousPosition = currentPosition;
        playerPreviousPosition.set(player.id, previousPosition);
        return; // No movement to check yet
    }

    // Calculate the move direction vector
    const moveDirection = Vector3D.getVectorBetweenPositions(previousPosition, currentPosition);

    if (Vector3D.getVectorLength(moveDirection) < 0.1) return;

    // Normalize the move direction vector (x and z components only)
    const normalizedMoveDirection = Vector3D.getNormalizedVector({
        x: moveDirection.x,
        y: 0, // Ignored
        z: moveDirection.z
    });

    // Get the player's current view direction vector
    const viewDirection = player.getViewDirection();

    // Normalize the view direction vector (x and z components only)
    const normalizedViewDirection = Vector3D.getNormalizedVector({
        x: viewDirection.x,
        y: 0, // Ignored
        z: viewDirection.z
    });

    // Calculate the angle between the view direction and move direction
    const angle = Vector3D.getVectorAngle(normalizedViewDirection, normalizedMoveDirection);

    // Debug the angle between the view direction and move direction
    debug(player, "Angle-Diff", angle, "move-angle");

    // Retrieve or initialize the invalid sprint buffer count for the player
    let bufferCount = playerInvalidSprintBuffer.get(player.id) || 0;

    if (angle > ANGLE_THRESHOLD) {
        // Increment the buffer count
        bufferCount++;
        
        // Check if the buffer count exceeds the threshold
        if (bufferCount >= BUFFER_THRESHOLD) {
            flag(player, "InvalidSprint", "A", "direction-diff", `${angle}°`, true);
            // Reset buffer count after flagging
            playerInvalidSprintBuffer.set(player.id, 0);
        } else {
            // Update the buffer count
            playerInvalidSprintBuffer.set(player.id, bufferCount);
        }
    } else {
        // Reset buffer count if angle is valid
        playerInvalidSprintBuffer.set(player.id, 0);
    }

    // Update the previous position with the current position
    playerPreviousPosition.set(player.id, currentPosition);
}