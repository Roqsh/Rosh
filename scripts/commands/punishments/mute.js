import * as Minecraft from "@minecraft/server";
import { animation, timeDisplay, findPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util.js";
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * Mutes a player in the world based on the provided message and arguments.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the mute event.
 * @param {Array<string>} args - The arguments provided for the mute command, where args[0] is the target player name, and the rest is the reason.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function mute(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to mute.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to mute.`);
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

    // Prevent muting oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot mute yourself.`);
        return;
    }

    // Prevent muting other staff members
    if (member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot mute other staff members.`);
        return;
    }

    // Add "isMuted" tag and notify the muted player
    member.addTag("isMuted");
    member.sendMessage(`§r${themecolor}Rosh §j> §cYou have been muted for: §8${reason}§c.`);

    // Run the animation
    animation(member, 5);

    // Notify other staff members about the mute
    tellStaff(`§r${themecolor}Rosh §j> §8${player.nameTag} §chas muted §8${member.nameTag} §cfor: §8${reason}§c.`);
    
    // Log the mute event
    data.recentLogs.push(`${timeDisplay()}§8${member.nameTag} §chas been muted by §8${player.nameTag}§c!`);
}