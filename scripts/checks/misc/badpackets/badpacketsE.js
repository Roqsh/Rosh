import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for invalid message properties.
 * @param {Minecraft.Player} player - The player to check.
 * @param {String} message - The sent message.
 * @param {Minecraft.ChatSendBeforeEvent} msg - The triggered event that gets cancelled.
 */
export function badpackets_e(player, message, msg) {

    if (!config.modules.badpacketsE.enabled) return;
    
    // Sending a single slash or messages larger than the vanilla limit is not possible
    const invalidLength = message.length > 512 || message.length < 1;
    const invalidContent = message === "/";

    let cancelEvent = false;

    // Invalid message lengths can cause problems when viewed by other clients
    if (invalidLength) {
        flag(player, "BadPackets", "E", "message-length", `${message.length}`);
        cancelEvent = true;
    } 
    
    // When sending a slash, a command error should normally pop up
    if (invalidContent) {
        flag(player, "BadPackets", "E", "message-content", `"${message}"`);
        cancelEvent = true;
    }

    // Prevents the message from being sent
    if (cancelEvent) {
        msg.cancel = true;
    }
}