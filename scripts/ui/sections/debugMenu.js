import * as MinecraftUI from "@minecraft/server-ui";
import config from "../../data/config.js";
import { mainMenu } from "../mainGui.js";

/**
 * Displays a debug menu to the player with options to toggle various debugging features.
 * @param {Object} player - The player to whom the menu is shown.
 */
export function debugMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with buttons for accessing various debugging tools
    const menu = new MinecraftUI.ActionFormData()
        .title("Debug Menu")
        .button(`Checks\n${player.hasTag("debug") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Events\n${player.hasTag("eventlogger") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Speed\n${player.hasTag("devspeed") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`FallDistance\n${player.hasTag("devfalldistance") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Tps\n${player.hasTag("devtps") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`XRotation\n${player.hasTag("devrotationx") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`YRotation\n${player.hasTag("devrotationy") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Cps\n${player.hasTag("cps") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Health\n${player.hasTag("health") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`BlockRaycasts\n${player.hasTag("devblockray") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button("Back");
    
    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        // Check if the menu was cancelled
        if (response.canceled) {
            return;
        }

        // Perform actions based on the selected option
        switch (response.selection) {
            case 0: toggleTag(player, "debug", "Check-Debug"); break;
            case 1: toggleTag(player, "eventlogger", "Events"); break;
            case 2: toggleTag(player, "devspeed", "Speed"); break;
            case 3: toggleTag(player, "devfalldistance", "FallDistance"); break;
            case 4: toggleTag(player, "devtps", "Tps"); break;
            case 5: toggleTag(player, "devrotationx", "XRotation"); break;
            case 6: toggleTag(player, "devrotationy", "YRotation"); break;
            case 7: toggleTag(player, "cps", "Cps"); break;
            case 8: toggleTag(player, "health", "Health"); break;
            case 9: toggleTag(player, "devblockray", "Block-Raycasts"); break;
            case 10: mainMenu(player); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Toggles a tag on the player and sends a confirmation message.
 * @param {Object} player - The player to whom the tag will be added or removed.
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
}