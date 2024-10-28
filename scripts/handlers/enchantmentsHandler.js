import * as Minecraft from "@minecraft/server";

/**
 * Gathers player inventory items and their enchantments.
 * @param {Minecraft.Player} player - The player whose inventory is checked.
 * @returns {Array} An array of objects with item details and enchantments.
 */
export function enchantmentsHandler(player) {

    // Get the player's inventory container
    const playerInventory = player.getComponent("minecraft:inventory")?.container;
    const inventory = []; // Initialize an array to store inventory data

    // Loop through each slot in the player's inventory (0-35)
    for (let slot = 0; slot < 36; slot++) {
        // Get the item in the current slot
        const item = playerInventory.getItem(slot);

        if (item) {
            // Retrieve enchantments for the item if it is enchantable
            const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];
            const enchantments = itemEnchants.map(enchantment => ({
                typeId: enchantment.type.id, // Enchantment type identifier
                level: enchantment.level // Enchantment level
            }));
            // Add item details and enchantments to the inventory array
            inventory.push({ slot, typeId: item.typeId, amount: item.amount, enchantments });

        } else {
            // If the slot is empty, push null to maintain slot order
            inventory.push(null);
        }
    }

    return inventory; // Return the assembled inventory data
}