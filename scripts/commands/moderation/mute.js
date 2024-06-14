import * as Minecraft from "@minecraft/server";
import { animation } from "../../util";
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * Mutes a player in the world based on the provided message and arguments.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the mute event.
 * @param {Array} args - The arguments provided for the mute command, where args[0] is the target player name, and the rest is the reason.
 * @throws {TypeError} If the message or args are not of type "object".
 */
export function mute(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (typeof args !== "object") throw new TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to mute.`);
        return;
    }

    // Check if target player name is valid
    if (args[0].length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to unban.`);
        return;
    }

    // Construct the reason from the remaining args
    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
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

    // Prevent muting oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot mute yourself.`);
        return;
    }

    // Add "isMuted" tag and notify the muted player
    member.addTag("isMuted");
    member.sendMessage(`§r${themecolor}Rosh §j> §cYou have been muted for §8${reason}`);

    // Execute the mute command
    member.runCommandAsync("ability @s mute true");

    // Run the animation and notify other staff members about the mute
    animation(player, 5);
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas muted §8${member.nameTag} §cfor §8${reason}"}]}`);
    
    // Log the mute event
    data.recentLogs.push(`§8${member.nameTag} §chas been muted by §8${player.nameTag}§c!`);
}