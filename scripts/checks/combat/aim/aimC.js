import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { EvictingList } from "../../../utils/EvictingList.js";

const rotationSamples = new Map();

/**
 * Checks for suspicious duplicate rotations that match pre-snap values.
 * @param {Minecraft.Player} player - The player to check.
 */
export function aimC(player) {

    if (!config.modules.aimC.enabled || player.isRiding()) return;

    const SAMPLES = config.modules.aimC.samples || 50; // Number of samples to store
    const MIN_DELTA_THRESHOLD = config.modules.aimC.min_delta || 15; // Minimum rotation change to consider as a "snap"
    const DUPLICATE_THRESHOLD = config.modules.aimC.duplicate_threshold || 5; // Number of consecutive duplicates to trigger
    const TOLERANCE = config.modules.aimC.tolerance || 1e-7; // Tolerance for considering values as duplicates

    // Initialize EvictingList for storing rotation values if not present
    if (!rotationSamples.has(player.name)) {
        rotationSamples.set(player.name, new EvictingList(SAMPLES));
    }

    const rotationList = rotationSamples.get(player.name);
    
    // Get current rotations
    const currentPitch = player.getPitch();
    const lastPitch = player.getLastPitch();
    const deltaPitch = Math.abs(currentPitch - lastPitch);

    // Add the current pitch to the rotation list
    rotationList.add(Date.now(), currentPitch);

    // Only proceed with checks if we have enough samples
    if (rotationList.getCurrentSize() >= SAMPLES) {
        checkForReturnToPreSnapValue(player, rotationList, deltaPitch, MIN_DELTA_THRESHOLD,  DUPLICATE_THRESHOLD, TOLERANCE);
    }
}

/**
 * Checks for returns to pre-snap rotation values after a significant head movement.
 * @param {Minecraft.Player} player - The player being checked.
 * @param {EvictingList} rotationList - The list of rotation values.
 * @param {number} currentDelta - The current rotation delta.
 * @param {number} minDeltaThreshold - Minimum delta to consider as a snap.
 * @param {number} duplicateThreshold - Number of consecutive duplicates to trigger.
 * @param {number} tolerance - Tolerance for considering values as duplicates.
 * @example
 * [5.12, 5.12, 5.12, 72.3, 90.0, 5.12, 5.12, 5.12]  // Would flag: Returns to pre-snap value 5.12
 * [60.0, 90.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0]  // Wouldn't flag: 10.0 wasn't present before the snap
 * [5.12, 5.12, 72.3, 90.0, 25.0, 25.0, 25.0, 25.0]  // Wouldn't flag: 25.0 wasn't present before the snap
 */
function checkForReturnToPreSnapValue(player, rotationList, currentDelta, minDeltaThreshold, duplicateThreshold, tolerance) {

    // Get all rotation samples as an array
    const samples = rotationList.getAll().map(item => item.value);
    
    // Look for significant head movement
    if (currentDelta >= minDeltaThreshold) {

        // Find the index where the snap occurred
        let snapIndex = -1;
        for (let i = 1; i < samples.length; i++) {
            if (Math.abs(samples[i] - samples[i-1]) >= minDeltaThreshold) {
                snapIndex = i;
                break;
            }
        }

        if (snapIndex !== -1) {
            // Get pre-snap values
            const preSnapValues = samples.slice(0, snapIndex);
            
            // Look for consecutive duplicates after the snap
            const postSnapValues = samples.slice(snapIndex);
            
            // Find the longest sequence of consecutive duplicates after the snap
            let maxConsecutiveCount = 1;
            let currentCount = 1;
            let duplicateValue = null;
            
            for (let i = 1; i < postSnapValues.length; i++) {

                if (Math.abs(postSnapValues[i] - postSnapValues[i-1]) < tolerance) {
                    currentCount++;
                    if (currentCount > maxConsecutiveCount) {
                        maxConsecutiveCount = currentCount;
                        duplicateValue = postSnapValues[i];
                    }
                } else {
                    currentCount = 1;
                }
            }

            // Check if the duplicate value matches any pre-snap value
            if (maxConsecutiveCount >= duplicateThreshold && duplicateValue !== null) {
                const matchesPreSnapValue = preSnapValues.some(
                    value => Math.abs(value - duplicateValue) < tolerance
                );

                if (matchesPreSnapValue) {
                    flag(player, "Aim", "C", "returned to", `${duplicateValue}, consecutive-count=${maxConsecutiveCount}, deltaPitch=${currentDelta}`);
                    
                    // Clear the samples after flagging
                    rotationList.clear();
                }
            }
        }
    }
}