import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../../data/config.js";
import data from "../../data/data.js";
import { convertToMs, timeDisplay, tellStaff } from "../../util.js";
import { mainMenu } from "../mainMenu.js";
import { playerMenuSelected } from "./playerMenu.js";

/**
 * Displays a menu with all available punishment options.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown.
 */
export function punishMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu will all available punishments
    const menu = new MinecraftUI.ActionFormData()
        .title("Punish Menu")
        .button("Kick Player")
        .button("Ban Player")
        .button("Unban Player")
        .button("Back");
    
    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        // Check if a valid selection was made
        if (response.canceled) {
            return;
        }

        switch(response.selection) {
            case 0: punishMenuSelected(player, 0); break;
            case 1: punishMenuSelected(player, 1); break;
            case 2: unbanPlayerMenu(player); break;
            case 3: mainMenu(player); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a list of all currently active players.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 * @param {number} selection - Represents the kickPlayerMenu or banPlayerMenu, where 0 equals kickPlayerMenu and 1 equals banPlayerMenu.
 */
function punishMenuSelected(player, selection) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const allPlayers = world.getAllPlayers();

    // Create a menu that lists all currently active players
    const menu = new MinecraftUI.ActionFormData()
        .title("Punish Menu");
    
        // Gets all available players
        for (const plr of allPlayers) {

            let playerName = `${plr.name}`;

            // Check if the player name matches the initiator's name and mark it with "You"
            if (plr.id === player.id) {
                playerName += " - You";
            }

            // Check if the player is an operator and mark it with "Op"
            if (plr.isOp()) {
                playerName += `\n§8[${themecolor}Op§8]`;
            }

            // Display the player and his (modified) name
            menu.button(playerName);
        }

    menu.button("Back");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
       
        // Open the kick or ban menu based on the last clicked menu in punishMenu or return back to that menu if the "Back" button was clicked
        if ([...allPlayers].length > response.selection) {         
            if (selection === 0) kickPlayerMenu(player, [...allPlayers][response.selection]);          
            if (selection === 1) banPlayerMenu(player, [...allPlayers][response.selection]);
        } else punishMenu(player);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a menu with options for kicking a selected player.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 * @param {import("@minecraft/server").Player} playerSelected - The player to be kicked.
 * @param {number} lastMenu - Represents the punishMenuSelected or playerMenuSelected, where 0 equals punishMenuSelected and 1 equals playerMenuSelected.
 */
export function kickPlayerMenu(player, playerSelected, lastMenu = 0) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for kicking another player
    const menu = new MinecraftUI.ModalFormData()
        .title(`Kick Menu - ${playerSelected.name}`)
        .textField("Reason:", "§o§7No Reason Provided")
        .toggle("Silent", false);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        // Return back to the previous menu based on the lastMenu input
        if (response.canceled) {
            switch (lastMenu) {
                case 0: punishMenuSelected(player, lastMenu); break;
                case 1: playerMenuSelected(player, playerSelected);
            }
            return;
        }

        const input = response.formValues;
        const reason = input[0] || "No Reason Provided";
        const isSilent = input[1];
        const kickMessage = `${themecolor}Rosh §j> §cYou have been kicked for: §8${reason} §c!`;

        // Check if the selected player is an operator
        if (playerSelected.isOp()) {
            player.sendMessage(`${themecolor}Rosh §j> §8${playerSelected.name} §cis an Operator and cannot be ${isSilent ? "(Silent) " : ""}kicked!`);
            return;
        }

        if (!isSilent) {
            tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas kicked §8${playerSelected.name} §cfor: §8${reason}§c.`);
            data.recentLogs.push(`${timeDisplay()}§8${playerSelected.name} §chas been kicked by §8${player.name}§c!`);
            playerSelected.kick(kickMessage);
        } else {
            tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas kicked §8${playerSelected.name} §c(Silent) for: §8${reason}§c.`);
            data.recentLogs.push(`${timeDisplay()}§8${playerSelected.name} §chas been kicked (Silent) by §8${player.name}§c!`);
            playerSelected.triggerEvent("rosh:kick");
        }
    });
}

/**
 * Displays a menu with options for banning a selected player.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is showed.
 * @param {import("@minecraft/server").Player} playerSelected - The player to be banned.
 * @param {number} lastMenu - Represents the punishMenuSelected or playerMenuSelected, where 0 equals punishMenuSelected and 1 equals playerMenuSelected.
 */
export function banPlayerMenu(player, playerSelected, lastMenu = 0) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for banning another player
    const menu = new MinecraftUI.ModalFormData()
        .title(`Ban Menu - ${playerSelected.name}`)
        .textField("Reason:", "§o§7No Reason Provided")
        .slider("Length (in days)", 0, 365, 1, 30)
        .toggle("Permanent (Overrides Length)", false);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        // Return back to the previous menu based on the lastMenu input
        if (response.canceled) {
            if (lastMenu === 0) punishMenuSelected(player, lastMenu);
            if (lastMenu === 1) playerMenuSelected(player, playerSelected);
            return;
        }

        const input = response.formValues;
        const reason = input[0];
        const banLength = input[1] ? convertToMs(`${input[1]}d`) : 0;
        const shouldPermBan = input[2];
        
        // Adjust untilDate and duration based on shouldPermBan
        const untilDate = shouldPermBan ? null : new Date(Date.now() + banLength);
        const duration = shouldPermBan ? "Permanent" : `${input[1]} days (Until ${untilDate.toLocaleString()})`;

        // Remove old ban tags
        playerSelected.getTags().forEach(tag => {
            tag = tag.replace(/"/g, "");
            if (tag.startsWith("Reason:") || tag.startsWith("Length:")) playerSelected.removeTag(tag);
        });

        if (playerSelected.isOp()) {
            player.sendMessage(`${themecolor}Rosh §j> §8${playerSelected.name} §cis an Operator and cannot be banned!`);
        } else {
            playerSelected.addTag(`Reason:${reason}`);
            if (banLength && !shouldPermBan) playerSelected.addTag(`Length:${Date.now() + banLength}`);
            playerSelected.addTag("isBanned");

            tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas banned §8${playerSelected.name} §cfor: §8${reason}§c.`);
            data.recentLogs.push(`${timeDisplay()}§8${playerSelected.name} §chas been banned by §8${player.name}§c!`);

            // Save all ban-related information
            data.banList[playerSelected.name] = {
                bannedBy: player.name,
                date: new Date().toLocaleString(),
                reason: reason,
                duration: duration
            };
        }
    });
}

/**
 * Displays a menu to input a name of a player to unban.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is showed.
 */
function unbanPlayerMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for unbanning another player
    const menu = new MinecraftUI.ModalFormData()
        .title("Unban Menu")
        .textField("Player:", "§o§7Enter player name")
        .textField("Reason:", "§o§7No Reason Provided");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        
        if(response.canceled) return punishMenu(player);

        const responseData = String(response.formValues).split(",");
        const playerToUnban = responseData.shift().split(" ")[0];
        const reason = responseData.join(",").replace(/"|\\/g, "") || "No Reason Provided";

        if (!playerToUnban) {
            player.sendMessage(`${themecolor}Rosh §j> §cYou need to provide who to unban.`);
            return unbanPlayerMenu(player);
        }

        data.unbanQueue.push(playerToUnban.toLowerCase());

        // Remove the ban information from data.banList
        delete data.banList[playerToUnban];

        tellStaff(`§r${themecolor}Rosh §j> §8${player.nameTag} §ahas added §8${playerToUnban} §ainto the unban queue for: §8${reason}§a.`);
        data.recentLogs.push(`${timeDisplay()}§8${playerToUnban} §ahas been unbanned by §8${player.nameTag}§a!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}