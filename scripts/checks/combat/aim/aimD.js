import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getSpeed, debug } from "../../../util";

// Store last move direction for each player
const playerLastMoveDirections = new Map();

/**
 * Checks for improper decelerating when doing large yaw movements.
 * @param {Minecraft.Player} player - The player to check.
 */
export function aimD(player) {

    if (!config.modules.aimD.enabled) return;

    const moveDirection = player.getMoveDirection();
    const playerId = player.id;

    // Reset if player stopped moving
    if (getSpeed(player) === 0) {
        playerLastMoveDirections.delete(playerId);
        return;
    }

    // Get the last move direction for this specific player
    const lastMoveDirection = playerLastMoveDirections.get(playerId);

    if (lastMoveDirection) {
        const deltaXZ = Math.hypot(moveDirection.x, moveDirection.z);
        const lastDeltaXZ = Math.hypot(lastMoveDirection.x, lastMoveDirection.z);
        const acceleration = Math.abs(deltaXZ - lastDeltaXZ);

        debug(player, "Acceleration", acceleration, "accel");

        if (player.getDeltaYaw() > 35 && acceleration < 0.00001) {
            flag(player, "Aim", "D", "deltaYaw", `${player.getDeltaYaw().toFixed(2)}, acceleration=${acceleration}`);
        }
    }

    // Update the last move direction for this player
    playerLastMoveDirections.set(playerId, moveDirection);
}