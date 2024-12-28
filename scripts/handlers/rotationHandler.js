import * as Minecraft from "@minecraft/server";
import { debug } from "../util";

/**
 * Handles the player's rotation data, calculating and updating their yaw and pitch values.
 * @param {Minecraft.Player} player - The player whose rotation data is being processed.
 * @returns {boolean} - Returns false if an error occurs, otherwise true.
 */
export function rotationHandler(player) {
    try {
        const currentRotation = player.getRotation();

        // Get the player's current rotation (yaw and pitch)
        const currentYaw = currentRotation.y;
        const currentPitch = currentRotation.x;

        // Retrieve the last yaw and pitch values using custom prototype methods
        const lastYaw = player.getYaw();
        const lastPitch = player.getPitch();

        // Calculate changes in yaw and pitch (deltas)
        const deltaYaw = currentYaw - lastYaw;
        const deltaPitch = currentPitch - lastPitch;

        // Calculate changes in deltaYaw and deltaPitch (jolts)
        const joltYaw = deltaYaw - player.getLastDeltaYaw();
        const joltPitch = deltaPitch - player.getLastDeltaPitch();

        // Debug output to track yaw and pitch changes (for debugging purposes)
        const debugData = [
            { label: "Yaw", value: currentYaw, tag: "yaw" },
            { label: "Pitch", value: currentPitch, tag: "pitch" },
            { label: "Delta Yaw", value: deltaYaw, tag: "deltaYaw" },
            { label: "Delta Pitch", value: deltaPitch, tag: "deltaPitch" },
        ];

        // Log the debug values
        debugData.forEach(({ label, value, tag }) => debug(player, label, value, tag));

        // Update the player's current yaw and pitch and delta values
        player.setYaw(currentYaw);
        player.setPitch(currentPitch);
        player.setDeltaYaw(deltaYaw);
        player.setDeltaPitch(deltaPitch);
        player.setJoltYaw(joltYaw);
        player.setJoltPitch(joltPitch);

        return true;

    } catch (error) {
        // Log error details for easier debugging in case of failure
        console.error(`${new Date().toISOString()} | Player: ${player.name} | Error: ${error} ${error.stack}`);

        // Return false to indicate that the rotation update failed
        return false;
    }
}