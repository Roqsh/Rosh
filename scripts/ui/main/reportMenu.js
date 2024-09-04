import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import config from "../../data/config.js";
import data from "../../data/data.js";
import { timeDisplay, tellStaff } from "../../util.js";

/**
 * Displays a menu for staff members to manage pending reports.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 */
export function reportMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const reports = data.reports;
    
    // Create the initial menu for managing reports
    const menu = new MinecraftUI.ActionFormData()
        .title("Manage Reports");

    if (Object.keys(reports).length === 0) {
        return player.sendMessage(`${themecolor}Rosh §j> §cThere are currently no pending reports.`);
    }

    // Iterate over each reported player in the reports list
    Object.keys(reports).forEach((targetName) => {

        const report = reports[targetName];
        const statusText = report.status === "resolved" ? "§8[§aResolved§8]" : "§8[§cUnresolved§8]";

        // Construct the button with the player's name and status
        menu.button(`${targetName}\n${statusText}`);
    });

    // Add the "Edit Filter" button at the end of the list
    menu.button("Edit Filter");

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {

        if (!response.canceled) {

            const selectedIndex = response.selection;
            const reportKeys = Object.keys(reports);

            // Check if "Edit Filter" was selected
            if (selectedIndex === reportKeys.length) {
                // Open the report settings menu
                reportSettingsMenu(player);

            } else {
                // Handle the selected report
                const selectedReportName = reportKeys[selectedIndex];
                const selectedReport = reports[selectedReportName];
                
                // Handle the selected report (e.g., open a detailed view, resolve the report, etc.)
                handleSelectedReport(player, selectedReportName, selectedReport);
            }
        }

    }).catch((error) => handleMenuError(player, themecolor));
}

/**
 * Handles any errors that occur during menu interactions.
 * @param {Minecraft.Player} player - The player interacting with the menu.
 * @param {string} themecolor - The theme color used for error messages.
 * @returns {Function} A function to handle errors.
 */
function handleMenuError(player, themecolor) {
    return (error) => {
        // Log the error to the console
        console.error(`${new Date().toISOString()} | ${error.stack}`);

        // Send an error message to the player
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    };
}

/**
 * Displays a menu for staff members to edit what type of reports are shown.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 */
function reportSettingsMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    
    const menu = new MinecraftUI.ModalFormData()
        .title("Filter Reports")
        .dropdown("\nStatus", ["Unresolved", "Resolved", "Both"], 0)
        .dropdown("Start with", ["Most recent", "Oldest", "Alphabetical order", "Shortest name", "Longest name"], 0)
        .toggle("Time Filter", false)
        .slider("Hours ago", 0, 48, 1, 6)
        .toggle("Date Filter", false)
        .textField("Date", "§7§oEnter date <day.month> (Eg. 23.02)")
        .submitButton("Apply changes");

    menu.show(player).then((response) => {

        if (response.canceled) return;

        // Add code here to handle the filter settings (e.g., update the report view based on selection)

    });
}