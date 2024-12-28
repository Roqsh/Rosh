import * as Minecraft from "@minecraft/server";
import { debug } from "../util";

/**
 * Handles the player's movement data and calculates position and velocity changes.
 * This function does not update the player's last position and velocity immediately,
 * as this is already done in the manageLastTick function.
 * 
 * @param {Minecraft.Player} player - The player whose movement data is being processed.
 * @returns {boolean} Returns false if an error occurs, otherwise true.
 */
export function movementHandler(player) {
    try {
        // Get the player's current position and velocity
        const currentPosition = player.location;
        const currentVelocity = player.getVelocity();

        // Retrieve the player's last position and velocity using custom prototype methods
        const lastPosition = player.getLastPosition();
        const lastVelocity = player.getLastVelocity();

        // Calculate position differences (deltas)
        const deltaPosX = currentPosition.x - lastPosition.x;
        const deltaPosY = currentPosition.y - lastPosition.y;
        const deltaPosZ = currentPosition.z - lastPosition.z;

        // Calculate velocity differences (deltas)
        const deltaVelX = currentVelocity.x - lastVelocity.x;
        const deltaVelY = currentVelocity.y - lastVelocity.y;
        const deltaVelZ = currentVelocity.z - lastVelocity.z;

        // Debug output to track position and velocity changes (for debugging purposes)
        const debugData = [
            { label: "DeltaPos X", value: deltaPosX, tag: "deltaPosX" },
            { label: "DeltaPos Y", value: deltaPosY, tag: "deltaPosY" },
            { label: "DeltaPos Z", value: deltaPosZ, tag: "deltaPosZ" },
            { label: "DeltaVel X", value: deltaVelX, tag: "deltaVelX" },
            { label: "DeltaVel Y", value: deltaVelY, tag: "deltaVelY" },
            { label: "DeltaVel Z", value: deltaVelZ, tag: "deltaVelZ" },
        ];

        // Log the debug values
        debugData.forEach(({ label, value, tag }) => debug(player, label, value, tag));

        return true;

    } catch (error) {
        // Log error details for easier debugging in case of failure
        console.error(`${new Date().toISOString()} | Player: ${player.name} | Error: ${error} ${error.stack}`);

        // Return false to indicate that the movement update failed
        return false;
    }
}