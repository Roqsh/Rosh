import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { findPlayerByName } from "../../util.js";

/**
 * Gives a player the ability to fly.
 * @name fly
 * @param {object} message - The message object containing the sender's information.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export async function fly(message, args) {
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
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to let fly.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    const minNameLength = 3;
    const maxNameLength = player.name.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to let him fly.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    const checkGmc = world.getPlayers({
        excludeGameModes: [Minecraft.GameMode.creative, Minecraft.GameMode.spectator],
        name: member.name
    });

    // Handle case where the target player is already in creative mode
    if (![...checkGmc].length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThis player is in creative which already allows flying by default.`);
        return;
    }

    // Toggle flying ability for the target player
    if (member.hasTag("flying")) {
        await member.removeTag("flying");
        await member.runCommandAsync("ability @s mayfly false");
        member.sendMessage(`§r${themecolor}Rosh §j> §cYou are no longer in fly mode.`);
    } else {
        await member.addTag("flying");
        await member.runCommandAsync("ability @s mayfly true");
        member.sendMessage(`§r${themecolor}Rosh §j> §aYou are now in fly mode.`);
    }

    // Notify the initiator
    if (member.hasTag("flying")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §acan now fly.`);
    } else {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §ccan no longer fly.`);
    }
}