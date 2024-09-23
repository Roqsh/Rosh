import * as Minecraft from "@minecraft/server";
import { EvictingList } from "../../../utils/EvictingList.js";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

// Map to store each player's CPS history for AutoClicker/A
const playerCpsHistory = new Map();

/**
 * Checks if a player's CPS exceeds the allowed threshold multiple times.
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclickerA(player) {
    
    if (!config.modules.autoclickerA.enabled) return;

    const SAMPLES = config.modules.autoclickerA.samples; // Number of CPS samples to store
    const MAX_CPS = config.modules.autoclickerA.cps; // Number of CPS values to consider as cheating
    const MIN_HIGH_CPS_EVENTS = config.modules.autoclickerA.threshold; // Maximum amount of exceeding the allowed CPS threshold before punishment
    const MAX_TIME_DIFF = config.modules.autoclickerA.maxTimeDiff; // Time difference between two CPS values that exceeded the theshold to consider legitamite

    // Initialize CPS history for the player if not already present
    if (!playerCpsHistory.has(player.name)) {
        playerCpsHistory.set(player.name, new EvictingList(SAMPLES));
    }
    const cpsHistory = playerCpsHistory.get(player.name);

    // Add the current CPS with its timestamp to the player's history
    const currentTime = Date.now();
    const currentCps = player.getCps();
    cpsHistory.add(currentTime, currentCps);

    // Retrieve all the stored CPS values along with their timestamps
    const cpsValues = cpsHistory.getAll();

    // Filter out the CPS values that exceed the maximum allowed CPS
    const excessiveCpsEntries = cpsValues.filter(entry => entry.value > MAX_CPS);

    // Return early if there are not enough high CPS events
    if (excessiveCpsEntries.length < MIN_HIGH_CPS_EVENTS) return;

    // Check if the time difference between consecutive high CPS events is too large
    for (let i = 1; i < excessiveCpsEntries.length; i++) {
        if (excessiveCpsEntries[i].key - excessiveCpsEntries[i - 1].key > MAX_TIME_DIFF) {
            return; // Early return if the time difference is too large
        }
    }

    // Flag the player if the number of excessive CPS entries meets or exceeds the threshold
    flag(player, "AutoClicker", "A", "cps", excessiveCpsEntries[excessiveCpsEntries.length - 1].value);

    // Remove flagged entries from history to prevent future false positives
    excessiveCpsEntries.forEach(entry => cpsHistory.remove(entry.key));
}