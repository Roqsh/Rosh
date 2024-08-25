import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { timeDisplay, findPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util.js";

/**
 * Grants operator status to a specified player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the op command.
 * @param {Array} args - The arguments provided for the op command, where args[0] is the target player name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function op(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;
    
    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to op.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to op.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Check if the player already has operator status
    if (member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThis player already has Operator status.`);
        return;
    }
    
    // Add operator status and notify other staff members
    addOp(member);
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ahas given §8${member.name} §aOperator status.`);

    // Log the op event
    data.recentLogs.push(`${timeDisplay()}§8${member.name} §ahas been oped by §8${player.name}§a!`);
}

/**
 * Grants operator status to a player.
 * @param {Minecraft.Player} player - The player to be granted operator status.
 */
export function addOp(player) {
    const themecolor = config.themecolor;
    player.setOp(true);
    player.sendMessage(`§r${themecolor}Rosh §j> §aYou are now an Operator.`);
}