import { Player } from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getSpeed, getScore } from "../../../util";

// Stores the buffer values for each player.
const playerBuffer = new Map();

/**
 * Checks if the player is not slowing down when using an item.
 * @param {Player} player - The player to check.
 */
export function noslow_a(player) {

    // Exit early if the NoSlow A module is disabled or the player isn't using an item.
    if (!config.modules.noslowA.enabled || !player.hasTag("right")) return;

    // Retrieve configuration settings with fallback defaults.
    const MAX_SPEED = config.modules.noslowA.max_speed || 0.1;
    const ITEM_USE_TIME = config.modules.noslowA.item_use_time || 10; // In ticks
    const BUFFER_LIMIT = config.modules.noslowA.buffer || 4;

    // Get the current speed of the player.
    const speed = getSpeed(player);
    if (speed === 0) return; // No need to check further if the player isn't moving.

    // Get the player's id and current buffer value.
    const playerId = player.id;
    const buffer = playerBuffer.get(playerId) || 0;

    // Object containing all conditions for flagging the player.
    const conditions = {
        isNotDamaged: !player.hasTag("damaged"),
        isNotUsingTrident: !player.isHoldingTrident,
        isNotOnSpecialBlocks: !player.isOnIce && !player.isSlimeBouncing(),
        isNotInAirOrWater: !player.isGliding && !player.isFlying && !player.isInWater,
        isOnGroundAndUsingItem: player.isOnGround && getScore(player, "right", 0) >= ITEM_USE_TIME,
        isExceedingMaxSpeed: speed > MAX_SPEED,
    };

    // Determine if all conditions are met.
    const canFlag = Object.values(conditions).every(Boolean);

    if (canFlag) {
        
        // If the buffer exceeds the limit, flag the player and reset the buffer.
        if (buffer >= BUFFER_LIMIT) {
            flag(player, "NoSlow", "A", "speed", speed, true);
            playerBuffer.set(playerId, 0);
        } else {
            // Otherwise, increment the buffer.
            playerBuffer.set(playerId, buffer + 1);
        }

    } else {
        // Decrease the buffer if conditions are not met, but not below 0.
        playerBuffer.set(playerId, Math.max(buffer - 1, 0));
    }
}