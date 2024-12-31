import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { Vector3D } from "../../../utils/Vector3D.js";

// Map to store the buffer count of invalid sprinting events for players
const playerInvalidSprintBuffer = new Map();

/**
 * Checks for sprinting in invalid directions. (Omni-Sprint)
 * @param {Minecraft.Player} player - The player to check.
 */
export function sprintA(player) {

    if (!config.modules.invalidsprintA.enabled || 
        !player.isSprinting || 
        player.isInWater || 
        player.isFlying ||
        player.isGliding ||
        player.isClimbing ||
        player.ticksSinceFlighted < 20 ||
        player.ticksSinceGlided < 20

    ) return;

    const ANGLE_THRESHOLD = 75;
    const BUFFER_THRESHOLD = 9;

    // Get the player's current move direction vector
    const moveDirection = player.getMoveDirection();

    if (Vector3D.getVectorLength(moveDirection) < 0.001) return;

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
    debug(player, "Angle-Diff", angle, "sprint-angle");

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
}