import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { timeDisplay, findPlayerByName, tellStaff } from "../../util.js";

/**
 * Unmutes a specified player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the unmute event.
 * @param {Array<string>} args - The arguments provided for the unmute command, where args[0] is the target player name and args[1] (optional) is the reason.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function unmute(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to unmute.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = targetName.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to unmute.`);
        return;
    }

    // Construct the reason from the remaining args
    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Remove the "isMuted" tag and notify the player
    member.removeTag("isMuted");
    member.sendMessage(`§r${themecolor}Rosh §j> §aYou have been unmuted.`);

    // Execute the unmute command
    member.runCommandAsync("ability @s mute false");

    // Notify other staff members about the unmute
    tellStaff(`§r${themecolor}Rosh §j> §8${player.nameTag} §ahas unmuted §8${member.nameTag} §afor §8${reason}`);

    // Log the unmute event
    data.recentLogs.push(`${timeDisplay()}§8${member.nameTag} §ahas been unmuted by §8${player.nameTag}§a!`);
}