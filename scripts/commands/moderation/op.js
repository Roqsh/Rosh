import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * Grants operator status (Rosh-Op) to a specified player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the op command.
 * @param {Array} args - The arguments provided for the op command, where args[0] is the target player name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function op(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;
    
    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to op.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    // Check if target player name is valid
    if (targetName.length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to op.`);
        return;
    }
    
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

    // Check if the player is already an operator
    if (member.hasTag("op")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThis player already has Rosh-Op.`);
        return;
    }
    
    // Add operator status and notify other staff members
    addOp(member);
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §ahas given §8${member.name} §aRosh-Op."}]}`);

    // Log the op event
    data.recentLogs.push(`§8${member.name} §ahas been oped by §8${player.name}§a!`);
}

/**
 * Grants operator status to a player.
 * @param {Minecraft.Player} player - The player to be granted operator status.
 */
export function addOp(player) {
    const themecolor = config.themecolor;
    player.addTag("op");
    player.sendMessage(`§r${themecolor}Rosh §j> §aYou are now Rosh-Op.`);
}

/**
 * Revokes operator status from a player.
 * @param {Minecraft.Player} player - The player to be revoked of operator status.
 */
export function removeOp(player) {
    const themecolor = config.themecolor;
    player.removeTag("op");
    player.sendMessage(`§r${themecolor}Rosh §j> §cYou have been de-opped! Warning: If this is wrong contact your server admin!`);
}