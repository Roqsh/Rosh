import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { tellStaff } from "../../util.js";

/**
 * Kicks all players in the world except the player who initiated the kickall event.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the kickall event.
 * @throws {TypeError} If the message object is not of type "object" or does not have a "sender" property.
 */
export function kickall(message) {
    // Validate message
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`Invalid message object: Expected an object with a "sender" property, but received ${typeof message}.`);
    }

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Check if there are any players expect the initiator
    if (world.getPlayers().length <= 1) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThere are no players to kick!`);
        return;
    }

    // Kick every player except the player who initiated the kickall event and staff members
    world.getPlayers().forEach(pl => {
        if (
            pl.name !== player.name && 
            !pl.isOp()
        ) {
            player.runCommandAsync(`kick "${pl.name}" §r${themecolor}Rosh §j> §cYou have been kicked for §8Mass Kick§c!`);
        }
    });

    // Notify other staff members about the kickall event
    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas initiated a §8Mass Kick§c!`);

    // Log the kickall event
    data.recentLogs.push(`§8${player.name} §chas initiated a §8Mass Kick§c!`);
}