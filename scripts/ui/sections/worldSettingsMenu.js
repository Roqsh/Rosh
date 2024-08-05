import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../../data/config.js";
import { mainMenu } from "../mainGui.js";

/**
 * Displays the world settings menu to the player.
 * @param {Object} player - The player to whom the menu is shown.
 */
export function worldSettingsMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create the menu with server options
    const menu = new MinecraftUI.ActionFormData()
        .title("Server Options")
        .button(`PvP\n${world.gameRules.pvp ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Regeneration\n${world.gameRules.naturalRegeneration ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Keep Inventory\n${world.gameRules.keepInventory ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button("Back");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        // Check if a valid selection was made
        if (response.canceled) {
            return;
        }

        switch (response.selection) {
            case 0: toggleGameRule(player, 'pvp', 'PvP'); break;
            case 1: toggleGameRule(player, 'naturalRegeneration', 'Regeneration'); break;
            case 2: toggleGameRule(player, 'keepInventory', 'Keep Inventory'); break;
            case 3: mainMenu(player); break;
        }
    });
}

/**
 * Toggles a specified game rule and notifies the player.
 * @param {Object} player - The player to be notified.
 * @param {string} gameRule - The game rule to toggle.
 * @param {string} ruleName - The name of the rule to display in the notification.
 */
function toggleGameRule(player, gameRule, ruleName) {
    
    // Toggle the specified game rule
    world.gameRules[gameRule] = !world.gameRules[gameRule];

    // Determine the status and color based on the new value of the game rule
    const status = world.gameRules[gameRule] ? "enabled" : "disabled";
    const color = world.gameRules[gameRule] ? "§a" : "§c";

    // Notify the player about the change
    player.sendMessage(`§r${config.themecolor}Rosh §j> ${color}${ruleName} is now ${status}.`);
    
    // Re-open the settings menu for the player
    worldSettingsMenu(player);
}