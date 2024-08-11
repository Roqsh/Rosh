import * as Minecraft from "@minecraft/server";
import { timeDisplay, parseTime, findPlayerByName, tellStaff } from "../../util.js";
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * Bans a player from the world based on the provided message and arguments.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the ban event.
 * @param {Array<string>} args - The arguments provided for the ban command, where args[0] is the target player name, args[1] (optional) is the duration, and the rest is the reason.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function ban(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to ban.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = player.name.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to ban.`);
        return;
    }

    // Parse the ban duration if provided
    const time = args[1] ? parseTime(args[1]) : undefined;
    const untilDate = time ? new Date(Date.now() + time) : null;
    const duration = untilDate ? `${args[1]} (Until ${untilDate.toLocaleString()})` : "Permanent";
    args.splice(1, 1); // Remove time argument

    // Construct the reason from the remaining args
    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Queue the player for a ban if he is not online
    if (!member) {

        // Check if the member is already in the ban queue
        if (targetName in data.banList) {
            player.sendMessage(`§r${themecolor}Rosh §j> §8${targetName} §cis already banned.`);
            return;
        }

        // Notify other staff members about the ban request
        tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas added §8${targetName} §cto the ban queue for: §8${reason}§c, §8${duration}§c.`);

        // Log the ban event
        data.recentLogs.push(`${timeDisplay()}§8${targetName} §chas been banned by §8${player.name}§c!`);

        // Save all ban-related information
        data.banList[targetName] = {
            bannedBy: player.name,
            date: new Date().toLocaleString(),
            reason: reason,
            duration: duration
        };

        return;
    }

    // Prevent banning oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban yourself.`);
        return;
    }

    // Prevent banning other staff members
    if (member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban other staff members.`);
        return;
    }

    // Remove existing ban-related tags
    member.getTags().forEach(t => {
        if (t.includes("Reason:") || t.includes("Length:")) {
            member.removeTag(t);
        }
    });

    // Add new ban-related tags
    member.addTag(`Reason:${reason}`);
    if (typeof time === "number") member.addTag(`Length:${Date.now() + time}`);
    member.addTag("isBanned");

    // Notify other staff members about the ban
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas banned §8${member.name} §cfor: §8${reason}§c, §8${duration}§c.`);

    // Log the ban event
    data.recentLogs.push(`${timeDisplay()}§8${member.name} §chas been banned by §8${player.name}§c!`);

    // Save all ban-related information
    data.banList[member.name] = {
        bannedBy: player.name,
        date: new Date().toLocaleString(),
        reason: reason,
        duration: duration
    };
}