import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../data/config.js";
import data from "../data/data.js";
import { timeDisplay, getPlayerByName, endsWithNumberInParentheses, tellStaff } from "../util.js";

/**
 * Opens the report menu to select a malicious user.
 * @param {Minecraft.Player} player - The player who initiated the report.
 */
export function reportMenu(player) {

    const themecolor = config.themecolor;

    player.sendMessage(`${themecolor}Rosh §j> §aLeave the chat to view the report menu.`);

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const allPlayers = world.getAllPlayers();
    const onlinePlayerCount = allPlayers.length - 1; // Don't count the initiator

    // Create the initial menu with the option to select an offline player
    const menu = new MinecraftUI.ActionFormData()
        .title("Report Menu")
        .body(`§aOnline (§8${onlinePlayerCount}§a)`)
        .button("Select offline player");

    // Add a button for each online player
    allPlayers.forEach((plr) => {
        
        let playerName = `${plr.name}`;

        // If the initiator is an operator, let them see other operators
        if (player.isOp() && plr.isOp()) {
            playerName += `\n§8[${themecolor}Op§8]`;
        }

        // Dont show the initiator as someone who can be reported
        if (plr.name !== player.name) {
            menu.button(playerName);
        }
    });

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {

        if (!response.canceled) {

            if (response.selection === 0) {
                // Offline player selected
                openOfflinePlayerMenu(player);
            } else {
                // Online player selected
                const selectedPlayer = allPlayers[response.selection - 1];
                cheatType(player, selectedPlayer);
            }
        }

    }).catch(handleMenuError(player, themecolor));
}

/**
 * Opens a menu to report an offline player by entering their name.
 * @param {Minecraft.Player} player - The player who initiated the report.
 */
function openOfflinePlayerMenu(player) {

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a modal form to enter the name of the offline player
    const menu = new MinecraftUI.ModalFormData()
        .title("Offline Report")
        .textField("", "§o§7Enter name here")
        .submitButton("Report Player");

    // Show the modal form and handle the player's input
    menu.show(player).then((response) => {

        if (response.canceled) {
            // If the menu is closed, re-open the report menu
            return reportMenu(player);
        }

        const offlinePlayer = response.formValues[0]?.trim();

        // Ensure the player entered a name
        if (!offlinePlayer) {
            return player.sendMessage(`${themecolor}Rosh §j> §cYou must enter a player name to report!`);
        }

        // Sanitize and validate the player name
        const targetName = sanitizeName(offlinePlayer, player.name);

        if (!isValidPlayerName(targetName)) {
            return player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide a valid player name.`);
        }

        // Prevent the player from reporting themselves
        if (targetName === player.name) {
            return player.sendMessage(`${themecolor}Rosh §j> §cYou cannot report yourself.`);
        }

        // Prevent duplicate reports of the same player
        if (player.reports?.includes(targetName)) {
            return player.sendMessage(`${themecolor}Rosh §j> §cYou have already reported this player.`);
        }

        // Proceed to the cheat type selection
        cheatType(player, targetName);

    }).catch(handleMenuError(player, themecolor));
}

/**
 * Opens a menu to select the type of cheat the player is reporting.
 * @param {Minecraft.Player} player - The player who initiated the report.
 * @param {Minecraft.Player | string} selectedPlayer - The player being reported, either online or offline.
 */
function cheatType(player, selectedPlayer) {

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const targetName = typeof selectedPlayer === "string" ? selectedPlayer : selectedPlayer.name;

    // Create a menu for selecting the type of cheat
    const menu = new MinecraftUI.ActionFormData()
        .title(`Cheat Type - ${targetName}`)
        .button("Combat")
        .button("Movement")
        .button("Block")
        .button("Other")
        .button("Back");

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {

        if (response.canceled) return;

        // Open the corresponding sub-menu based on the player's selection
        switch (response.selection) {
            case 0: combatType(player, selectedPlayer); break;
            case 1: movementType(player, selectedPlayer); break;
            case 2: blockType(player, selectedPlayer); break;
            case 3: otherType(player, selectedPlayer); break;
            case 4: reportMenu(player); break;  // Go back to the previous menu
            default: player.sendMessage(`${themecolor}Rosh §j> §cInvalid selection. (§8${response.selection}§c)`);
        }

    }).catch(handleMenuError(player, themecolor));
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
 * Sanitizes a player name by removing invalid characters and replacing '@s' with the reporter's name.
 * @param {string} name - The name to sanitize.
 * @param {string} playerName - The name of the reporting player.
 * @returns {string} The sanitized player name.
 */
function sanitizeName(name, playerName) {
    // Remove potentially harmful characters and replace @s with the player's name
    const filteredName = name.replace(/["'`\\]/g, "");
    return filteredName.replace(/@s/g, playerName);
}

/**
 * Validates the player name to ensure it meets the necessary criteria.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, otherwise false.
 */
function isValidPlayerName(name) {
    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(name) ? 15 : 12;

    // Check if the name length is within valid bounds
    return name.length >= minNameLength && name.length <= maxNameLength;
}

/**
 * Displays a menu for the player to select the type of combat-related cheat to report.
 * @param {Minecraft.Player} player - The player who initiated the report.
 * @param {Minecraft.Player | string} selectedPlayer - The player being reported, either online or offline.
 */
function combatType(player, selectedPlayer) {

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const targetName = typeof selectedPlayer === "string" ? selectedPlayer : selectedPlayer.name;

    // Create a menu for selecting the specific type of combat cheat
    const menu = new MinecraftUI.ActionFormData()
        .title(`Combat - ${targetName}`)
        .button("Killaura")
        .button("Reach")
        .button("Hitbox")
        .button("Aim")
        .button("Velocity")
        .button("AutoClicker")
        .button("Back");

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {

        if (response.canceled) return;

        // Handle the selection, directing back to the previous menu if "Back" is chosen
        switch (response.selection) {
            case 0: confirmReportMenu(player, selectedPlayer, "Killaura"); break; // Handle Killaura
            case 1: confirmReportMenu(player, selectedPlayer, "Reach"); break; // Handle Reach
            case 2: confirmReportMenu(player, selectedPlayer, "Hitbox"); break; // Handle Hitbox
            case 3: confirmReportMenu(player, selectedPlayer, "Aim"); break; // Handle Aim
            case 4: confirmReportMenu(player, selectedPlayer, "Velocity"); break; // Handle Velocity
            case 5: confirmReportMenu(player, selectedPlayer, "AutoClicker"); break; // Handle AutoClicker
            case 6: cheatType(player, selectedPlayer); break; // Go back to the previous menu
            default: player.sendMessage(`${themecolor}Rosh §j> §cInvalid selection. (§8${response.selection}§c)`);
        }

    }).catch(handleMenuError(player, themecolor));
}

/**
 * Displays a menu for the player to select the type of movement-related cheat to report.
 * @param {Minecraft.Player} player - The player who initiated the report.
 * @param {Minecraft.Player | string} selectedPlayer - The player being reported, either online or offline.
 */
function movementType(player, selectedPlayer) {

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const targetName = typeof selectedPlayer === "string" ? selectedPlayer : selectedPlayer.name;

    // Create a menu for selecting the specific type of movement cheat
    const menu = new MinecraftUI.ActionFormData()
        .title(`Movement - ${targetName}`)
        .button("Fly")
        .button("Speed")
        .button("Teleport")
        .button("Timer")
        .button("Strafe")
        .button("Phase")
        .button("NoSlowDown")
        .button("Back");

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {

        if (response.canceled) return;

        // Handle the selection, directing back to the previous menu if "Back" is chosen
        switch (response.selection) {
            case 0: confirmReportMenu(player, selectedPlayer, "Fly"); break; // Handle Fly
            case 1: confirmReportMenu(player, selectedPlayer, "Speed"); break; // Handle Speed
            case 2: confirmReportMenu(player, selectedPlayer, "Teleport"); break; // Handle Teleport
            case 3: confirmReportMenu(player, selectedPlayer, "Timer"); break; // Handle Timer
            case 4: confirmReportMenu(player, selectedPlayer, "Strafe"); break; // Handle Strafe
            case 5: confirmReportMenu(player, selectedPlayer, "Phase"); break; // Handle Phase
            case 6: confirmReportMenu(player, selectedPlayer, "NoSlowDown"); break; // Handle NoSlowDown
            case 7: cheatType(player, selectedPlayer); break; // Go back to the previous menu
            default: player.sendMessage(`${themecolor}Rosh §j> §cInvalid selection. (§8${response.selection}§c)`);
        }

    }).catch(handleMenuError(player, themecolor));
}

/**
 * Displays a menu for the player to select the type of placement-related cheat to report.
 * @param {Minecraft.Player} player - The player who initiated the report.
 * @param {Minecraft.Player | string} selectedPlayer - The player being reported, either online or offline.
 */
function blockType(player, selectedPlayer) {
    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const targetName = typeof selectedPlayer === "string" ? selectedPlayer : selectedPlayer.name;

    // Create a menu for selecting the specific type of placement cheat
    const menu = new MinecraftUI.ActionFormData()
        .title(`Block - ${targetName}`)
        .button("Scaffold")
        .button("Tower")
        .button("Nuker")
        .button("Xray")
        .button("Inappropriate Build")
        .button("Back");

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {

        if (response.canceled) return;

        // Handle the selection, directing back to the previous menu if "Back" is chosen
        switch (response.selection) {
            case 0: confirmReportMenu(player, selectedPlayer, "Scaffold"); break; // Handle Scaffold
            case 1: confirmReportMenu(player, selectedPlayer, "Tower"); break; // Handle Tower
            case 2: confirmReportMenu(player, selectedPlayer, "Nuker"); break; // Handle Nuker
            case 3: confirmReportMenu(player, selectedPlayer, "Xray"); break; // Handle Xray
            case 4: confirmReportMenu(player, selectedPlayer, "Inappropriate Build"); break; // Handle Inappropriate Build
            case 5: cheatType(player, selectedPlayer); break; // Go back to the previous menu
            default: player.sendMessage(`${themecolor}Rosh §j> §cInvalid selection. (§8${response.selection}§c)`);
        }

    }).catch(handleMenuError(player, themecolor));
}

/**
 * Displays a menu for the player to select the type of "other" cheat to report.
 * @param {Minecraft.Player} player - The player who initiated the report.
 * @param {Minecraft.Player | string} selectedPlayer - The player being reported, either online or offline.
 */
function otherType(player, selectedPlayer) {

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const targetName = typeof selectedPlayer === "string" ? selectedPlayer : selectedPlayer.name;

    // Create a menu for selecting the specific type of "other" cheat
    const menu = new MinecraftUI.ActionFormData()
        .title(`Other - ${targetName}`)
        .button("Spam")
        .button("Teaming")
        .button("Duping")
        .button("Exploiting")
        .button("Inappropriate Chat")
        .button("Inappropriate Skin")
        .button("Inappropriate Name")
        .button("Back");

    // Show the menu and handle the player's selection
    menu.show(player).then((response) => {
        
        if (response.canceled) return;

        // Handle the selection, directing back to the previous menu if "Back" is chosen
        switch (response.selection) {
            case 0: confirmReportMenu(player, selectedPlayer, "Spam"); break; // Handle Spam
            case 1: confirmReportMenu(player, selectedPlayer, "Teaming"); break; // Handle Teaming
            case 2: confirmReportMenu(player, selectedPlayer, "Duping"); break; // Handle Duping
            case 3: confirmReportMenu(player, selectedPlayer, "Exploiting"); break; // Handle Exploiting
            case 4: confirmReportMenu(player, selectedPlayer, "Inappropriate Chat"); break; // Handle Inappropriate Chat
            case 5: confirmReportMenu(player, selectedPlayer, "Inappropriate Skin"); break; // Handle Inappropriate Skin
            case 6: confirmReportMenu(player, selectedPlayer, "Inappropriate Name"); break; // Handle Inappropriate Name
            case 7: cheatType(player, selectedPlayer); break; // Go back to the previous menu
            default: player.sendMessage(`${themecolor}Rosh §j> §cInvalid selection. (§8${response.selection}§c)`);
        }

    }).catch(handleMenuError(player, themecolor));
}

/**
 * Displays a confirmation menu showing the selected player, the chosen cheat, and provides a text field for additional reasoning.
 * @param {Minecraft.Player} player - The player who is submitting the report.
 * @param {Minecraft.Player | string} selectedPlayer - The player being reported, either online or offline.
 * @param {string} cheatType - The type of cheat the player selected.
 */
function confirmReportMenu(player, selectedPlayer, cheatType) {

    // Play a sound to indicate that the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const targetName = typeof selectedPlayer === "string" ? selectedPlayer : selectedPlayer.name;

    // Create a menu to confirm the selected cheat and gather additional information
    const menu = new MinecraftUI.ModalFormData()
        .title(`Confirm Report - ${targetName}`)
        .textField(`§aCheat: §8${cheatType}\n\n§rAdditional Reasoning (Optional):`, "§o§7Enter additional details here")
        .submitButton("Submit Report");

    // Show the menu and handle the player's input
    menu.show(player).then((response) => {

        // Process the report submission
        const additionalReasoning = response.formValues[0];

        // Add the player to the reported players list to prevent double reporting
        player.reports.push(targetName);

        const onlinePlayer = getPlayerByName(targetName);

        if (onlinePlayer) {
            // Mark the player as reported
            onlinePlayer.addTag("reported");
        }

        // Log the report for the staff to review
        tellStaff(`${themecolor}Rosh §j> §8${player.name} §ahas reported §8${targetName} §afor: §8${cheatType}§a. Additional Details: §8${additionalReasoning || "None"}§a.`);

        // Notify the player that their report has been submitted
        player.sendMessage(`${themecolor}Rosh §j> §aThank you for your report! Our staff will review it shortly. (§8${targetName}§a, §8${cheatType}${additionalReasoning ? `§a/§8${additionalReasoning}` : ""}§a)`);

        // Log the report
        data.recentLogs.push(`${timeDisplay()}§8${targetName} §chas been reported by §8${player.name}§c!`);

        const reason = `${cheatType} / ${additionalReasoning}`

        // Save all important aspects of the report
        data.reports[targetName] = {
            reportedBy: player.name,
            date: new Date().toLocaleString(),
            ms: Date.now(),
            reason: reason,
            status: "unresolved"
        };

    }).catch(handleMenuError(player, themecolor));
}