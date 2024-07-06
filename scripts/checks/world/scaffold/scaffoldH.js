import config from "../../../data/config.js";
import data from "../../../data/data.js";
import { flag } from "../../../util";

//const counter = new Map();

/**
 * Checks for invalid held blocks.
 * @name scaffold_h
 * @param {player} player - The player to check
 * @remarks [WIP] The not-matching block Id check has an 
 * issue with not always having the stored Id in the array,
 * leading to a false flag with heldItem = none .
 */
export function scaffold_h(player) {

    if (!config.modules.scaffoldH.enabled) return;

    try {
        // Get the player's inventory component
        const container = player.getComponent('inventory')?.container;
        if (!container) return;

        // If all slots in the inventory are empty, flag
        if (container.emptySlotsCount === 36) {
            flag(player, "Scaffold", "H", "inventory", "empty");
        }

        // Count empty slots in the player's hotbar
        let emptySlotCounter = 0;
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

        // Ensure blockId array exists and clear it before adding the new ID
        //if (!Array.isArray(data.blockId)) {
            //data.blockId = [];
        //}
        //data.blockId = [selectedItem.typeId];  // Directly assigning a new array with the current ID

        //if (counter.has(player.name)) {
            //counter.set(player.name, { n: counter.get(player.name).n + 1 });
        //} else {
            //counter.set(player.name, { n: 1 });
        //}

        //player.sendMessage(`§r§uDebug §j> Id: §8${selectedItem.typeId} §nx${counter.get(player.name)?.n}`);
        //player.sendMessage(`§r§uDebug §j> Current blockId array: §8${data.blockId.join(', ')}`);

    } catch (error) {
        //const themecolor = config.themecolor;
        //player.sendMessage(`§r${themecolor}Rosh §j> §cThere was an error while trying to run Scaffold/H:\n§8${error}\n${error.stack}`);
    }
}

/**
 * Used to check for non matching Ids for Scaffold/H.
 * @name dependencies_h
 * @param {player} player - The player to check
 * @remarks Depends on Scaffold/H
 */
export function dependencies_h(player, block) {
    if (!config.modules.scaffoldH.enabled) return;

    try {
        // Ensure blockId array exists
        if (!Array.isArray(data.blockId)) {
            data.blockId = [];
        }

        //player.sendMessage(`§r§uDebug §j> Checking placed block: §8${block.typeId} §jagainst held Ids: §8${data.blockId.join(', ')}`);

        // If the player's held item does not match the placed block, flag
        if (!data.blockId.includes(block.typeId)) {
            flag(player, "Scaffold", "H", "heldItem", `${data.blockId.length > 0 ? data.blockId.join(', ') : 'none'}, placedBlock=${block.typeId}`);
        }

        // Reset the stored Id after the check
        player.sendMessage(`§r§uDebug §j> Resetting blockId array after check`);
        data.blockId = [];  // Directly assigning a new empty array

    } catch (error) {
        //const themecolor = config.themecolor;
        //player.sendMessage(`§r${themecolor}Rosh §j> §cThere was an error while trying to run dependencies_h:\n§8${error}\n${error.stack}`);
    }
}