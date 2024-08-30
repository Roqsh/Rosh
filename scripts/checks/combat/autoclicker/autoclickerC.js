import * as Minecraft from "@minecraft/server";
import { Statistics, EvictingList } from "../../../utils/math.js";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

// Map to store each player's CPS history for AutoClicker/C
const playerCpsHistoryC = new Map();

/**
 * Checks for a variety of suspicious integer CPS value changes.
 * Only proceeds if the player's average CPS is above the configured threshold.
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclicker_c(player) {
    
    if (!config.modules.autoclickerC.enabled) return;

    const SAMPLES = config.modules.autoclickerC.samples; // Number of CPS samples to consider
    const MIN_INT_CHANGES = config.modules.autoclickerC.minIntChanges; // The minimum number of integer changes to flag
    const MIN_AVERAGE_CPS = config.modules.autoclickerC.minAverageCps; // Minimum average CPS to proceed with checks

    // Get or create the player's EvictingList for CPS history
    if (!playerCpsHistoryC.has(player.name)) {
        playerCpsHistoryC.set(player.name, new EvictingList(SAMPLES));
    }
    const cpsHistory = playerCpsHistoryC.get(player.name);

    // Add the current CPS to the history
    cpsHistory.add(Date.now(), player.getCps());

    // Retrieve all stored CPS values
    const cpsValues = cpsHistory.getAll().map(entry => entry.value);

    // If we don't have enough data yet, return early
    if (cpsValues.length < SAMPLES) return;

    // Calculate the average CPS
    const averageCps = Statistics.getMean(cpsValues);

    // If the average CPS is below the minimum threshold, return early
    if (averageCps < MIN_AVERAGE_CPS) return;

    // Filter out integer CPS values and calculate the differences between consecutive values
    let integerCount = 0;
    let integerChangeCount = 0;
    let cpsDifferences = [];

    for (let i = 1; i < cpsValues.length; i++) {
        if (Number.isInteger(cpsValues[i])) {
            integerCount++;
        }
        const difference = Math.abs(cpsValues[i] - cpsValues[i - 1]);
        if (difference !== 0) {
            cpsDifferences.push(difference);
            if (Number.isInteger(difference)) {
                integerChangeCount++;
            }
        }
    }

    // Flag if there are too many integer CPS values
    if (integerCount >= MIN_INT_CHANGES) {
        flag(player, "AutoClicker", "C", "integers", `Count: ${integerCount}, Values: ${cpsValues.join(', ')}`);
        return;
    }

    // Flag if there are too many integer CPS differences
    if (integerChangeCount >= MIN_INT_CHANGES) {
        flag(player, "AutoClicker", "C", "integer-changes", `Count: ${integerChangeCount}, Differences: ${cpsDifferences.join(', ')}`);
        return;
    }

    // Check if the standard deviation is an integer and flag if so
    const stdDev = Statistics.getStandardDeviation(cpsValues);
    if (Number.isInteger(stdDev)) {
        flag(player, "AutoClicker", "C", "integer-deviation", stdDev);
    }
}