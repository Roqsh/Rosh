import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore, setScore, debug } from "../../../util";

/**
 * Checks for suspicious icy-bridging behaviour per 20 ticks.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The placed block.
 */
export function scaffold_f(player, block) {

    if (!config.modules.scaffoldF.enabled) return;

    if (player.isFlying) return;

    const distance = Math.sqrt(
        Math.pow(block.location.x - player.location.x, 2) + 
        Math.pow(block.location.y - player.location.y, 2) + 
        Math.pow(block.location.z - player.location.z, 2)
    );

    const velocity = player.getVelocity();
    const below = block.location.y < player.location.y;

    // Placing directly infront (icy bridging) requires high cps and can be an indication of cheating when done very fast and consistent
    if (distance < 1.85 && below && velocity.y < 0.3) {
        const currentBlockAmount = getScore(player, "currentBlockAmount", 0);
        setScore(player, "currentBlockAmount", currentBlockAmount + 1);
    }
}

/**
 * Checks if the amount of placed blocks exceeds the threshold per 20 ticks.
 * @param {Minecraft.Player} player - The player to check.
 * @param {number} tick - A tick in the range of 1-20. (Not system.currentTick) 
 */
export function scaffold_f_dependency(player, tick) {

    if (!config.modules.scaffoldF.enabled) return;

    const currentBlockAmount = getScore(player, "currentBlockAmount", 0);

    // Perform the check in the last tick of the second (20th tick)
    if (tick === 20 && currentBlockAmount > 0) {

        const maxBlockAmount = 7 + determineThreshold(player);

        if (currentBlockAmount > maxBlockAmount) {
            flag(player, "Scaffold", "F", "amount", currentBlockAmount);
        } 

        debug(player, "Blocks", `${currentBlockAmount > maxBlockAmount ? "§c" : "§a"}${currentBlockAmount} §8bps §j(max: §n${maxBlockAmount}§j)`, "bps");
        setScore(player, "currentBlockAmount", 0);
    }
}

/**
 * Determines the threshold to add to 'maxBlockAmount' based on the player's speed effect.
 * @param {Minecraft.Player} player - The player to check.
 * @returns {number} The amount of blocks to add to 'maxBlockAmount'.
 */
function determineThreshold(player) {

    const speedEffect = player.getEffect("speed");
    
    if (speedEffect) {
        const amplifier = speedEffect.amplifier;
        const exponentialGrowth = amplifier * 0.2;
        return 1 + exponentialGrowth + amplifier; // Speed I adds 1, Speed II adds 2, etc.
    }

    return 0; // No speed effect
}