import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { Statistics } from "../../../utils/math.js";

// Map to store timer data for each player
const timerData = new Map();

/**
 * Calculate the velocity between two positions.
 * @param {Object} current - The current position.
 * @param {Object} previous - The previous position.
 * @returns {Object} The velocity components (x, y, z).
 */
function calculateVelocity(current, previous) {
    return {
        x: current.x - previous.x,
        y: current.y - previous.y,
        z: current.z - previous.z
    };
}

/**
 * Calculate the speed from velocity components.
 * @param {Object} velocity - The velocity components (x, y, z).
 * @returns {Number} The calculated speed.
 */
function calculateSpeed(velocity) {
    return Math.hypot(velocity.x, velocity.z, velocity.y);
}

/**
 * Analyze and flag players based on abnormal timer behavior.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Object} lastPosition - The player's last recorded position.
 * @param {Number} value - The value used for lag adjustment. (1=normal)
 */
export function timer_a(player, lastPosition, value) {

    // Ensure that lastPosition is always set after the first execution
    if (!player.lastPosition) {
        player.lastPosition = { ...player.location };
        return;  // Return early since we can't perform the check yet
    }

    if (!config.modules.timerA.enabled) return;

    // Early return if player has specific tags that should bypass the timer check
    const bypassTags = ["riding"];
    if (bypassTags.some(tag => player.hasTag(tag))) return;

    // Calculate the velocity and speed
    const velocity = player.getVelocity();
    const calcVelocity = calculateVelocity(player.location, player.lastPosition);

    const serverSpeed = calculateSpeed(calcVelocity);
    const clientSpeed = calculateSpeed(velocity);

    if (clientSpeed === 0) return; // Avoid division by zero

    const speedRatio = serverSpeed / clientSpeed;
    const adjustedTimer = (speedRatio * 20) / value;

    // Initialize timerHold if it doesn't exist
    player.timerHold = player.timerHold || [];
    player.timerHold.push(adjustedTimer);

    // Check if sufficient samples are collected
    const requiredSamples = config.modules.timerA.requiredSamples || 20;
    if (player.timerHold.length < requiredSamples) {
        player.lastPosition = { ...player.location }; // Update lastPosition
        return;
    }

    // Calculate average timer value
    const averageTimer = Statistics.getMean(player.timerHold);

    let timerValue = averageTimer;
    if (player.timerHold.length >= 24) {
        timerValue += 2; // Additional adjustment for larger sample sizes
    }

    debug(player, "Timer", `${timerValue} §j(§8V:${value}§j)`, "timer-debug");

    // Retrieve previous timer data
    const previousTimerData = timerData.get(player.name);

    if (previousTimerData) {

        let { timer_level: timerLevel, timer_level_low: timerLevelLow } = config.modules.timerA;

        // Adjust levels based on "strict" mode
        if (config.modules.timerA.strict && player.hasTag("strict")) {
            timerLevel - 0.25;
            timerLevelLow + 0.25;
        }

        // Flag player if the timer value is outside acceptable bounds
        const outOfBounds =
            (previousTimerData.t > timerLevel && timerValue > timerLevel) ||
            (previousTimerData.t < timerLevelLow && timerValue < timerLevelLow);

        if (outOfBounds) {
            
            // Account for potential false positives
            if (player.isOnShulker || Math.abs(player.lastPosition.y - player.location.y) > 10 || player.hasTag("ender_pearl")) {
                player.addTag("timer_bypass");
            }

            if (!player.hasTag("timer_bypass")) {
                flag(player, "Timer", "A", "timer", timerValue);
            }
        }
    }

    if (!player.hasTag("timer_bypass")) {
        timerData.set(player.name, { t: timerValue });
    }

    // Clear the timerHold array for the next round of samples
    player.timerHold = [];

    // Update the last position
    player.lastPosition = { ...player.location };
}