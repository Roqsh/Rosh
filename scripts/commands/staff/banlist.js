import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import data from "../../data/data.js";

/**
 * Displays the current ban list or ban information for a specific player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the ban list request.
 * @param {Array<string>} args - The arguments provided for the ban list command. If args[0] is provided, it is the target player name to view their ban info.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function banlist(message, args) {
    // Validate message and args
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;

    // If no arguments provided, display the full ban list
    if (!args.length) {

        const banEntries = Object.entries(data.banList);

        // Handle case where the ban list is empty
        if (banEntries.length === 0) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cThe ban list is currently empty.`);
            return;
        }

        player.sendMessage(`§r${themecolor}Rosh §j> §aHere's the current ban list:`);

        banEntries.forEach(([name, info], index) => {
            player.sendMessage(`§8Player: ${name} \nBanned by: ${info.bannedBy} \nDate: ${info.date} \nReason: ${info.reason} \nDuration: ${info.duration}${index < banEntries.length - 1 ? '\n§r' : ''}`);
        });
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    const minNameLength = 3;
    const maxNameLength = player.name.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to view their ban info.`);
        return;
    }

    // Handle case where the target player is not found in the ban list
    if (!data.banList[targetName]) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find any ban information for that player.`);
        return;
    }

    const banInfo = data.banList[targetName];

    // Display the ban information for the specific player
    player.sendMessage(`§r${themecolor}Rosh §j> §aBan information for §8${targetName}§a:`);
    player.sendMessage(`§8Banned by: ${banInfo.bannedBy}`);
    player.sendMessage(`§8Date: ${banInfo.date}`);
    player.sendMessage(`§8Reason: ${banInfo.reason}`);
    player.sendMessage(`§8Duration: ${banInfo.duration}`);
}