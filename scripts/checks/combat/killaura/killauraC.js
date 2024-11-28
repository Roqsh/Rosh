import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for attacking multiple entities at once.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Player | Minecraft.Entity} entity - The attacked entity.
 */
export function killauraC(player, entity) {

    if (!config.modules.killauraC.enabled) return;

    const TIME_WINDOW = config.modules.killauraC.timeWindow;
    let THRESHOLD = config.modules.killauraC.entities || 2;
    if (THRESHOLD < 2) THRESHOLD = 2;

    const now = Date.now();

    // Initialize tracking data if it doesn't exist.
    if (!player.killauraData) {
        player.killauraData = {
            startTime: now,       // Track the start time of the first hit
            entitiesHit: new Set() // Use a Set to track unique entities hit
        };
    }

    const { entitiesHit, startTime } = player.killauraData;

    // Add the entity to the set of hit entities.
    entitiesHit.add(entity.id);

    // Calculate the elapsed time since the first hit in this window.
    const elapsedTime = now - startTime;

    // Check if the number of unique hit entities exceeds the configured threshold within the time window.
    if (entitiesHit.size >= THRESHOLD) {
        if (elapsedTime <= TIME_WINDOW) {
            // Flag the player if the threshold is met within the time window.
            flag(player, "Killaura", "C", "entities", `${entitiesHit.size}, ${elapsedTime}ms`);
        }
    }

    // Only reset the tracking data if 50 ms (1 tick) have passed.
    if (elapsedTime > TIME_WINDOW) { 
        player.killauraData = {
            startTime: now,
            entitiesHit: new Set()
        };
    }
}