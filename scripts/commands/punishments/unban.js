import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { timeDisplay, endsWithNumberInParentheses, tellStaff } from "../../util.js";

/**
 * Adds a player to the unban queue with an optional reason.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the unban event.
 * @param {Array<string>} args - The arguments provided for the unban command, where args[0] is the target player name and args[1] (optional) is the reason.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function unban(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide who to unban.`);
        return;
    }

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide a valid player to unban.`);
        return;
    }

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";

    // Check if the member is already in the unban queue
    if (data.unbanQueue.includes(targetName)) {
        player.sendMessage(`${themecolor}Rosh §j> §8${targetName} §cis already queued for an unban.`);
        return;
    }

    // Prevent unbanning oneself
    if (targetName === player.name) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou cannot unban yourself.`);
        return;
    }

    // Add member to the unban queue
    data.unbanQueue.push(targetName);

    // Remove the ban information from data.banList
    delete data.banList[targetName];

    // Notify other staff members about the unban request
    tellStaff(`${themecolor}Rosh §j> §8${player.name} §ahas added §8${targetName} §ato the unban queue for: §8${reason}§a.`);

    // Log the unban event
    data.recentLogs.push(`${timeDisplay()}§8${targetName} §ahas been unbanned by §8${player.name}§a!`);
}