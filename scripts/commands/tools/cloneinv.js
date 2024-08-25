import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { findPlayerByName, endsWithNumberInParentheses } from "../../util.js";

/**
 * Clones another players inventory.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function cloneinv(message, args) {
    // Validate message and args
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide whos inventory to clone.`);
        return;
    }
    
    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to clone their inventory.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Check if the target player is the same as the player
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cWhy would you want to clone your own inventory?`);
        return;
    }

    // Get the inventory of the player and member
    const playerInv = player.getComponent('inventory')?.container;
    const memberInv = member.getComponent('inventory')?.container;

    // Check if the inventory is empty
    if (memberInv.emptySlotsCount === 36) {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name}'s §cinventory is empty.`);
        return;
    }

    // Clone inventory
    for (let i = 0; i < memberInv.size; i++) {
        const item = memberInv.getItem(i);
        playerInv.setItem(i, item ?? undefined);
    }

    player.sendMessage(`§r${themecolor}Rosh §j> §aYou have cloned §8${member.name}'s §ainventory.`);
}