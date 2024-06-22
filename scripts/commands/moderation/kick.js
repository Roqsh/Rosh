import * as Minecraft from "@minecraft/server"; 
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * Kicks a player from the world based on the provided message and arguments.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the kick event.
 * @param {Array<string>} args - The arguments provided for the kick command, where args[0] is the target player name, and the rest is the reason.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function kick(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to kick.`);
        return;
    }

    // Check if target player name is valid
    if (args[0].length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to kick.`);
        return;
    }

    let isSilent = false;

    // Check for silent kick option
    if (args[1] === "-s" || args[1] === "-silent") {
        isSilent = true;
        args.splice(1, 1); // Remove silent flag from arguments
    }

    // Construct the reason from the remaining args
    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";

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

    // Prevent kicking oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot kick yourself.`);
        return;
    }

    // Prevent kicking other staff members
    if (member.hasTag("op")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot kick other staff members.`);
        return;
    }

    // Notify other staff members about the kick
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas kicked §8${member.name} §c${isSilent ? "(Silent) " : ""}for: §8${reason}"}]}`);

    // Log the kick event
    data.recentLogs.push(`§8${member.name} §chas been kicked ${isSilent ? "(Silent) " : ""}by §8${player.nameTag}§c!`);

    // Perform the kick command if not silent
    if (!isSilent) {
        player.runCommandAsync(`kick "${member.name}" §r${themecolor}Rosh §j> §cYou have been kicked for §8${reason}§c!`);
        return;
    } else {
        // Trigger the silent kick event without notifying the kicked user
        member.triggerEvent("scythe:kick");
    }  
}