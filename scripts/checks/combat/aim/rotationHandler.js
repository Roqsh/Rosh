import * as Minecraft from "@minecraft/server";
import { debug } from "../../../util";

/**
 * Handles the player's rotation data and updates their pitch and yaw values.
 * This function is called every game tick and updates rotation data continuously.
 * 
 * @param {Minecraft.Player} player - The player whose rotation data is being updated.
 * @returns {boolean} True if rotation update was successful, false otherwise.
 */
export function rotationHandler(player) {
    try {
        // Get the player's current pitch and yaw
        const currentYaw = player.getRotation().y;
        const currentPitch = player.getRotation().x;

        // Calculate changes in pitch and yaw
        const deltaYaw = currentYaw - player.getYaw();
        const deltaPitch = currentPitch - player.getPitch();

        // Output the current values and changes for debugging purposes
        debug(player, "Yaw", currentYaw, "yaw");
        debug(player, "Pitch", currentPitch, "pitch");
        debug(player, "Delta Yaw", deltaYaw, "deltaYaw");
        debug(player, "Delta Pitch", deltaPitch, "deltaPitch");

        // Update the player's pitch and yaw values
        player.setYaw(currentYaw);
        player.setPitch(currentPitch);
        player.setDeltaYaw(deltaYaw);
        player.setDeltaPitch(deltaPitch);

        // Rotation update successful
        return true;

    } catch (error) {
        // Handle any potential errors gracefully
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);

        // Rotation update failed
        return false;
    }
}