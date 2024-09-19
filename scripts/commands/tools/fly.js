import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { getPlayerByName, endsWithNumberInParentheses } from "../../util.js";

/**
 * Gives a player the ability to fly.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @remarks **Requires the education edition toggle to be turned on.**
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
        player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide who to let fly.`);
        return;
    }

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide a valid player to let him fly.`);
        return;
    }

    // Find the target player by name
    const member = getPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    const checkGmc = world.getPlayers({
        excludeGameModes: [Minecraft.GameMode.creative, Minecraft.GameMode.spectator],
        name: member.name
    });

    // Handle case where the target player is already in creative mode
    if (![...checkGmc].length) {
        player.sendMessage(`${themecolor}Rosh §j> §cThis player is in creative which already allows flying by default.`);
        return;
    }

    // Toggle flying ability for the target player
    if (member.hasTag("flying")) {
        await member.removeTag("flying");
        try {
            await member.runCommandAsync("ability @s mayfly false");
        } catch (error) {
            player.sendMessage(`${themecolor}Rosh §j> §cFor this feature to work, Education Edition needs to be enabled in World settings!`);
            return;
        }
        member.sendMessage(`${themecolor}Rosh §j> §cYou are no longer in fly mode.`);
    } else {
        await member.addTag("flying");
        try {
            await member.runCommandAsync("ability @s mayfly true");
        } catch (error) {
            player.sendMessage(`${themecolor}Rosh §j> §cFor this feature to work, Education Edition needs to be enabled in World settings!`);
            return;
        }
        member.sendMessage(`${themecolor}Rosh §j> §aYou are now in fly mode.`);
    }

    // Notify the initiator
    if (member.hasTag("flying")) {
        player.sendMessage(`${themecolor}Rosh §j> §8${member.name} §acan now fly.`);
    } else {
        player.sendMessage(`${themecolor}Rosh §j> §8${member.name} §ccan no longer fly.`);
    }
}