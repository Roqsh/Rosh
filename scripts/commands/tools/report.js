import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { timeDisplay, getPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util.js";

/**
 * Reports a player for a given reason.
 * @param {object} message - The message object containing the sender information.
 * @param {Minecraft.Player} message.sender - The player who initiated the report command.
 * @param {Array<string>} args - The arguments passed with the command. The first element should be the target player's name, followed by the reason.
 * @throws {TypeError} If the message or args are not of the expected type.
 */
export function report(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;
    const reason = args.slice(1).join(" ") || "No reason provided";

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide who to report or type §8!reportui§c.`);
        return;
    }

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide a valid player to report.`);
        return;
    }

    // Find the target player by name
    const member = getPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {

        // Prevent double reporting
        if (player.reports.includes(targetName)) {
            player.sendMessage(`${themecolor}Rosh §j> §cYou have already reported this player.`);
            return;
        }

        // Add the player to the reported players list to prevent double reporting
        player.reports.push(targetName);

        // Inform the player about their report
        player.sendMessage(`${themecolor}Rosh §j> §aThank you for your report! Our staff will review it shortly. (§8${targetName}§a, §8${reason}§a)`);

        // Notify other staff members about the report
        tellStaff(`${themecolor}Rosh §j> §8${player.name} §ahas reported §8${targetName} §afor: §8${reason}§a.`);

        // Log the report
        data.recentLogs.push(`${timeDisplay()}§8${targetName} §chas been reported by §8${player.name}§c!`);

        // Save all important aspects of the report
        data.reports[targetName] = {
            reportedBy: player.name,
            date: new Date().toLocaleString(),
            ms: Date.now(),
            reason: reason,
            status: "unresolved"
        };

        return;
    }

    // Prevent reporting oneself
    if (member.id === player.id) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou cannot report yourself.`);
        return;
    }

    // Prevent double reporting
    if (player.reports.includes(member.name)) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou have already reported this player.`);
        return;
    }

    // Add the player to the reported players list to prevent double reporting
    player.reports.push(member.name);

    // Mark the player as reported
    member.addTag("reported");

    // Inform the player about their report
    player.sendMessage(`${themecolor}Rosh §j> §aThank you for your report! Our staff will review it shortly. (§8${member.name}§a, §8${reason}§a)`);

    // Notify other staff members about the report
    tellStaff(`${themecolor}Rosh §j> §8${player.name} §ahas reported §8${member.name} §afor: §8${reason}§a.`);

    // Log the report
    data.recentLogs.push(`${timeDisplay()}§8${member.name} §chas been reported by §8${player.name}§c!`);

    // Save all important aspects of the report
    data.reports[targetName] = {
        reportedBy: player.name,
        date: new Date().toLocaleString(),
        ms: Date.now(),
        reason: reason,
        status: "unresolved"
    };
}