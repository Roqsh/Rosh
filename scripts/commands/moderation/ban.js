import * as Minecraft from "@minecraft/server";
import { parseTime } from "../../util.js";
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
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to ban.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    // Check if target player name is valid
    if (targetName.length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to ban.`);
        return;
    }

    // Parse the ban duration if provided
    const time = args[1] ? parseTime(args[1]) : undefined;
    args.splice(1, 1); // Remove time argument

    // Construct the reason from the remaining args
    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";

    // Find the target player by name
    let member = null;
    for (const pl of world.getPlayers()) {
        if (pl.name.toLowerCase().includes(targetName)) {
            member = pl;
            break;
        }
    }

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Prevent banning oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban yourself.`);
        return;
    }

    // Prevent banning other staff members
    if (member.hasTag("op")) {
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
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas banned §8${member.nameTag} §cfor §8${reason}"}]}`);

    // Log the ban event
    data.recentLogs.push(`§8${member.nameTag} §chas been banned by §8${player.name}§c!`);
}