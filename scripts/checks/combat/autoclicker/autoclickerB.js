import * as Minecraft from "@minecraft/server";
import { Statistics, EvictingList } from "../../../utils/math.js";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

// Map to store each player's CPS history for AutoClicker/B
const playerCpsHistoryB = new Map();

/**
 * Checks for suspiciously low deviation or duplicate CPS.
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclicker_b(player) {

    if (!config.modules.autoclickerB.enabled) return;

    const SAMPLES = config.modules.autoclickerB.samples;
    const MAX_DUPLICATES = config.modules.autoclickerB.maxDuplicates;
    const MIN_STD_DEV = config.modules.autoclickerB.minStdDev;
    const MIN_AVERAGE_CPS = config.modules.autoclickerD.minAverageCps;

    // Get or create the player's EvictingList for CPS history
    if (!playerCpsHistoryB.has(player.name)) {
        playerCpsHistoryB.set(player.name, new EvictingList(SAMPLES));
    }
    const cpsHistory = playerCpsHistoryB.get(player.name);

    // Add the current CPS to the history
    cpsHistory.add(Date.now(), player.getCps());
    const cpsValues = cpsHistory.getAll().map(entry => entry.value);

    // If we don't have enough data yet, return early
    if (cpsValues.length < SAMPLES) return;

    // Calculate mean CPS using the new method
    const averageCps = Statistics.getMean(cpsValues);
    if (averageCps < MIN_AVERAGE_CPS) return;

    // Check for duplicate CPS values using the new method
    if (Statistics.checkConsecutiveDuplicates(cpsValues, MAX_DUPLICATES)) {
        flag(player, "AutoClicker", "B", "duplicates", `${MAX_DUPLICATES + 1}, (${cpsValues[cpsValues.length - 1]} cps)`);
        return;
    }

    // Check for low standard deviation
    const stdDev = Statistics.getStandardDeviation(cpsValues);
    if (stdDev < MIN_STD_DEV) {
        flag(player, "AutoClicker", "B", "deviation", `${stdDev}, average=${averageCps} cps`);
    }
}