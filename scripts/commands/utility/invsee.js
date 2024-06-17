import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Lets you view another player's inventory.
 * @param {object} message - The message object containing the sender's information.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function invsee(message, args) {
    // Validate message and args
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (args.length === 0) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide whose inventory to view.`);
        return;
    }

    const targetName = args[0].toLowerCase().replace(/"|\\|@/g, "");

    // Check if target player name is valid
    if (targetName.length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to view their inventory.`);
        return;
    }

    // Find the target player by name
    let member = null;
    for (const pl of world.getPlayers()) {
        if (pl.name.toLowerCase().includes(targetName)) {
            member = pl;
            break;
        }
    }

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Get the player's inventory component
    const container = member.getComponent('inventory')?.container;
  
    // Check if the player's inventory is empty
    if (container.emptySlotsCount === 36) {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name}'s §cinventory is empty.`);
        return;
    }

    // Initialize the inventory message
    let inventory = `§r${themecolor}Rosh §j> §8${member.name}'s §aInventory:\n`;
    
    // Loop through each slot in the player's inventory
    for (let i = 0; i < 36; i++) {
        const item = container.getItem(i);

        // Skip empty slots
        if (!item) continue;

        // Add item details to the inventory message
        inventory += `§r§aSlot §8${i}§a: §8${item.typeId} ${item.amount}x`;
    
        const enchantments = item.getComponent("enchantable")?.getEnchantments() ?? [];
    
        // Check if enchantments exist before accessing them
        if (enchantments && Array.isArray(enchantments)) {
            // Loop through each enchantment on the item
            for (const enchantment of enchantments) {
                let enchantmentName = enchantment.type.id;

                // Add enchantment details to the inventory message
                inventory += `§a, §8${enchantmentName} ${enchantment.level}`;
            }
        }
           
        // Jump to the next line
        inventory += `\n`;      
    }

    // Send the inventory details to the player
    player.sendMessage(inventory);
}