import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { tellStaff } from "../../util.js";

/**
 * Sends a message from a player to all staff members.
 * @param {Object} message - The message object containing the sender and other details.
 * @param {Minecraft.Player} message.sender - The player who initiated the tellstaff command.
 * @param {Array} args - The arguments passed with the command, expected to be the message to send.
 * @returns {void}
 */
export function tellstaff(message, args) {
    // Validate the type of the message parameter
    if (typeof message !== "object") {
        throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    }
    
    // Validate the type of the args parameter
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if message is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a message to send.`);
        return;
    }

    // Get all players in the world
    const players = world.getPlayers();
    // Filter to get only staff members (operators) excluding the sender of the message
    const staffMembers = players.filter(p => p.isOp() && p.name !== player.name);

    // Check if there are any other staff members online
    if (staffMembers.length === 0) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cNo other staff member is currently online.`);
        return;
    }

    // Format the message and send it to all staff members
    const formattedMessage = `§r${themecolor}Rosh §j> §8<${player.name}> §a${args.join(" ")}`;
    tellStaff(formattedMessage);
}