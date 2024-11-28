import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";
import { Vector3D } from "../../../utils/Vector3D.js";
import { EvictingList } from "../../../utils/EvictingList.js";

// Map to store each player's detection timestamps
const playerDetectionTimestamps = new Map();

/**
 * Checks if a player hits through a solid wall.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Player | Minecraft.Entity} target - The attacked player.
 */
export function killauraD(player, target) {
    
    if (!config.modules.killauraD.enabled) return;

    // Initialize an EvictingList with a capacity of 6 timestamps if not already present
    if (!playerDetectionTimestamps.has(player.name)) {
        playerDetectionTimestamps.set(player.name, new EvictingList(5));
    }
    const detectionTimestamps = playerDetectionTimestamps.get(player.name);

    // Get the eye positions of the player and the target.
    const playerEyePos = Vector3D.getEyePosition(player);
    const targetEyePos = Vector3D.getEyePosition(target);

    // Calculate the direction vector from the player to the target.
    const directionVector = Vector3D.getVectorBetweenPositions(playerEyePos, targetEyePos);

    // Calculate the magnitude to determine the number of steps needed.
    const magnitude = Vector3D.getVectorLength(directionVector);

    // Exit early if the player and target are in close proximity.
    if (magnitude < 0.5) return;

    // Normalize the direction vector for ray tracing.
    const stepVector = Vector3D.getNormalizedVector(directionVector);
    const steps = Math.ceil(magnitude);

    // Define the y-axis step increment (you can adjust the granularity as needed).
    const yIncrement = config.modules.killauraD.y_increment || 0.1;
    const targetHeight = 1.8;

    let blockDetected = false;
    let detectedBlockType = '';

    // Loop through each step along the height of the target.
    for (let yOffset = 0; yOffset <= targetHeight; yOffset += yIncrement) {

        // Adjust the target eye position by the current yOffset.
        const adjustedTargetEyePos = {
            x: targetEyePos.x,
            y: target.location.y + yOffset,
            z: targetEyePos.z
        };

        // Recalculate the direction vector and magnitude for the adjusted target eye position.
        const directionVectorAdjusted = Vector3D.getVectorBetweenPositions(playerEyePos, adjustedTargetEyePos);
        const magnitudeAdjusted = Vector3D.getVectorLength(directionVectorAdjusted);

        if (magnitudeAdjusted < 0.01) continue;

        // Normalize the adjusted direction vector for ray tracing.
        const stepVectorAdjusted = Vector3D.getNormalizedVector(directionVectorAdjusted);
        const stepsAdjusted = Math.ceil(magnitudeAdjusted);

        blockDetected = false;

        // Trace along the vector at this yOffset to check for solid blocks between the player and target.
        for (let i = 0; i < stepsAdjusted; i++) {

            const checkPos = {
                x: playerEyePos.x + stepVectorAdjusted.x * i,
                y: playerEyePos.y + stepVectorAdjusted.y * i,
                z: playerEyePos.z + stepVectorAdjusted.z * i,
            };

            // Retrieve the block at the current position.
            const block = player.dimension.getBlock(checkPos);

            // Check if the block is solid and exists.
            if (block && block.isSolid) {
                // Remove the "minecraft:" prefix from the block type ID.
                detectedBlockType = block.typeId.replace("minecraft:", "");
                blockDetected = true;
                break;
            }
        }

        // If we found a clear path at this height, no need to flag.
        if (!blockDetected) return;
    }

    // If the target is a player, get their name.
    const targetName = target.isPlayer() ? `, target=${target.name}` : `, target=${target.typeId.replace("minecraft:", "")}`;

    // If no clear path was found at any height, add to the EvictingList
    if (blockDetected) {
        detectionTimestamps.add(Date.now(), "True");
    }

    // If the EvictingList is full, get the time difference between the oldest and newest timestamp
    if (detectionTimestamps.getCurrentSize() >= 5) {
        
        const allTimestamps = detectionTimestamps.getAll();
        const oldestTimestamp = allTimestamps[0].key;
        const newestTimestamp = allTimestamps[allTimestamps.length - 1].key;

        // Check if the timestamps are within 1 second of each other
        if (newestTimestamp - oldestTimestamp <= 1000) {
            flag(player, "Killaura", "D", "hit through", `${detectedBlockType}${targetName}`);
            detectionTimestamps.clear();
        }
    }
}