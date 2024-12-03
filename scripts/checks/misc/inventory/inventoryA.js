import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

// Initialize player buffer
const playerBuffer = new Map();

/**
 * Checks for a cursor item in invalid scenarios.
 * @param {Minecraft.Player} player - The player to check.
 */
export function inventoryA(player) {

    if (!config.modules.inventoryA.enabled) return;

    const currentCursorItem = player.getItemInCursor();
    const lastCursorItem = player.getLastItemInCursor();

    // Check if the player is in an invalid state
    const isInvalidState = player.isSneaking || player.isSprinting || player.isSwimming || player.isSleeping || player.isDead() || player.hasTag("attacking") || player.hasTag("placing") || player.hasTag("breaking");

    // Get or initialize the player's buffer
    let buffer = playerBuffer.get(player.id) || 0;
 
    if (currentCursorItem && lastCursorItem && isInvalidState) {
        buffer++;  // Increment the buffer

        // Flag the player if the buffer reaches 3
        if (buffer >= 3) {
            flag(player, "Inventory", "A", "cursor item", `${currentCursorItem.typeId}`);
            buffer = 0;  // Reset the buffer after flagging
        }
    }

    // Store the updated buffer
    playerBuffer.set(player.id, buffer);
}