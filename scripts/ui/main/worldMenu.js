import * as MinecraftUI from "@minecraft/server-ui";
import { Player, world } from "@minecraft/server";
import config from "../../data/config.js";
import { mainMenu } from "../mainMenu.js";

/**
 * Displays the world settings menu to the player which allows for the customization of game rules.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown.
 */
export function worldMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create the menu with server options
    const menu = new MinecraftUI.ActionFormData()
        .title("Server Options")
        .button(`PvP\n${world.gameRules.pvp ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Regeneration\n${world.gameRules.naturalRegeneration ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Keep Inventory\n${world.gameRules.keepInventory ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Immediate Respawn\n${world.gameRules.doImmediateRespawn ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button("Back");

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

        switch (response.selection) {
            case 0: toggleGameRule(player, 'pvp', 'PvP'); break;
            case 1: toggleGameRule(player, 'naturalRegeneration', 'Regeneration'); break;
            case 2: toggleGameRule(player, 'keepInventory', 'Keep Inventory'); break;
            case 3: toggleGameRule(player, 'doImmediateRespawn', 'Immediate Respawn'); break;
            case 4: mainMenu(player); break;
        }
        
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Toggles a specified game rule and notifies the player.
 * @param {import("@minecraft/server").Player} player - The player to be notified.
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
    player.sendMessage(`§r${config.themecolor}Rosh §j> §8${ruleName}${color} is now ${status}.`);
    
    // Re-open the world menu for the player
    worldMenu(player);
}