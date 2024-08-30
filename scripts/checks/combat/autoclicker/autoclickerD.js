import * as Minecraft from "@minecraft/server";
import { Statistics, EvictingList } from "../../../utils/math.js";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

// Map to store each player's CPS history
const playerCpsHistoryD = new Map();

/**
 * Detects suspicious periodic spikes in CPS.
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclicker_d(player) {

    if (!config.modules.autoclickerD.enabled) return;

    const SAMPLES = config.modules.autoclickerD.samples; // Number of CPS samples to consider
    const SPIKE_THRESHOLD = config.modules.autoclickerD.spikeThreshold; // Threshold for detecting CPS spikes
    const MIN_AVERAGE_CPS = config.modules.autoclickerD.minAverageCps; // Minimum average CPS to proceed with checks

    // Initialize history if it doesn't exist for this player
    if (!playerCpsHistoryD.has(player.name)) {
        playerCpsHistoryD.set(player.name, new EvictingList(SAMPLES));
    }

    const cpsHistory = playerCpsHistoryD.get(player.name);

    // Retrieve current CPS
    const currentCps = player.getCps();
    cpsHistory.add(Date.now(), currentCps);

    // Retrieve all stored entries (timestamps and CPS values)
    const allEntries = cpsHistory.getAll();
    const cpsValues = allEntries.map(entry => entry.value);
    const timestamps = allEntries.map(entry => entry.key);
    const averageCps = Statistics.getMean(cpsValues);

    // If we don't have enough data yet, return early
    if (cpsValues.length < 3) return;

    // If the average CPS is below the minimum threshold, return early
    if (averageCps < MIN_AVERAGE_CPS) return;

    for (let i = 0; i < cpsValues.length; i++) {
        const isFirst = i === 0;
        const isLast = i === cpsValues.length - 1;

        // Use the current, previous, and next CPS values for spike detection
        const previousCps = isFirst ? cpsValues[i] : cpsValues[i - 1];
        const spikeValue = cpsValues[i];
        const nextCps = isLast ? cpsValues[i] : cpsValues[i + 1];

        const previousTimestamp = isFirst ? timestamps[i] : timestamps[i - 1];
        const spikeTimestamp = timestamps[i];
        const nextTimestamp = isLast ? timestamps[i] : timestamps[i + 1];

        // Detect a spike if the current value exceeds both previous and next values by the threshold
        const spikeDetected = 
            spikeValue > previousCps + SPIKE_THRESHOLD &&
            spikeValue > nextCps + SPIKE_THRESHOLD;

        if (spikeDetected) {
            flag(player, "AutoClicker", "D", "spike", `${previousCps.toFixed(1)}, ${spikeValue.toFixed(2)}, ${nextCps.toFixed(1)}`);
            
            // Remove the spike and all preceding entries
            let indexToRemove = timestamps.indexOf(spikeTimestamp);
            if (indexToRemove !== -1) {
                // Remove the spike and all entries before it
                while (indexToRemove >= 0) {
                    cpsHistory.remove(timestamps[indexToRemove]);
                    indexToRemove--;
                }
            }
            break; // Exit the loop after handling the detected spike
        }
    }
}