import * as Minecraft from "@minecraft/server";
import { EvictingList, Statistics } from "../../../utils/math.js";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

// Map to store each player's CPS history for AutoClicker/E
const playerCpsHistoryE = new Map();

/**
 * Detects oscillating CPS patterns.
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclicker_e(player) {

    if (!config.modules.autoclickerE.enabled) return;

    const SAMPLES = config.modules.autoclickerE.samples; // Number of CPS samples to store
    const MINIMUM_PATTERN_FREQUENCY = config.modules.autoclickerE.minimumPatternFrequency; // Minimum oscillation pattern frequency (default 70%)
    const OSCILLATION_THRESHOLD = config.modules.autoclickerE.oscillationThreshold; // Threshold for detecting oscillation in CPS
    const MIN_AVERAGE_CPS = config.modules.autoclickerE.minAverageCps; // Minimum average CPS to proceed with checks

    // Initialize CPS history for the player if not already present
    if (!playerCpsHistoryE.has(player.name)) {
        playerCpsHistoryE.set(player.name, new EvictingList(SAMPLES));
    }
    const cpsHistory = playerCpsHistoryE.get(player.name);

    // Add the current CPS with its timestamp to the player's history
    const currentTime = Date.now();
    const currentCps = player.getCps();
    cpsHistory.add(currentTime, currentCps);

    // Retrieve all stored entries (CPS values)
    const allEntries = cpsHistory.getAll();
    const cpsValues = allEntries.map(entry => entry.value);
    const averageCps = Statistics.getMean(cpsValues);

    // Ensure we have enough samples before performing checks
    if (cpsValues.length < SAMPLES) return;

    // Check if the average CPS meets the minimum threshold
    if (averageCps < MIN_AVERAGE_CPS) return;

    // Detect regular oscillations within CPS data
    let oscillationCount = 0;
    for (let i = 2; i < cpsValues.length; i++) {
        const oscillates = 
            (cpsValues[i] > cpsValues[i-1] && cpsValues[i-1] < cpsValues[i-2]) ||
            (cpsValues[i] < cpsValues[i-1] && cpsValues[i-1] > cpsValues[i-2]);

        if (oscillates && Math.abs(cpsValues[i] - cpsValues[i-2]) <= OSCILLATION_THRESHOLD) {
            oscillationCount++;
        }
    }

    // Calculate the frequency of oscillations
    const oscillationFrequency = oscillationCount / (cpsValues.length - 2);

    // Calculate additional statistics: range
    const minCps = Math.min(...cpsValues).toFixed(2);
    const maxCps = Math.max(...cpsValues).toFixed(2);
    const cpsRange = (maxCps - minCps).toFixed(2);

    // If the oscillation frequency exceeds the threshold, flag the player
    if (oscillationFrequency >= MINIMUM_PATTERN_FREQUENCY) {
        flag(player, "AutoClicker", "E", "oscillation-frequency", `${oscillationFrequency.toFixed(2)}, oscillation-range=${cpsRange}`);
    }
}