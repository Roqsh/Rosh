import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { timeDisplay, setScore, findPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util";

/**
 * Resets the warning count for a specified player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the resetwarns command.
 * @param {Array} args - The arguments provided for the resetwarns command, where args[0] is the target player name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function resetwarns(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who's warns to reset.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to reset his warns.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Prevent resetting own warnings
    if (member.id === player.id) {
        player.sendMessage("§r§uRosh §j> §cYou cannot reset your own warns.");
        return;
    }

    // Notify staff members and reset the players warns
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ahas reset §8${member.name}'s §awarns!`);

    resetWarns(member);

    // Log the reset warns event
    data.recentLogs.push(`${timeDisplay()}§8${member.name}'s §awarns have been reset by §8${player.name}§a!`);
}

/**
 * Sets all violation volumes of a specific player back to zero.
 * @param {object} player - The player object.
 */
export function resetWarns(player) {
    // Declare all violations
    const violations = [
        "killauravl", "reachvl", "hitboxvl", "aimvl", "autoclickervl", "autoshieldvl", 
        "autototemvl", "badpacketsvl", "badenchantsvl", "crashervl", "cbevl", "exploitvl", "illegalitemsvl", 
        "spammervl", "fastusevl", "autotoolvl", "namespoofvl", "timervl", 
        "motionvl", "strafevl", "flyvl", "speedvl", "noslowvl", "invalidsprintvl", "invalidjumpvl", 
        "invmovevl", "scaffoldvl", "nukervl", "towervl"
    ];

    for (const violation of violations) {
        // Reset the score for each violation
        setScore(player, violation, 0);
    }
}