import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Toggles the notification status for the player who initiated the notify command.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the notify command.
 * @throws {TypeError} If the message is not of type "object".
 */
export function notify(message) {
    // Validate message
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    handleNotification(player, themecolor);
}

/**
 * Toggles the notification status for the player who initiated the notify
 * @param {Minecraft.Player} player - The player whose notification status should be toggled.
 * @param {string} themecolor - The theme color to be used in the messages.
 */
export function handleNotification(player, themecolor) {

    // Toggle notifications for the player (or remove it if he already has the notify tag)
    if (player.hasTag("notify")) {
        player.removeTag("notify");
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou will no longer receive notifications.`);
    } else {
        player.addTag("notify");
        player.sendMessage(`§r${themecolor}Rosh §j> §aYou will now receive notifications.`);
    }
}