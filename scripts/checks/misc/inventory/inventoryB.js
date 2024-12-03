import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

// In-memory store for tracking inventories per player
const playerInventoryMap = new Map();

/**
 * Flags invalid inventory transactions.
 * @param {Minecraft.Player} player - The player to check.
 * 
 * **TODO:**
 * - Ignore script interactions
 * - Ignore /clear 'player' 'item' 'slot' 'amount' command, /clear 'player' is fine
 * - Ignore middle click (moves an item from the inventory to the hotbar without having the inventory open)
 */
export function inventoryB(player) {

    if (!config.modules.inventoryB.enabled) return;

    // Get the player's current inventory for slots 9-36
    const currentInventory = getPlayerInventory(player, 9, 36);

    // Get the player's last known inventory
    const lastInventory = playerInventoryMap.get(player.id);

    if (lastInventory) {
        let anyItemRemaining = false;
        let anyItemMissingChangedOrReduced = false;
        let changedSlots = [];

        for (let slot = 9; slot <= 36; slot++) {
            const currentItem = currentInventory[slot];
            const lastItem = lastInventory[slot];

            // Ignore if the slot is empty in both states
            if (!currentItem && !lastItem) continue;

            // Track if any item still remains
            if (currentItem) {
                anyItemRemaining = true;
            }

            // Check for changes in item type or amount that indicate invalid transactions
            if (
                (!currentItem && lastItem) || // item removed
                (currentItem && lastItem && currentItem.typeId !== lastItem.typeId) || // item type changed
                (currentItem && lastItem && currentItem.amount < lastItem.amount) // item amount reduced
            ) {
                changedSlots.push({
                    slot,
                    from: lastItem ? `${lastItem.typeId} (x${lastItem.amount})` : 'empty',
                    to: currentItem ? `${currentItem.typeId} (x${currentItem.amount})` : 'empty'
                });

                anyItemMissingChangedOrReduced = true;
            }
        }

        // Check if the player is in an invalid state
        const isInvalidState = player.isSneaking || player.isSprinting || player.isSwimming || player.isSleeping || player.isDead() || player.hasTag("attacking") || player.hasTag("placing") || player.hasTag("breaking");

        // Only flag if some items are missing, changed or reduced AND if at least one item remains
        if (anyItemRemaining && anyItemMissingChangedOrReduced && isInvalidState) {
            let slotDetails = changedSlots.map(
                slotInfo => `Slot ${slotInfo.slot}: ${slotInfo.from} -> ${slotInfo.to}`
            ).join(", ");

            flag(player, "Inventory", "B", "invalid changes", `${slotDetails}`);
        }
    }

    // Update the stored inventory to the current state
    playerInventoryMap.set(player.id, currentInventory);
}

/**
 * Get the player's inventory in the specified slot range.
 * @param {Minecraft.Player} player - The player to check.
 * @param {number} start - The start slot (inclusive).
 * @param {number} end - The end slot (inclusive).
 * @returns {Array} The player's inventory in the given range.
 */
function getPlayerInventory(player, start, end) {

    const inventory = [];
    const playerInventory = player.getComponent("minecraft:inventory")?.container;

    for (let slot = start; slot < end; slot++) {
        const item = playerInventory.getItem(slot);
        inventory[slot] = item ? { typeId: item.typeId, amount: item.amount } : null;
    }

    return inventory;
}