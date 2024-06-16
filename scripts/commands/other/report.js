import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * Reports a player for a given reason.
 * @param {object} message - The message object containing the sender information.
 * @param {Array<string>} args - The arguments passed with the command. The first element should be the target player's name, followed by the reason.
 * @throws {TypeError} If the message or args are not of the expected type.
 */
export function report(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;
    const reason = args.slice(1).join(" ") || "No reason provided";

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to report.`);
        return;
    }

    // Check if target player name is valid
    if (args[0].length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to report.`);
        return;
    }
    
    const targetName = args[0].toLowerCase().replace(/"|\\|@/g, "");
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

    // Prevent reporting oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot report yourself.`);
        return;
    }
    
    // Prevent double reporting
    if (player.reports.includes(member.name)) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou have already reported this player.`);
        return;
    }

    // Add the player to the reported players list to prevent double reporting
    player.reports.push(member.name);

    // Mark the player as reported
    member.addTag("reported");

    // Inform the player about their report
    player.sendMessage(`§r${themecolor}Rosh §j> §aYou have reported §8${member.name} §afor §8${reason}§a.`);

    // Notify other staff members about the report
    player.runCommandAsync(`tellraw @a[tag=notify, tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §ahas reported §8${member.name} §afor §8${reason}§a."}]}`);

    // Log the report
    data.recentLogs.push(`§8${member.name} §chas been reported by §8${player.name}§c!`);
}