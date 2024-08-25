import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore, setScore, debug } from "../../../util";

/**
 * Checks for suspicious icy-bridging behavior per 20 ticks.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Block} block - The placed block.
 */
export function scaffold_f(player, block) {

    if (!config.modules.scaffoldF.enabled || player.isFlying) return;

    const { x: px, y: py, z: pz } = player.location;
    const { x: bx, y: by, z: bz } = block.location;

    const distance = Math.hypot(bx - px, by - py, bz - pz);
    const velocityY = player.getVelocity().y;
    const blockIsBelow = by < py;

    // Detect potential icy bridging behavior
    if (distance < 1.85 && blockIsBelow && velocityY < 0.3) {
        const currentBlockCount = getScore(player, "currentBlockAmount", 0);
        setScore(player, "currentBlockAmount", currentBlockCount + 1);
    }
}

/**
 * Checks if the number of placed blocks exceeds the threshold per 20 ticks.
 * @param {Minecraft.Player} player - The player to check.
 * @param {number} tick - A tick in the range of 1-20. (Not system.currentTick)
 */
export function scaffold_f_dependency(player, tick) {

    if (!config.modules.scaffoldF.enabled) return;

    const currentBlockCount = getScore(player, "currentBlockAmount", 0);

    // Perform the check on the 20th tick (end of a second)
    if (tick === 20 && currentBlockCount > 0) {

        const maxAllowedBlocks = 7 + determineThreshold(player);
        const colorCode = currentBlockCount > maxAllowedBlocks ? "§c" : "§a";
        
        if (currentBlockCount > maxAllowedBlocks) {
            flag(player, "Scaffold", "F", "amount", currentBlockCount);
        }

        debug(player, "Blocks", `${colorCode}${currentBlockCount} §8bps §j(max: §n${maxAllowedBlocks}§j)`, "bps");
        
        // Reset block count after each check
        setScore(player, "currentBlockAmount", 0);
    }
}

/**
 * Determines the threshold to add to 'maxAllowedBlocks' based on the player's speed effect.
 * @param {Minecraft.Player} player - The player to check.
 * @returns {number} The additional blocks to allow.
 */
function determineThreshold(player) {
    
    const speedEffect = player.getEffect("speed");

    if (speedEffect) {
        const amplifier = speedEffect.amplifier;
        return 1 + amplifier * 1.2; // Speed I adds 1, Speed II adds 2.2, etc.
    }

    return 0; // No speed effect
}