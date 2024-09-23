import * as Minecraft from "@minecraft/server";
import { EvictingList } from "../../../utils/EvictingList.js";
import { Statistics } from "../../../utils/Statistics.js";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

// Map to store each player's CPS history for AutoClicker/B
const playerCpsHistoryB = new Map();
// Map to track the last flagged timestamp for duplicates
const lastFlaggedTimeB = new Map();

/**
 * Checks for suspiciously low deviation or duplicate CPS.
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclickerB(player) {

    if (!config.modules.autoclickerB.enabled) return;

    const SAMPLES = config.modules.autoclickerB.samples; // Number of CPS samples to store
    const MAX_DUPLICATES = config.modules.autoclickerB.maxDuplicates; // Amount of consecutive duplicates to consider cheating
    const MIN_STD_DEV = config.modules.autoclickerB.minStdDev; // Minimum deviation to consider a player's CPS legitimate
    const MIN_AVERAGE_CPS = config.modules.autoclickerD.minAverageCps; // Minimum average CPS to proceed with checks

    // Initialize CPS history for the player if not already present
    if (!playerCpsHistoryB.has(player.name)) {
        playerCpsHistoryB.set(player.name, new EvictingList(SAMPLES));
    }
    const cpsHistory = playerCpsHistoryB.get(player.name);

    // Add the current CPS with its timestamp to the player's history
    const currentTime = Date.now();
    const currentCps = player.getCps();
    cpsHistory.add(currentTime, currentCps);

    // Retrieve all stored CPS values and their timestamps
    const cpsEntries = cpsHistory.getAll();
    const cpsValues = cpsEntries.map(entry => entry.value);
    const timestamps = cpsEntries.map(entry => entry.key);

    // Ensure we have enough samples before performing checks
    if (cpsValues.length < SAMPLES) return;

    // Calculate mean CPS (average)
    const averageCps = Statistics.getMean(cpsValues);

    // Check if the average CPS meets the minimum threshold
    if (averageCps < MIN_AVERAGE_CPS) return;

    // Get the last flagged timestamp for this player
    const lastFlaggedTime = lastFlaggedTimeB.get(player.name) || 0;

    // Check if the number of consecutive duplicate CPS values exceeds the threshold
    const duplicateIndex = Statistics.checkConsecutiveDuplicates(cpsValues, MAX_DUPLICATES);

    if (duplicateIndex !== NaN) {
        const duplicateTime = timestamps[duplicateIndex];
        if (duplicateTime > lastFlaggedTime) {
            flag(player, "AutoClicker", "B", "duplicate", `${cpsValues[duplicateIndex]} cps`);
            // Update the last flagged timestamp to the current time
            lastFlaggedTimeB.set(player.name, duplicateTime);
            return;
        }
    }

    // Check for low standard deviation
    const stdDev = Statistics.getDeviation(cpsValues);
    if (stdDev < MIN_STD_DEV) {
        flag(player, "AutoClicker", "B", "deviation", `${stdDev}, average=${averageCps} cps`);
    }
}