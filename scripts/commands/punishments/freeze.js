import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { findPlayerByName, tellStaff } from "../../util.js";

/**
 * Freezes the players movement, camera and hud until he gets unfrozen.
 * @name freeze
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the freeze event.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function freeze(message, args) {
    // Validate message and args
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;
    
    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to freeze.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = player.name.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to freeze.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Check if the target player is already frozen
    if (member.hasTag("frozen")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §cis already frozen.`);
        return;
    }

    // Prevent freezing oneself
    if (member.id === player.id) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot freeze yourself.`);
        return;
    }

    // Prevent freezing other staff members
    if (member.isOp()) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot freeze other staff members.`);
        return;
    }

    // Mark the player as frozen
    member.addTag("frozen");

    // Freeze the input actions of the target player
    member.inputPermissions.movementEnabled = false;
    member.inputPermissions.cameraEnabled = false;
    member.onScreenDisplay.setHudVisibility(Minecraft.HudVisibility.Hide);

    // Notify the player that he is frozen
    member.sendMessage(`§r${themecolor}Rosh §j> §cYou are now frozen!`);

    // Notify other staff members about the freeze
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas frozen §8${member.name}§c.`);
}