import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";

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
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who's warns to reset.`);
        return;
    }

    // Check if target player name is valid
    if (args[0].length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to reset his warns.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());
    
    let member = null;

    // Find the target player by name
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

    // Prevent resetting own warnings
    if (member.id === player.id) {
        player.sendMessage("§r§uRosh §j> §cYou cannot reset your own warns.");
        return;
    }

    // Notify staff members and reset the players warns
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §ahas reset §8${member.name}'s §awarns!"}]}`);
    member.runCommandAsync("function tools/resetwarns");

    // Log the reset warns event
    data.recentLogs.push(`§8${member.name}'s §awarns have been reset by §8${player.name}§a!`);
}