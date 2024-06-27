import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Clears a player's ender chest inventory.
 * @param {object} message - The message object containing the sender's information.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function ecwipe(message, args) {
    // Validate message and args
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (args.length === 0) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who's ender chest inventory to wipe.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    // Check if target player name is valid
    if (targetName.length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to clear their ender chest.`);
        return;
    }

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

    // Prevent clearing your own ender chest
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot clear your own ender chest.`);
        return;
    }

    // Prevent clearing the ender chest of other staff members
    if (member.hasTag("op")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot clear other staff members' ender chests.`);
        return;
    }

    clearEnderchest(member);

    // Notify other staff members about the ender chest wipe
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas cleared §8${member.name}'s §cender chest."}]}`);
}

/**
 * Clears all 26 slots of somebody's ender chest.
 * @param {object} player - The player object.
 */
export function clearEnderchest(player) {
    // Clear the ender chest inventory of the target player
    for (let i = 0; i <= 26; i++) {
        player.runCommandAsync(`replaceitem entity @s slot.enderchest ${i} air`);
    }
}