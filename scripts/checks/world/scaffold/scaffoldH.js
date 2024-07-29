import config from "../../../data/config.js";
import { flag } from "../../../util";

const blockIdQueue = new Map();

/**
 * Checks for invalid held blocks.
 * @name scaffold_h
 * @param {player} player - The player to check.
 * @remarks Runs in the before event.
 */
export async function scaffold_h(player) {

    if (!config.modules.scaffoldH.enabled) return;

    try {

        // Get the player's inventory component
        const container = player.getComponent('inventory')?.container;
        if (!container) return;

        // If all slots in the inventory are empty, flag
        if (container.emptySlotsCount === 36) {
            flag(player, "Scaffold", "H", "inventory", "empty");
        }

        let emptySlotCounter = 0;

        // Count empty slots in the player's hotbar
        for (let hotbarSlot = 0; hotbarSlot < 9; hotbarSlot++) {
            const item = container.getItem(hotbarSlot);
            if (!item) emptySlotCounter++;
        }

        // If all slots in the hotbar are empty, flag
        if (emptySlotCounter === 9) {
            flag(player, "Scaffold", "H", "hotbar", "empty");
        }

        const selectedSlot = player.selectedSlotIndex;
        const selectedItem = container.getItem(selectedSlot);

        // If the amount of the held item is smaller than 1, flag
        if (selectedItem.amount < 1) {
            flag(player, "Scaffold", "H", "heldItem", `${selectedItem.typeId}, amount=${selectedItem.amount}`);
        }

        // Ensure block ID queue exists for the player
        if (!blockIdQueue.has(player.name)) {
            blockIdQueue.set(player.name, []);
        }

        // Add the current block ID to the player's queue
        const playerQueue = blockIdQueue.get(player.name);

        playerQueue.push(selectedItem.typeId);
        blockIdQueue.set(player.name, playerQueue);

    } catch (error) {
        const themecolor = config.themecolor;
        console.warn(`§r${themecolor}Rosh §j> §cThere was an error while trying to run §8scaffold_h§c:\n§8${error}\n${error.stack}`);
    }
}

/**
 * Used to check for non-matching Ids for Scaffold/H.
 * @name dependencies_h
 * @param {player} player - The player to check.
 * @param {block} block - The block being placed.
 * @remarks Runs in the after event. (Depends on scaffold_h)
 */
export async function dependencies_h(player, block) {

    if (!config.modules.scaffoldH.enabled) return;

    try {

        // Placing two slabs combines into a double slab block, leading to a false positive
        if (!block.isSolid || /slab\d*$/.test(block.typeId)) {

            // Remove the first element from the queue after the check
            const playerQueue = blockIdQueue.get(player.name);
            playerQueue.shift();
            blockIdQueue.set(player.name, playerQueue);
            return;
        }

        // Ensure block ID queue exists for the player
        if (!blockIdQueue.has(player.name)) {
            blockIdQueue.set(player.name, []);
        }

        const playerQueue = blockIdQueue.get(player.name);

        // If the player's held item does not match the placed block, flag
        if (!playerQueue.includes(block.typeId)) {
            flag(player, "Scaffold", "H", "heldItem", `${playerQueue.length > 0 ? playerQueue.join(', ') : 'none'}, placedBlock=${block.typeId}`);
        }

        // Remove the first element from the queue after the check
        playerQueue.shift();
        blockIdQueue.set(player.name, playerQueue);

    } catch (error) {
        const themecolor = config.themecolor;
        console.warn(`§r${themecolor}Rosh §j> §cThere was an error while trying to run §8dependencies_h§c:\n§8${error}\n${error.stack}`);
    }
}