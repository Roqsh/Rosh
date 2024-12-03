import * as MinecraftUI from "@minecraft/server-ui";
import config from "../../data/config.js";
import { mainMenu } from "../mainMenu.js";

/**
 * Displays a debug menu to the player with options to toggle various debugging features.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown.
 */
export function debugMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with buttons for accessing various debugging tools
    const menu = new MinecraftUI.ActionFormData()
        .title("Debug Tools")
        .button(`Alerts\n${player.hasTag("debug") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Packets\n${player.hasTag("packetlogger") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Speed\n${player.hasTag("speed") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Ticks\n${player.hasTag("ticks") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Tps\n${player.hasTag("tps") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Yaw\n${player.hasTag("yaw") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Delta Yaw\n${player.hasTag("deltaYaw") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Pitch\n${player.hasTag("pitch") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Delta Pitch\n${player.hasTag("deltaPitch") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Cps\n${player.hasTag("cps") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Health\n${player.hasTag("health") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`BlockRaycasts\n${player.hasTag("devblockray") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button("Back");
    
    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

        // Perform actions based on the selected option
        switch (response.selection) {
            case 0: toggleTag(player, "debug", `${player.hasTag("debug") ? "§c" : "§a"}Debug-content of §8Alerts`); break;
            case 1: toggleTag(player, "packetlogger", `Packets ${player.hasTag("packetlogger") ? "§c" : "§a"}sent by the client`); break;
            case 2: toggleTag(player, "speed", "Speed"); break;
            case 3: toggleTag(player, "ticks", "Ticks"); break;
            case 4: toggleTag(player, "tps", "Tps"); break;
            case 5: toggleTag(player, "yaw", "Yaw"); break;
            case 6: toggleTag(player, "deltaYaw", "Delta Yaw"); break;
            case 7: toggleTag(player, "pitch", "Pitch"); break;
            case 8: toggleTag(player, "deltaPitch", "Delta Pitch"); break;
            case 9: toggleTag(player, "cps", "Cps"); break;
            case 10: toggleTag(player, "health", "Health"); break;
            case 11: toggleTag(player, "devblockray", "Block-Raycasts"); break;
            case 12: mainMenu(player); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Toggles a tag on the player and sends a confirmation message.
 * @param {import("@minecraft/server").Player} player - The player to whom the tag will be added or removed.
 * @param {string} tag - The tag to add or remove.
 * @param {string} description - The description of the tag for the confirmation message.
 * @returns {Promise<void>} - A promise that resolves when the tag operation is complete.
 */
function toggleTag(player, tag, description) {

    const themecolor = config.themecolor;
    const hasTag = player.hasTag(tag);
    
    if (hasTag) {
        // Remove the tag and notify the player
        player.removeTag(tag);
        player.sendMessage(`${themecolor}Rosh §j> §8${description} §cwill no longer be displayed.`);
    } else {
        // Add the tag and notify the player
        player.addTag(tag);
        player.sendMessage(`${themecolor}Rosh §j> §8${description} §awill now be displayed.`);
    }

    // Re-open the debug menu for the player
    debugMenu(player);
}