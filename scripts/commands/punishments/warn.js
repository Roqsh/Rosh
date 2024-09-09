import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import data from "../../data/data.js";
import { timeDisplay, findPlayerByName, endsWithNumberInParentheses } from "../../util.js";

/**
 * Warns a player for a specified reason and kicks them if they reach the warning limit.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the warn event.
 * @param {Array<string>} args - The arguments provided for the warn command, where args[0] is the target player name, and the rest is the reason.
 * @remarks When a player gets warned 3 times, they will be kicked.
 */
export function warn(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to warn.`);
        return;
    }

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to warn.`);
        return;
    }

    // Construct the reason from the remaining args
    const reason = args.slice(1).join(" ") || "No reason specified";

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Prevent warning oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cWhy would you want to warn yourself?`);
        return;
    }

    // Prevent warning other staff members
    if (member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot warn other staff members.`);
        return;
    }

    // Warn the player and update the warning count
    if (!data.warnings[member.id]) data.warnings[member.id] = 0;

    data.warnings[member.id]++;
    let warningCount = data.warnings[member.id];

    // Define the warning display
    const warningMessages = [
        `§j[${themecolor}|§8||§j]`,
        `§j[${themecolor}||§8|§j]`
    ];

    switch (warningCount) {
        case 1:
            // Default warning message
            member.sendMessage(`§r${themecolor}Rosh §j> §cHey! Please refrain from your current behavior. You have been warned by §8${player.name} §cfor §8${reason}§c. ${warningMessages[warningCount - 1]}`);
            break;
        case 2:
            // Warning message for second warning
            member.sendMessage(`§r${themecolor}Rosh §j> §cHey! One more warn will get you kicked! You have been warned by §8${player.name} §cfor §8${reason}§c. ${warningMessages[warningCount - 1]}`);
            break;
        case 3:
            // Kick the player after third warning
            delete data.warnings[member.id]; // Remove the player from warnings data
            member.kick(`${themecolor}Rosh §j> §cYou have been kicked for §8Accumulating of 3 warnings§c.`);
            break;
        default:
            // In case of any unexpected value, reset the warning count
            data.warnings[member.id] = 0;
            break;
    }

    // Notify the initiator about the warn and log it
    if (warningCount < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou have warned §8${member.name} §cfor §8${reason}§c. ${warningMessages[warningCount - 1]}`);
        data.recentLogs.push(`${timeDisplay()}§8${member.name} §chas been warned by §8${player.name}§c!`);
    } else {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou have kicked §8${member.name} §cfor accumulating 3 warnings.`);
        data.recentLogs.push(`${timeDisplay()}§8${member.name} §chas been kicked for §83 warnings!`);
    }
}