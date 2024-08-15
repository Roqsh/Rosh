import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../data/config.js";
import data from "../data/data.js";

// Import all sub-menus
import { punishMenu } from "./sections/punishMenu.js";
import { settingsMenu } from "./sections/settingsMenu.js";
import { checksMenu } from "./sections/checksMenu.js";
import { playerMenu, playerMenuSelected } from "./sections/playerMenu.js";
import { worldMenu } from "./sections/worldMenu.js";
import { logsMenu } from "./sections/logsMenu.js";
import { debugMenu } from "./sections/debugMenu.js";

/**
 * Displays the UI that gets opened by the UI item.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 */
export function mainMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create the main menu with all sub-menus
    const menu = new MinecraftUI.ActionFormData()
        .title("Rosh Settings")
        .button("Punish Menu")
        .button("Settings")
        .button("Checks")
        .button(`Manage Players\n§8§o${[...world.getAllPlayers()].length} online`)
        .button("Server Options")
        .button("Logs")
        .button("Debug Tools");
    
    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0: punishMenu(player); break;
            case 1: settingsMenu(player); break;
            case 2: checksMenu(player); break;
            case 3: playerMenu(player); break;
            case 4: worldMenu(player); break;
            case 5: logsMenu(player); break;
            case 6: debugMenu(player); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}