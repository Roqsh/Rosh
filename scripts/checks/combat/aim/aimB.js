import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { EvictingList } from "../../../utils/EvictingList.js";
import { String } from "../../../utils/String.js";

const yawSamples = new Map();
const pitchSamples = new Map();

/**
 * Checks for smoothed yaw or pitch movements.
 * @param {Minecraft.Player} player - The player to check.
 */
export function aimB(player) {

    // Exit early if the module is disabled or the player is riding an entity
    if (!config.modules.aimB.enabled || player.isRiding()) return;

    const SAMPLES = config.modules.aimB.samples || 40; // Number of samples to store (default: 40)
    const FREQUENCY = config.modules.aimB.integer_frequency || 0.5;

    // Initialize EvictingLists for storing delta yaw and pitch values if not present
    if (!yawSamples.has(player.name)) {
        yawSamples.set(player.name, new EvictingList(SAMPLES));
    }
    
    if (!pitchSamples.has(player.name)) {
        pitchSamples.set(player.name, new EvictingList(SAMPLES));
    }

    // Retrieve the delta yaw and pitch samples for the player
    const deltaYawList = yawSamples.get(player.name);
    const deltaPitchList = pitchSamples.get(player.name);

    // Calculate the current delta yaw and delta pitch values
    const deltaYaw = player.getYaw() - player.getLastYaw();
    const deltaPitch = player.getPitch() - player.getLastPitch();

    // Add the current delta values to the EvictingLists, only if non-zero
    if (deltaYaw !== 0) deltaYawList.add(Date.now(), deltaYaw);
    if (deltaPitch !== 0) deltaPitchList.add(Date.now(), deltaPitch);

    // Perform checks if the number of samples has reached the specified amount
    if (deltaYawList.getCurrentSize() >= SAMPLES) {
        checkForSmoothing(player, deltaYawList, 'yaw', deltaYaw, FREQUENCY);
    }

    if (deltaPitchList.getCurrentSize() >= SAMPLES) {
        checkForSmoothing(player, deltaPitchList, 'pitch', deltaPitch, FREQUENCY);
    }
}

/**
 * Checks for integer frequency in the given sample list and flags the player if needed.
 * @param {Minecraft.Player} player - The player being checked.
 * @param {EvictingList} sampleList - The list of delta values (yaw or pitch).
 * @param {string} type - The type of movement being checked ('yaw' or 'pitch').
 * @param {number} currentDelta - The current delta value.
 * @param {number} frequencyThreshold - The threshold for flagging based on integer frequency.
 */
function checkForSmoothing(player, sampleList, type, currentDelta, frequencyThreshold) {
    // Count how many delta values are integers
    const integerCount = sampleList.getAll().filter(item => Number.isInteger(item.value)).length;
    const integerFrequency = integerCount / sampleList.getCurrentSize();

    // Get the most recent integer delta value
    const recentIntegerEntry = sampleList.getAll().reverse().find(item => Number.isInteger(item.value));
    
    // Only proceed if a recent integer value exists
    if (recentIntegerEntry) {
        const recentIntegerValue = recentIntegerEntry.value;

        // Debug information if not zero
        if (currentDelta != 0) {
            debug(player, `Delta ${String.toUpperCase(type)}`, `${currentDelta}, frequency=${integerFrequency}, (${integerCount} of ${sampleList.getCurrentSize()})`, `aimB${type}`);
        }

        // Flag the player if the integer frequency exceeds the threshold
        if (integerFrequency > frequencyThreshold) {
            flag(player, "Aim", "B", `delta${String.toUpperCase(type)}`, `${recentIntegerValue}, frequency=${integerFrequency}, (${integerCount} of ${sampleList.getCurrentSize()})`);
            sampleList.clear();
        }
    }
}