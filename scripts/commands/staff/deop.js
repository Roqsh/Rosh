import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { timeDisplay, getPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util.js";

/**
 * Revokes operator status from a specified player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the deop event.
 * @param {Array} args - The arguments provided for the deop command, where args[0] is the target player name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function deop(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to deop.`);
        return;
    }

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to deop.`);
        return;
    }

    // Find the target player by name
    const member = getPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Prevent deopping oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou can't deop yourself.`);
        return;
    }

    // Ensure the target player has operator status
    if (!member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThis player doesn't have Operator status.`);
        return;
    }

    // Remove operator status and notify other staff members
    removeOp(member);
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas removed §8${member.name}'s §cOperator status.`);

    // Log the de-op event
    data.recentLogs.push(`${timeDisplay()}§8${member.name} §chas been de-oped by §8${player.name}§c!`);
}

/**
 * Revokes operator status from a player.
 * @param {Minecraft.Player} player - The player to be revoked of operator status.
 */
export function removeOp(player) {
    const themecolor = config.themecolor;
    player.setOp(false);
    player.sendMessage(`§r${themecolor}Rosh §j> §cWarning: Your Operator status has been revoked!`);
}