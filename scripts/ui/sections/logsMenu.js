import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../../data/config.js";
import data from "../../data/data.js";
import { mainMenu } from "../mainGui.js";

/**
 * Displays all Rosh logs in a menu.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 * @param {number} page - The page of the logs menu.
 */
export function logsMenu(player, page = 0) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const LinesPerPage = config.logSettings.linesPerPage;
    const logs = data.recentLogs;
    const totalPages = Math.ceil(logs.length / LinesPerPage);
    const start = page * LinesPerPage;
    const end = start + LinesPerPage;
    const text = logs.length ? logs.slice(start, end).join("\n") : "§8No logs available yet.";

    // Create the menu to display the logs
    const menu = new MinecraftUI.ActionFormData()
        .title(`Logs - ${page + 1}/${totalPages}`)
        .body(text);

    let buttonIndex = 0;
    if (page > 0) {
        menu.button("< Previous Page");
        buttonIndex++;
    }
    if (page < totalPages - 1) {
        menu.button("Next Page >");
        buttonIndex++;
    }
    menu.button("Log Settings");
    menu.button("Back");

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

        if (response.selection === 0 && page > 0) {
            logsMenu(player, page - 1);
        } else if (response.selection === (page > 0 ? 1 : 0) && page < totalPages - 1) {
            logsMenu(player, page + 1);
        } else if (response.selection === buttonIndex) {
            logsSettingsMenu(player);
        } else if (response.selection === buttonIndex + 1) {
            mainMenu(player);
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays the log settings menu to customize the way the logs are shown.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 */
function logsSettingsMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const { themecolor, logSettings } = config;

    // Create the log settings menu
    const menu = new MinecraftUI.ModalFormData()
        .title("Log Settings")
        .toggle("Show Timestamps", logSettings.showTimestamps)
        .toggle("Show Debug", logSettings.showDebug)
        .toggle("Show Chat", logSettings.showChat)
        .toggle("Show Join/Leave Messages", logSettings.showJoinLeave)
        .slider("Lines Per Page", 10, 100, 1, logSettings.linesPerPage);

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

        try {
            // Destructure the response values
            const [showTimestamps, showDebug, showChat, showJoinLeave, linesPerPage] = response.formValues;

            // Update the configuration
            config.logSettings = {
                showTimestamps,
                showDebug,
                showChat,
                showJoinLeave,
                linesPerPage
            };

            // Save the updated configuration
            world.setDynamicProperty("config", JSON.stringify(config));

            // Notify the player of the changes
            player.sendMessage(
                `${themecolor}Rosh §j> §aUpdated the log settings:\n§8` +
                `Show Timestamps: ${showTimestamps}\n` +
                `Show Debug: ${showDebug}\n` +
                `Show Chat: ${showChat}\n` +
                `Show Join/Leave Messages: ${showJoinLeave}\n` +
                `Lines Per Page: ${linesPerPage}`
            );

        } catch (error) {
            // Handle promise rejection
            console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
            player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}