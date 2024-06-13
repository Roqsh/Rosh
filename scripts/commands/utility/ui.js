import * as Minecraft from "@minecraft/server";
import { EnchantmentType } from "@minecraft/server";
import config from "../../data/config.js";

/**
 * @name ui
 * @param {object} message - Message object
*/

export function ui(message) {

    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    
    const player = message.sender;
    let themecolor = config.themecolor;
    
    // get the player's inventory component
    const container = player.getComponent("inventory").container;

    if(container.emptySlotsCount === 0)
        return player.sendMessage(`§r${themecolor}Rosh §j> §cYour inventory is full!`);

    // make sure they dont have the UI item in their current slot
    const currentItem = container.getItem(player.selectedSlot);

    if(currentItem?.typeId === config.customcommands.ui.ui_item && currentItem?.nameTag === config.customcommands.ui.ui_item_name)
        return player.sendMessage(`§r${themecolor}Rosh §j> §cYou already have the UI item in your inventory!`);

    // creating the item that opens the UI
    let itemType = Minecraft.ItemTypes.get(config.customcommands.ui.ui_item);
    let didError = false;

    if(!itemType) {
        console.error(`Unable to create item type, most likely the item name is invalid. Defaulted to using wooden axe.`);       
        didError = true;
        itemType = Minecraft.ItemTypes.get("minecraft:wooden_axe");
    }

    const item = new Minecraft.ItemStack(itemType, 1);

    item.nameTag = config.customcommands.ui.ui_item_name;
   
    item.getComponent("enchantable")?.addEnchantment({type: new EnchantmentType("unbreaking"), level: 3});
   
    container.addItem(item);

    player.sendMessage(`§r${themecolor}Rosh §j> §aThe UI item has been given to you.${didError === true ? "\n§cThere was an error trying to create the custom UI item. The UI item has been defaulted to a wooden axe." : ""}`);
}