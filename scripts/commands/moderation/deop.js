import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";

/**
 * De-ops a player in the world based on the provided message and arguments.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the deop event.
 * @param {Array} args - The arguments provided for the deop command, where args[0] is the target player name.
 * @throws {TypeError} If the message or args are not of type "object".
 */
export function deop(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (typeof args !== "object") throw new TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to deop.`);
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
        if (pl.name.toLowerCase().includes(args[0]?.toLowerCase().replace(/"|\\|@/g, ""))) {
            member = pl;
            break;
        }
    }

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Ensure the target player has the "op" tag
    if (!member.hasTag("op")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThis player doesn't have Rosh-Op.`);
        return;
    }

    // Remove "op" status and notify
    removeOp(member);
    member.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas removed §8${member.name}'s §cRosh-Op status"}]}`);

    // Log the de-op event
    data.recentLogs.push(`§8${member.name} §chas been de-oped by §8${player.name}§c!`);
}

/**
 * Removes the "op" tag from a player and notifies them.
 * @param {Minecraft.Player} player - The player to de-op.
 */
export function removeOp(player) {
    let themecolor = config.themecolor;
    player.removeTag("op");
    player.sendMessage(`§r${themecolor}Rosh §j> §cYou have been de-opped! Warning: If this is wrong contact your server admin!`);
}