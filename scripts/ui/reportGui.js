import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../data/config.js";

/**
 * Opens the report menu to select the malicious user.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 */
export function reportMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const allPlayers = world.getAllPlayers();

    const menu = new MinecraftUI.ActionFormData()
		.title("Report Menu")

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
		
    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {
       
        if (!response.canceled) {
            // The player selected a player, so open the cheat type menu
            cheatType(player, [...allPlayers][response.selection]);
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * Lets the player select the cheat type.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 * @param {Minecraft.Player} selectedPlayer - The malicous user to report.
 */
function cheatType(player, selectedPlayer) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()
        .title(`Cheat Type - ${selectedPlayer.name}`)
        .button("Combat")
        .button("Movement")
        .button("Placement")
        .button("Other")
        .button("Back");
    
    menu.show(player).then((response) => {

        // Open the sub-category menu based on the selection
        switch (response.selection) {
            case 0: combatType(player, selectedPlayer); break;
            case 1: movementType(player, selectedPlayer); break;
            case 2: placementType(player, selectedPlayer); break;
            case 3: otherType(player, selectedPlayer); break;
            case 4: reportMenu(player); break;
        }
        
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * Lets the player select the desired combat type cheat.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 * @param {Minecraft.Player} selectedPlayer - The malicous user to report.
 */
function combatType(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()
        .title(`Combat - ${selectedPlayer.name}`)
        .button("KillAura")
        .button("Reach")
        .button("Hitbox")
        .button("Aim")
        .button("Velocity")
        .button("AutoClicker")
        .button("Back");

    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0: break;
            case 1: break;
            case 2: break;
            case 3: break;
            case 4: break;
            case 5: break;
            case 6: cheatType(player, selectedPlayer); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * Lets the player select the desired movement type cheat.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 * @param {Minecraft.Player} selectedPlayer - The malicous user to report.
 */
function movementType(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()
        .title(`Movement - ${selectedPlayer.name}`)
        .button("Fly")
        .button("Speed")
        .button("Teleport")
        .button("Timer")
        .button("Strafe")
        .button("Phase")
        .button("NoSlowDown")
        .button("Back");

    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0: break;
            case 1: break;
            case 2: break;
            case 3: break;
            case 4: break;
            case 5: break;
            case 6: break;
            case 7: cheatType(player, selectedPlayer); break;
        }
        
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * Lets the player select the desired placement type cheat.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 * @param {Minecraft.Player} selectedPlayer - The malicous user to report.
 */
function placementType(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()
        .title(`Placement - ${selectedPlayer.name}`)
        .button("Scaffold")
        .button("Tower")
        .button("Nuker")
        .button("Inappropriate Build")
        .button("Back");

    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0: break;
            case 1: break;
            case 2: break;
            case 3: break;
            case 4: cheatType(player, selectedPlayer); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * Lets the player select the desired other type cheat.
 * @param {Minecraft.Player} player - The player to whom the menu is shown.
 * @param {Minecraft.Player} selectedPlayer - The malicous user to report.
 */
function otherType(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()
        .title(`Other - ${selectedPlayer.name}`)
        .button("Spam")
        .button("Inappropriate Chat")
        .button("Teaming")
        .button("Inappropriate Skin")
        .button("Inappropriate Name")
        .button("Xray")
        .button("Back");

    menu.show(player).then((response) => {
        
        switch (response.selection) {
            case 0: break;
            case 1: break;
            case 2: break;
            case 3: break;
            case 4: break;
            case 5: break;
            case 6: cheatType(player, selectedPlayer); break;
        }
        
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}