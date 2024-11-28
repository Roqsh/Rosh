import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastPositions = new Map();

/**
 * Checks if the player is not slowing down when inside a cobweb.
 * @param {Minecraft.Player} player - The player to check.
 */
export function noslowB(player) {

    // Return early if the module is disabled or the player is flying.
    if (!config.modules.noslowB.enabled || player.isFlying) return;

    const currentLocation = player.location;
    const lastLocation = lastPositions.get(player.name) ?? currentLocation;
    const { x: velocityX, z: velocityZ } = player.getVelocity();

    // Return early if the player is not moving.
    if (velocityX === 0 && velocityZ === 0) return;

    const { x, y, z } = currentLocation;

    // Check if the player's head or body is in a cobweb.
    const isInWeb = ["minecraft:web"].includes(
        player.dimension.getBlock({ x: Math.floor(x), y: Math.floor(y) + 1, z: Math.floor(z) })?.typeId ||
        player.dimension.getBlock({ x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) })?.typeId
    );

    // If the player is not in a cobweb, update the last known position and return.
    if (!isInWeb) {
        lastPositions.set(player.name, currentLocation);
        return;
    }

    const currentSpeed = Math.hypot(velocityX, velocityZ);
    const speedLimitIncrease = calculateSpeedIncrease(player.getEffect("speed"));

    // If the player is in a cobweb and moving faster than allowed, flag them.
    if (currentSpeed > (0.45 + speedLimitIncrease)) {
        flag(player, "NoSlow", "B", "speed", currentSpeed);

        // Optionally teleport the player back to the last known position.
        if (!config.silent) {
            player.teleport(lastLocation, {
                checkForBlocks: false,
                dimension: player.dimension
            });
        }
    } else {
        // Update the last known position if the speed is within the limit.
        lastPositions.set(player.name, currentLocation);
    }
}

/**
 * Calculates the increase in speed limit based on the player's Speed effect.
 * @param {Minecraft.Effect} speedEffect - The Speed effect applied to the player.
 * @returns {number} The additional speed limit allowed by the Speed effect.
 */
function calculateSpeedIncrease(speedEffect) {
    if (!speedEffect) return 0;
    return (speedEffect.amplifier + 1) * 0.0476;
}