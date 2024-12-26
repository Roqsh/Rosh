import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../../data/config.js";
import { tellStaff } from "../../util.js";
import { clearEnderchest } from "../../commands/tools/ecwipe.js";
import { addOp } from "../../commands/staff/op.js";
import { removeOp } from "../../commands/staff/deop.js";
import { addVanish, removeVanish } from "../../commands/tools/vanish.js";
import { summonAuraBot } from "../../commands/tools/testaura.js";
import { getViolations } from "../../commands/staff/violations.js";
import { mainMenu } from "../mainMenu.js";
import { kickPlayerMenu, banPlayerMenu } from "./punishMenu.js";
import { String } from "../../utils/String.js";

/**
 * Displays a list of all available players to manage.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 */
export function playerMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const allPlayers = world.getAllPlayers();

    // Create a menu that lists all currently active players
    const menu = new MinecraftUI.ActionFormData()
        .title("Manage Players")
    
        // Gets all available players
        for (const plr of allPlayers) {

            let playerName = `${plr.name}`;

            // Check if the player name matches the initiator's name and marks it with "You"
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

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

        if ([...allPlayers].length > response.selection) {
            playerMenuSelected(player, [...allPlayers][response.selection]);
        } else {
            mainMenu(player);
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a menu with various options for managing another player.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 * @param {import("@minecraft/server").Player} selectedPlayer - The player who is getting managed.
 */
export function playerMenuSelected(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    let device = "§oUnknown§r§8";
    let input = "§oUnknown§r§8";

    try {
        device = selectedPlayer.clientSystemInfo.platformType;
        input = selectedPlayer.inputInfo.lastInputModeUsed;
    } catch (error) {
        console.warn(`Unable to retrieve device and input information for ${selectedPlayer.name}. This can be safely ignored.`);
    }

    // Create a menu with various options for managing the selected player
    const menu = new MinecraftUI.ActionFormData()
        .title(`Manage ${selectedPlayer.name}`)
        .body(
            `§8Coordinates: ${Math.floor(selectedPlayer.location.x)}, ${Math.floor(selectedPlayer.location.y)}, ${Math.floor(selectedPlayer.location.z)}\n` + 
            `Dimension: ${String.toUpperCase((selectedPlayer.dimension.id).replace("minecraft:", ""))}\n` + 
            `Gamemode: ${String.toUpperCase(selectedPlayer.getGameMode())}\n` + 
            `Device: ${device}\n` + 
            `Input: ${input}\n` +
            `Operator: ${selectedPlayer.isOp() ? "§8[§a+§8]" : "§8[§c-§8]"}\n\n` +

            `Muted: ${selectedPlayer.hasTag("isMuted") ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Frozen: ${selectedPlayer.hasTag("frozen") ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Vanished: ${selectedPlayer.hasTag("vanish") ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Fly Mode: ${selectedPlayer.hasTag("flying") ? "§8[§a+§8]" : "§8[§c-§8]"}`
        )
        .button("Report Player") // 0
        .button("Kick Player") // 1
        .button("Ban Player") // 2
        .button(`${selectedPlayer.hasTag("frozen") ? "Unfreeze Player" : "Freeze Player"}`) // 3
        .button(`${selectedPlayer.hasTag("isMuted") ? "Unmute Player" : "Mute Player"}`) //4
        .button(`${selectedPlayer.isOp() ? "Remove Operator status" : "Set as Operator"}`) // 5
        .button(`${selectedPlayer.hasTag("vanish") ? "Unvanish Player" : "Vanish Player"}`) // 6
        .button(`${selectedPlayer.hasTag("flying") ? "Disable Fly Mode" : "Enable Fly Mode"}`) // 7
        .button("Clear EnderChest") // 8
        .button("Teleport") // 9
        .button("Switch Gamemode") // 10
        .button("View Violations") // 11
        .button('Killaura Check') // 12
        .button("Back"); // 13

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        switch (response.selection) {

            case 8:
                clearEnderchest(selectedPlayer);
                player.sendMessage(`${themecolor}Rosh §j> §cYou have cleared §8${selectedPlayer.name}'s §cenderchest.`);
                playerMenuSelected(player, selectedPlayer);
                break;

            case 0: player.sendMessage(`${themecolor}Rosh §j> §o§aSoon... !`); break;
            case 1: kickPlayerMenu(player, selectedPlayer, 1); break;
            case 2: banPlayerMenu(player, selectedPlayer, 1); break;

            case 7:

                if (selectedPlayer.hasTag("flying")) {
                    selectedPlayer.removeTag("flying");
                    selectedPlayer.runCommandAsync("ability @s mayfly false");
                    selectedPlayer.sendMessage(`${themecolor}Rosh §j> §cYou are no longer in fly mode.`);
                    tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas disabled fly mode for §8${selectedPlayer.name}§c.`);
                } else {
                    selectedPlayer.addTag("flying");
                    selectedPlayer.runCommandAsync("ability @s mayfly true");
                    selectedPlayer.sendMessage(`§r${themecolor}Rosh §j> §aYou are now in fly mode.`);
                    tellStaff(`${themecolor}Rosh §j> §8${player.name} §ahas enabled fly mode for §8${selectedPlayer.name}§a.`);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 3:

                if (selectedPlayer.isFrozen()) {
                    selectedPlayer.unfreeze();
                    selectedPlayer.sendMessage(`§r${themecolor}Rosh §j> §aYou are no longer frozen.`);
                    player.sendMessage(`${themecolor}Rosh §j> §aYou have unfrozen §8${selectedPlayer.id === player.id ? "§ayourself" : `${selectedPlayer.name}`}§a.`);
                } else {
                    // Prevent freezing Operators
                    if (selectedPlayer.isOp()) {
                        player.sendMessage(`${themecolor}Rosh §j> §8${selectedPlayer.name} §cis an Operator and cannot be frozen!`);
                        return;
                    }
                    selectedPlayer.freeze();
                    selectedPlayer.sendMessage(`${themecolor}Rosh §j> §cYou are now frozen.`);
                    player.sendMessage(`${themecolor}Rosh §j> §cYou have frozen §8${selectedPlayer.name}§c.`);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 4:

                if (selectedPlayer.isMuted()) {
                    selectedPlayer.unmute();
                    selectedPlayer.sendMessage(`${themecolor}Rosh §j> §aYou are no longer muted.`);
                    player.sendMessage(`${themecolor}Rosh §j> §aYou have unmuted §8${selectedPlayer.id === player.id ? "§ayourself" : `${selectedPlayer.name}`}§a.`);
                } else {
                    // Prevent muting Operators
                    if (selectedPlayer.isOp()) {
                        player.sendMessage(`${themecolor}Rosh §j> §8${selectedPlayer.name} §cis an Operator and cannot be muted!`);
                        return;
                    }
                    selectedPlayer.mute();
                    selectedPlayer.sendMessage(`${themecolor}Rosh §j> §cYou are now muted.`);
                    player.sendMessage(`${themecolor}Rosh §j> §cYou have muted §8${selectedPlayer.name}§c.`);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 5:
                if (selectedPlayer.isOp()) {
                    // Prevent deopping oneself
                    if (selectedPlayer.id === player.id) {
                        player.sendMessage(`${themecolor}Rosh §j> §cYou can't deop yourself.`);
                        return;
                    }
                    removeOp(selectedPlayer);
                    tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas removed Operator status from §8${selectedPlayer.name}§c.`);
                } else {
                    tellStaff(`${themecolor}Rosh §j> §8${player.name} §ahas given §8${selectedPlayer.name} §aOperator status.`);
                    addOp(selectedPlayer);
                    playerMenuSelected(player, selectedPlayer);
                }
                break;

            case 6:
                if (selectedPlayer.hasTag("vanish")) {
                    removeVanish(selectedPlayer, themecolor);
                } else {
                    addVanish(selectedPlayer, themecolor);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 9: playerMenuTeleport(player, selectedPlayer); break;
            case 10: playerMenuGamemode(player, selectedPlayer); break;
            case 11: getViolations(player, selectedPlayer); break;
            case 12: summonAuraBot(player, selectedPlayer); break;
            case 13: playerMenu(player); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays the teleport menu to allow for easy teleportation between players.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 * @param {import("@minecraft/server").Player} selectedPlayer - The second player to execute the teleport with.
 */
function playerMenuTeleport(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu for easier teleportation
    const menu = new MinecraftUI.ActionFormData()
        .title(`Teleport Menu - ${selectedPlayer.name}`)
        .body(
            `§aLocation: §8${Math.floor(selectedPlayer.location.x)}§a, §8${Math.floor(selectedPlayer.location.y)}§a, §8${Math.floor(selectedPlayer.location.z)}\n` +
            `§aDimension: §8${String.toUpperCase((selectedPlayer.dimension.id).replace("minecraft:", ""))}`
        )
        .button(`Teleport to ${selectedPlayer.name}`)
        .button(`Teleport ${selectedPlayer.name} to you`)
        .button("Back");
    
    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        switch(response.selection) {
            case 0:
                // Teleport the player to the selected player's location
                player.tryTeleport(selectedPlayer.location, {
                    checkForBlocks: false,
                    dimension: selectedPlayer.dimension, 
                    keepVelocity: false
                }); 
                player.sendMessage(`${themecolor}Rosh §j> §aYou have been teleported to ${selectedPlayer.id === player.id ? "yourself" : `§8${selectedPlayer.name}`}§a.`);
                break;

            case 1:
                // Teleport the selected player to the player's location
                selectedPlayer.tryTeleport(player.location, {
                    checkForBlocks: false,
                    dimension: player.dimension,
                    keepVelocity: false
                });
                player.sendMessage(`${themecolor}Rosh §j> §8${selectedPlayer.name} §ahas been teleported to you.`); 
                break;

            case 2: playerMenuSelected(player, selectedPlayer); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a menu to change a player's gamemode.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. 
 * @param {import("@minecraft/server").Player} selectedPlayer - The player whos gamemode should be changed.
 */
function playerMenuGamemode(player, selectedPlayer) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu for changing gamemodes
    const menu = new MinecraftUI.ActionFormData()
        .title(`Gamemode Menu - ${selectedPlayer.name}`)
        .body(`§aGamemode: §8${String.toUpperCase(selectedPlayer.getGameMode())}`)
        .button("Adventure")
        .button("Survival")
        .button("Creative")
        .button("Spectator")
        .button("Back");
    
    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0: updateGameMode(selectedPlayer, player, "adventure"); break;
            case 1: updateGameMode(selectedPlayer, player, "survival"); break;
            case 2: updateGameMode(selectedPlayer, player, "creative"); break;
            case 3: updateGameMode(selectedPlayer, player, "spectator"); break;
            case 4: playerMenuSelected(player, selectedPlayer); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Updates the gamemode of the selected player.
 * @param {import("@minecraft/server").Player} selectedPlayer - The player whose gamemode to change.
 * @param {import("@minecraft/server").Player} player - The player who initiated the change.
 * @param {string} gamemode - The gamemode to which the selected player should be updated.
 */
function updateGameMode(selectedPlayer, player, gamemode) {

    const themecolor = config.themecolor;

    // Checks if the player has the neccessary privileges to change to a specific gamemode
    if ((gamemode === "creative" || gamemode === "spectator") && !selectedPlayer.isOp()) {
        player.sendMessage(`${themecolor}Rosh §j> §8${selectedPlayer.name} §cdoesn't have the neccessary privileges to switch to that gamemode.`);
        return;
    }

    // Checks if the player already is in the specified gamemode.
    if (gamemode === selectedPlayer.getGameMode()) {
        player.sendMessage(`${themecolor}Rosh §j> §8${selectedPlayer.id === player.id ? "§cYou are" : `${selectedPlayer.name} §cis`} §calready in that gamemode.`);
        return;
    }

    // Update the gamemode of the player and notify them about the change
    selectedPlayer.setGameMode(gamemode);
    player.sendMessage(`${themecolor}Rosh §j> ${selectedPlayer.id === player.id ? "§aYour" : `§8${selectedPlayer.name}'s`} §agamemode is now §8${String.toUpperCase(selectedPlayer.getGameMode())}§a.`);
}