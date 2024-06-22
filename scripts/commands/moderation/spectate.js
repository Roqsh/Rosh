import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Allows a player to spectate another player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the spectate command.
 * @param {Array} args - The arguments provided for the spectate command, where args[0] is the target player name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function spectate(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "array".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to spectate.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    // Check if target player name is valid
    if (targetName.length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to get their stats from.`);
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

    // Set player's game mode to spectator and teleport them to the member
    player.runCommandAsync(`gamemode spectator @s`);
    player.teleport(member.location, {
        checkForBlocks: false,
        dimension: member.dimension
    });

    // Send confirmation message to the player
    player.sendMessage(`§r${themecolor}Rosh §j> §aYou are now spectating §8${member.name}§a!`);
}