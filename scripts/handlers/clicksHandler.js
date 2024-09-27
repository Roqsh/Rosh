import * as Minecraft from "@minecraft/server";
import { debug } from "../util";

/**
 * Calculates and assigns the player's clicks per second (CPS) if conditions are met.
 * This function is called every game tick and calculates CPS once every second (20 ticks).
 * 
 * @param {Minecraft.Player} player - The player whose CPS is being checked and calculated.
 * @param {number} tick - The current game tick within the range of 1 to 20 (1 tick = 1/20th of a second).
 * @returns { { currentCps: number } | false } Returns the current calculated cps for further processing, or false if conditions are not met.
 */
export function clicksHandler(player, tick) {

    // Perform CPS calculation at the end of a full second (i.e., 20 ticks) if the player has recorded any clicks
    if (tick === 20 && player.clicks > 0) { 

        // Calculate CPS as the number of clicks divided by the elapsed time in seconds
        const currentCps = player.clicks / ((Date.now() - player.lastTime) / 1000); // 1000ms = 1 second = 20 ticks

        // Output the calculated CPS for debugging purposes
        debug(player, "Cps", currentCps, "cps");

        // Update the player's CPS value
        player.setCps(currentCps);

        // Return the current CPS value to update getLastCps() after checks have run
        return { currentCps };
    }

    // Conditions for CPS calculation were not met, so autoclicker checks should not proceed
    return false;
}