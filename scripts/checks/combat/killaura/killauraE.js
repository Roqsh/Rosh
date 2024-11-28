import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getSpeed, debug } from "../../../util";
import { EvictingList } from "../../../utils/EvictingList.js";
import { Statistics } from "../../../utils/Statistics.js";
import { Vector3D } from "../../../utils/Vector3D.js";

// Map to store each player's optimal yaw differences
const optimalYawDifferences = new Map();

/**
 * Detects suspicious optimal yaw values when looking at a target.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Player | Minecraft.Entity} target - The attacked player.
 */
export function killauraE(player, target) {

    if (!config.modules.killauraE.enabled || getSpeed(player) === 0) return;

    // Initialize an EvictingList with a capacity of 65 timestamps if not already present
    if (!optimalYawDifferences.has(player.name)) {
        optimalYawDifferences.set(player.name, new EvictingList(65));
    }
    const yawDifferences = optimalYawDifferences.get(player.name);
    
    // Get the origin and target positions
    const origin = {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
    };
    
    const end = {
        x: target.location.x,
        y: target.location.y,
        z: target.location.z,
    };
    
    // Calculate the direction vector from origin to target and normalize
    const directionVector = Vector3D.getVectorBetweenPositions(origin, end);
    const normalizedDirection = Vector3D.getNormalizedVector(directionVector);
    
    // Calculate optimal yaw between player and target
    let optimalYaw = Math.atan2(-normalizedDirection.x, normalizedDirection.z) * (180 / Math.PI);
    optimalYaw = (optimalYaw % 360 + 360) % 360;

    // Calculate yaw difference considering wrap-around
    let yawDiff = Math.abs(optimalYaw - player.getYaw());
    if (yawDiff > 180) yawDiff = 360 - yawDiff;

    // Add the yaw difference to the EvictingList
    yawDifferences.add(yawDiff, Date.now());

    if (yawDifferences.getCurrentSize() >= 65) {
        const diff = yawDifferences.getAll().map(entry => entry.key);

        // Calculate the standard deviation and average of the yaw differences
        const deviation = Statistics.getDeviation(diff);
        const average = Statistics.getMean(diff);

        // If the target is a player, get their name.
        const targetName = target.isPlayer() ? `, target=${target.name}` : `, target=${target.typeId.replace("minecraft:", "")}`;

        if (average < 4 && deviation < 8) {
            flag(player, "Killaura", "E", "average optimal-yawDiff", `${average}, deviation: ${deviation}${targetName}`);
            yawDifferences.clear();
        }
    }
}