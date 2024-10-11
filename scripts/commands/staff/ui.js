import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Gives the player the UI item.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the ui command.
 * @throws {TypeError} If message is not an object.
 */
export function ui(message) {
    // Validate the input
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;
    
    // Get the player's inventory component
    const container = player.getComponent("inventory")?.container;

    // Return if there's no space for the UI item
    if (container.emptySlotsCount === 0) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYour inventory is full!`);
        return;
    }

    // Get the currently held item
    const currentItem = player.getItemInHand();

    // Ensure the player doesn't have the UI item in their current slot
    if (
        currentItem?.typeId === config.customcommands.ui.ui_item && 
        currentItem?.nameTag === config.customcommands.ui.ui_item_name
    ) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou already have the UI item in your current slot!`);
        return;
    }

    // Create the item that opens the UI
    let itemType = Minecraft.ItemTypes.get(config.customcommands.ui.ui_item);
    let didError = false;

    if (!itemType) {
        console.error(`Unable to create item type, most likely the item name is invalid. Defaulted to using stone axe.`);       
        didError = true;
        itemType = Minecraft.ItemTypes.get("minecraft:stone_axe");
    }

    const item = new Minecraft.ItemStack(itemType, 1);
    item.nameTag = config.customcommands.ui.ui_item_name; 

    // Add an enchantment to the item
    try {
        const enchantableComponent = item.getComponent("enchantable");
        const unbreakingEnchantment = new Minecraft.EnchantmentType("unbreaking");
        enchantableComponent.addEnchantment({ type: unbreakingEnchantment, level: 3 });
    } catch (error) {
        console.error("Failed to add enchantment to the UI item:", error);
    }

    // Add the item to the player's inventory
    container.addItem(item);

    // Notify the player that the UI item has been given to them or alert them if an error happened
    player.sendMessage(`§r${themecolor}Rosh §j> §aThe UI item has been given to you.${didError ? "\n§cThere was an error trying to create the custom UI item. The UI item has been defaulted to a stone axe." : ""}`);
}