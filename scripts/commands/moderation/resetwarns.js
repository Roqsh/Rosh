import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Resets the warning count for a specified player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the resetwarns command.
 * @param {Array} args - The arguments provided for the resetwarns command, where args[0] is the target player name.
 * @throws {TypeError} If the message is not of type "object".
 */
export function resetwarns(message, args) {
    // Validate message
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);

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
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to unban.`);
        return;
    }

    let member;

    // Find the target player by name
    for (const pl of world.getPlayers()) {
        if (pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
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

    // Notify staff members and reset warnings
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas reset §8${member.nameTag}'s §cwarns!"}]}`);
    member.runCommandAsync("function tools/resetwarns");
}