import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { Statistics } from "../../../utils/Statistics.js";

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
 * @param {Number} lagValue - The value used for lag adjustment. (1=normal)
 * @helper
 * - Thank you **@yellowworld777** (Github) for the original detection idea! <3
 * - Github: https://github.com/yellowworld777/Timer-Calculator
 */
export function timerA(player, lagValue) {

    if (!config.modules.timerA.enabled || player.isDead()) return;

    const previousPosition = player.getLastPosition();
    const currentPosition = player.location;

    // Calculate the velocity and speed
    const velocity = player.getVelocity();
    const calcVelocity = calculateVelocity(currentPosition, previousPosition);

    const serverSpeed = calculateSpeed(calcVelocity);
    const clientSpeed = calculateSpeed(velocity);

    if (clientSpeed === 0) return; // Avoid division by zero

    const speedRatio = serverSpeed / clientSpeed;
    const adjustedTimer = (speedRatio * 20) / lagValue;

    // Initialize timerHold if it doesn't exist
    player.timerHold = player.timerHold || [];
    player.timerHold.push(adjustedTimer);

    // Check if sufficient samples are collected
    const requiredSamples = config.modules.timerA.requiredSamples || 20;
    if (player.timerHold.length < requiredSamples) {
        return;
    }

    // Calculate average timer value
    const averageTimer = Statistics.getMean(player.timerHold);

    debug(player, "Timer", `${averageTimer} §j(§8V:${lagValue}§j)`, "timer-debug");

    // Retrieve previous timer data
    const previousTimerData = timerData.get(player.name);

    if (previousTimerData) {

        const { strict, timer_level: TimerLevel, timer_level_low: TimerLevelLow } = config.modules.timerA;
        let { timer_level: timerLevel, timer_level_low: timerLevelLow } = config.modules.timerA;

        // Adjust levels based on "strict" mode
        if (strict && player.hasTag("strict") && TimerLevel >= 21 && TimerLevelLow <= 19) {
            timerLevel - 0.25;
            timerLevelLow + 0.25;
        }

        // Flag player if the timer value is outside acceptable bounds
        const outOfBounds =
            (previousTimerData.t > timerLevel && averageTimer > timerLevel) ||
            (previousTimerData.t < timerLevelLow && averageTimer < timerLevelLow);

        if (outOfBounds) {
            
            // Account for potential false positives
            if (player.isOnShulker || player.isRiding() || player.hasTag("ender_pearl")) {
                player.addTag("rosh:timer_bypass");
            }

            if (!player.hasTag("rosh:timer_bypass")) {
                flag(player, "Timer", "A", "timer", averageTimer);
            }
        }
    }

    if (!player.hasTag("rosh:timer_bypass")) {
        timerData.set(player.name, { t: averageTimer });
    }

    // Clear the timerHold array for the next round of samples
    player.timerHold = [];
}