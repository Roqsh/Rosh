import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for placing too many blocks in a single tick.
 * @param {Minecraft.Player} player - The player to check.
 * @param {object} blockPlaceCounts - Stores the number of blocks and the last tick time.
 */
export function scaffold_e(player, blockPlaceCounts) {
    
    if (!config.modules.scaffoldE.enabled || player.isFlying) return;

    // With butterflying, 2 placements per tick are achievable
    const AMOUNT = config.modules.scaffoldE.amount;

    const currentTime = Date.now();

    // Initialize block place count for the player if not already set
    if (!blockPlaceCounts[player.id]) {
        blockPlaceCounts[player.id] = { count: 0, lastTickTime: currentTime };
    }

    const playerData = blockPlaceCounts[player.id];
    const timeDifference = currentTime - playerData.lastTickTime;

    // If more than 50ms have passed, reset the count
    if (timeDifference > 50) { // 50ms = 1 tick
        playerData.count = 0;
        playerData.lastTickTime = currentTime;
    }

    playerData.count++;

    // Check if the count exceeds the threshold
    if (playerData.count > AMOUNT) {
        flag(player, "Scaffold", "E", "placements", `${playerData.count}, ${timeDifference}ms`);
    }
}