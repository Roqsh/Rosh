import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { getPlayerByName, endsWithNumberInParentheses, tellStaff } from "../../util.js";

/**
 * Unfreezes the players movement, camera and hud.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the unfreeze event.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function unfreeze(message, args) {
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
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to unfreeze.`);
        return;
    }

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to unfreeze.`);
        return;
    }

    // Find the target player by name
    const member = getPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Check if the target player is already unfrozen
    if (!member.hasTag("frozen")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §cis not frozen.`);
        return;
    }

    // Remove the frozen mark
    member.removeTag("frozen");

    // Unfreeze the input actions of the target player
    member.inputPermissions.movementEnabled = true;
    member.inputPermissions.cameraEnabled = true;
    member.onScreenDisplay.setHudVisibility(Minecraft.HudVisibility.Reset);

    // Notify the player that he is unfrozen
    member.sendMessage(`§r${themecolor}Rosh §j> §aYou are now unfrozen!`);

    // Notify other staff members about the freeze
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ahas unfrozen §8${member.name}§a.`);
}