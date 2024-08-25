import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { findPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util.js";

/**
 * Clears a player's ender chest inventory.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function ecwipe(message, args) {
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
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who's ender chest inventory to wipe.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to clear their ender chest.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Prevent clearing your own ender chest
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot clear your own ender chest.`);
        return;
    }

    // Prevent clearing the ender chest of other staff members
    if (member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot clear other staff members' ender chests.`);
        return;
    }

    clearEnderchest(member);

    // Notify other staff members about the ender chest wipe
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas cleared §8${member.name}'s §cender chest.`);
}

/**
 * Clears all 26 slots of somebody's ender chest.
 * @param {object} player - The player object.
 */
export function clearEnderchest(player) {
    // Clear the ender chest inventory of the target player
    for (let slot = 0; slot <= 26; slot++) {
        player.runCommandAsync(`replaceitem entity @s slot.enderchest ${slot} air`);
    }
}