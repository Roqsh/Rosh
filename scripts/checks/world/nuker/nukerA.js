import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util.js";

let blockBreakCounts = {};

/**
 * Checks for breaking too many blocks within a tick.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The block being broken.
 */
export function nukerA(player, block) {

    if (!config.modules.nukerA.enabled || player.getEffect("haste") || player.getGameMode() === "creative") return;

    const MAX_BLOCKS = config.modules.nukerA.maxBlocks;
    const currentTime = Date.now();

    // Initialize player-specific data if not already set
    if (!blockBreakCounts[player.id]) {
        blockBreakCounts[player.id] = { count: 0, lastTickTime: currentTime };
    }

    const playerData = blockBreakCounts[player.id];
    const timeDifference = currentTime - playerData.lastTickTime;

    // Reset the count if more than 50ms (1 tick) have passed
    if (timeDifference > 50) {
        playerData.count = 0;
        playerData.lastTickTime = currentTime;
    }

    playerData.count++;

    // Check if the count exceeds the threshold
    if (playerData.count > MAX_BLOCKS) {
        flag(player, "Nuker", "A", "breakings", `${playerData.count}, ${timeDifference}ms`);
    }
}