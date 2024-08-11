import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../data/config.js";
import data from "../data/data.js";
import { parseTime, uppercaseFirstLetter, tellStaff } from "../util.js";
import { addOp } from "../commands/staff/op.js";
import { removeOp } from "../commands/staff/deop.js";
import { addVanish, removeVanish } from "../commands/tools/vanish.js";
import { handleNotification } from "../commands/staff/notify.js";

//import { punishMenu } from "./sections/punishMenu.js";
//import { settingsMenu } from "./sections/settingsMenu.js";
//import { checksMenu } from "./sections/checksMenu.js";
//import { playerMenu } from "./sections/playerMenu.js";
import { worldMenu } from "./sections/worldMenu.js";        // Done
import { logsMenu } from "./sections/logsMenu.js";          // Done
import { debugMenu } from "./sections/debugMenu.js";        // Done

/**
 * Displays the UI that gets opened by the UI item.
 * @param {Object} player - The player to whom the menu is shown. 
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
        .button("Rosh Logs")
        .button("Debug Menu");
    
    // Show the menu to the player and handle the response
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



/**
 * Displays a menu with all available punishment options.
 * @param {Object} player - The player to whom the menu is shown.
 */
function punishMenu(player) {
    
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
            case 0: kickPlayerMenu(player); break;
            case 1: banPlayerMenu(player); break;
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
 * @param {Object} player - The player to whom the menu is shown. 
 * @param {Number} selection 
 */
function banMenuSelect(player, selection) {

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
 * 
 * @param {Object} player - The player to whom the menu is shown. 
 * @param {*} playerSelected 
 * @param {*} lastMenu  
 */
function kickPlayerMenu(player, playerSelected, lastMenu = 0) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for kicking another player
    const menu = new MinecraftUI.ModalFormData()
        .title(`Kick Player Menu - ${playerSelected.name}`)
        .textField("Kick Reason:", "§o§7No Reason Provided")
        .toggle("Silent", false);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        if (response.canceled) {
            switch (lastMenu) {
                case 0: banMenuSelect(player, lastMenu); break;
                case 1: playerMenuSelected(player, playerSelected);
            }
            return;
        }

        const input = response.formValues;
        const reasonUI = input[0] || "No Reason Provided";
        const isSilent = input[1];
        const reason = `§r${themecolor}Rosh §j> §cYou have been kicked for: §8${reasonUI} §c!`;

        if (!isSilent) {
            tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas kicked §8${playerSelected.name} §cfor: §8${reasonUI}§c.`);
            data.recentLogs.push(`§8${playerSelected.name} §chas been kicked by §8${player.name}§c!`);
            player.runCommandAsync(`kick "${playerSelected.name}" ${reason}`);
        } else {
            tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas kicked §8${playerSelected.name} §c(Silent) for: §8${reasonUI}§c.`);
            data.recentLogs.push(`§8${playerSelected.name} §chas been kicked (Silent) by §8${player.name}§c!`);
            playerSelected.triggerEvent("rosh:kick");
        }
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * 
 * @param {*} player 
 * @param {*} playerSelected 
 * @param {*} lastMenu  
 */
function banPlayerMenu(player, playerSelected, lastMenu = 0) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for banning another player
    const menu = new MinecraftUI.ModalFormData()
        .title(`Ban Player Menu - ${playerSelected.name}`)
        .textField("Ban Reason:", "§o§7No Reason Provided")
        .slider("Ban Length (in days)", 0, 365, 1)
        .toggle("Permanent Ban", true);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        if (response.canceled) {
            if (lastMenu === 0) banMenuSelect(player, lastMenu);
            if (lastMenu === 1) playerMenuSelected(player, playerSelected);
            return;
        }

        const input = response.formValues;
        const reason = input[0];
        const banLength = input[1] ? parseTime(`${input[1]}d`) : 0;
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
            player.sendMessage(`§r${themecolor}Rosh §j> §8${playerSelected.name} §cis an Operator and cannot be banned!`);
        } else {
            playerSelected.addTag(`Reason:${reason}`);
            if (banLength && !shouldPermBan) playerSelected.addTag(`Length:${Date.now() + banLength}`);
            playerSelected.addTag("isBanned");

            tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas banned §8${playerSelected.name} §cfor: §8${reason}§c.`);
            data.recentLogs.push(`§8${playerSelected.name} §chas been banned by §8${player.name}§c!`);

            // Save all ban-related information
            data.banList[playerSelected.name] = {
                bannedBy: player.name,
                date: new Date().toLocaleString(),
                reason: reason,
                duration: duration
            };
        }
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



/**
 * 
 * @param {*} player 
 */
function unbanPlayerMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for unbanning another player
    const menu = new MinecraftUI.ModalFormData()
        .title("Unban Player Menu")
        .textField("Player to unban:", "§o§7Enter player name")
        .textField("Unban Reason:", "§o§7No Reason Provided");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        
        if(response.canceled) return punishMenu(player);

        const responseData = String(response.formValues).split(",");
        const playerToUnban = responseData.shift().split(" ")[0];
        const reason = responseData.join(",").replace(/"|\\/g, "") || "No Reason Provided";

        if (!playerToUnban) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to unban.`);
            return unbanPlayerMenu(player);
        }

        data.unbanQueue.push(playerToUnban.toLowerCase());

        // Remove the ban information from data.banList
        delete data.banList[playerToUnban];

        tellStaff(`§r${themecolor}Rosh §j> §8${player.nameTag} §ahas added §8${playerToUnban} §ainto the unban queue for: §8${reason}§a.`);
        data.recentLogs.push(`§8${playerToUnban} §ahas been unbanned by §8${player.nameTag}§a!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



// ====================== //
//     Settings Menu      //
// ====================== //

function settingsMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for changing certain Rosh settings
    const menu = new MinecraftUI.ActionFormData()
        .title("Settings")
        .button(`Notifications\n${player.hasTag("notify") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Autoban\n${config.autoban ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Preset\n${config.preset === "stable" ? "§8Stable" : "§8Beta"}`)
        .button(`Themecolor\n${config.themecolor}Color`)
        .button(`Thememode\n§8${config.thememode}`)
        .button("Back");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        switch (response.selection) {
            case 0: handleNotification(player, themecolor); break;
            case 1: autobanMenu(player); break;
            case 2: presetMenu(player); break;
            case 3: themecolorMenu(player); break;
            case 4: thememodeMenu(player); break; 
            case 5: mainMenu(player); break;
        }
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

function autobanMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu to enable or disable automatically banning other players
    const menu = new MinecraftUI.ModalFormData()
        .title("Autoban")
        .toggle("Enable Autoban", config.autoban);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        if (response.canceled) {
            return settingsMenu(player);
        }

        config.autoban = response.formValues[0];
        world.setDynamicProperty("config", JSON.stringify(config));

        player.sendMessage(`§r${themecolor}Rosh §j> ${config.autoban ? "§a" : "§c"}Auto-baning is now ${config.autoban ? "enabled" : "disabled"}!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

function presetMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const currentPresetIndex = config.preset === "stable" ? 0 : 1;

    // Create a menu to choose between the stable and beta preset
    const menu = new MinecraftUI.ModalFormData()
       .title("Choose preset")
       .dropdown("Preset", ["Stable", "Beta"], currentPresetIndex);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        if (response.canceled) {
            return settingsMenu(player);
        }

        const selectedPreset = response.formValues[0];
        if ((selectedPreset === 0 && config.preset === "stable") || (selectedPreset === 1 && config.preset === "beta")) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cPreset is already set to §8${selectedPreset === 0 ? "Stable" : "Beta"}§c!`);
            return;
        }

        if (selectedPreset === 0) {
            config.preset = "stable";
        } else if (selectedPreset === 1) {
            config.preset = "beta";
        }

        try {
            world.setDynamicProperty("config", JSON.stringify(config));
            player.sendMessage(`§r${themecolor}Rosh §j> §aSet the preset to §8${selectedPreset === 0 ? "Stable" : "Beta"}§a.`);
        } catch (error) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cFailed to set the preset. Please try again.`);
            console.error("Failed to set dynamic property 'config':", error);
        }
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

function themecolorMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const themecolors = [
        "§1Color", "§2Color", "§3Color", "§4Color", "§5Color", "§6Color", "§7Color", "§8Color", "§9Color", "§0Color", "§qColor", "§eColor", "§rColor", 
        "§tColor", "§uColor", "§iColor", "§pColor", "§aColor", "§sColor", "§dColor", "§gColor", "§hColor", "§jColor", "§cColor", "§bColor", "§nColor", "§mColor"
    ];

    const currentColorIndex = themecolors.indexOf(themecolor + "Color");

    // Create a menu to select the color to use for Rosh
    const menu = new MinecraftUI.ModalFormData()
        .title("Choose Themecolor")
        .dropdown("Color", themecolors, currentColorIndex);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        if (response.canceled) {
            return settingsMenu(player);
        }

        const selectedColor = themecolors[response.formValues[0]];

        if (selectedColor.substring(0, 2) === config.themecolor) {
            player.sendMessage(`§r${selectedColor.substring(0, 2)}Rosh §j> §cThemecolor is already set to ${selectedColor.substring(0, 2)}Color§c!`);
            return;
        }

        config.themecolor = selectedColor.substring(0, 2);
        world.setDynamicProperty("config", JSON.stringify(config)); // Extracting the color code without "Color"
        player.sendMessage(`§r${selectedColor.substring(0, 2)}Rosh §j> §aThemecolor set to ${selectedColor.substring(0, 2)}Color§a!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

function thememodeMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const thememode = config.thememode;
    const thememodes = ["Rosh", "Alice"];

    const currentModeIndex = thememodes.indexOf(thememode);

    // Create a menu to select the theme-mode to use for Rosh
    const menu = new MinecraftUI.ModalFormData()
        .title("Choose Thememode")
        .dropdown("Mode", thememodes, currentModeIndex);

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        if (response.canceled) {
            return settingsMenu(player);
        }

        const selectedMode = thememodes[response.formValues[0]];

        if (selectedMode === config.thememode) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cThememode is already set to §8${selectedMode}§c!`);
            return;
        }

        config.thememode = selectedMode;
        world.setDynamicProperty("config", JSON.stringify(config));
        player.sendMessage(`§r${themecolor}Rosh §j> §aThememode set to §8${selectedMode}§a!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}


const moduleList = Object.keys(config.modules).concat(Object.keys(config.misc_modules));
const modules = [];

for (const fullModule of moduleList) {
    
    if (fullModule.startsWith("example")) continue;
    const module = fullModule[fullModule.length - 1].toUpperCase() === fullModule[fullModule.length - 1] ? fullModule.slice(0, fullModule.length - 1) : fullModule;

    if (modules.includes(module)) continue;
    modules.push(module);
}

const punishments = {
    none: 0,
    mute: 1,
    kick: 2,
    ban: 3
};

const punishmentSettings = [
    "punishment",
    "punishmentLength",
    "minVlbeforePunishment"
];

// ====================== //
//     Modules Menu       //
// ====================== //

/**
 * 
 * @param {Object} player - The player to whom the menu is shown.
 */
function checksMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu that shows all categorised checks
    const menu = new MinecraftUI.ActionFormData()
        .title("Checks")

    for (const subModule of modules) {
        menu.button(uppercaseFirstLetter(subModule));
    }

    menu.button("Back");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        if (!modules[response.selection ?? - 1]) return mainMenu(player);

        modulesCheckSelectMenu(player, response.selection);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a menu to configure checks for a specific module category.
 * This menu shows sub-checks related to the selected module and allows the player
 * to navigate to another menu for editing individual check settings.
 * 
 * @param {Object} player - The player to whom the menu is shown. This object represents the player in the game.
 * @param {*} selection - The selected module or category which determines which checks are shown in the menu.
 * @returns {void}
 */
function modulesCheckSelectMenu(player, selection) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const subCheck = modules[selection];

    // Create a menu to display all sub-checks of one check category
    const menu = new MinecraftUI.ActionFormData()
        .title("Configure Checks");

    const checks = [];
    for (const module of moduleList) {
        if (!module.startsWith(subCheck)) continue;
        checks.push(module);

        const checkData = config.modules[module] ?? config.misc_modules[module];
        menu.button(`${uppercaseFirstLetter(subCheck)}/${module[module.length - 1]}\n${checkData.enabled ? "§8[§a+§8]" : "§8[§c-§8]"}`);
    }

    if (checks.length === 1) return editChecksMenu(player, checks[0], selection);

    menu.button("Back");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        const selection = response.selection ?? -1;

        if (!checks[selection]) return checksMenu(player);

        editChecksMenu(player, checks[selection], selection);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}


/**
 * Displays a menu for editing the settings of a specific check for a player.
 * This menu allows the player to modify settings for the specified check and
 * provides a way to return to the previous menu.
 * 
 * @param {Object} player - The player to whom the menu is shown. This object represents the player in the game.
 * @param {string} check - The key of the check in the config to be edited. This determines which check's settings will be shown.
 * @param {*} previousSelection - The previous selection or module category, used to return to the previous menu.
 * @returns {void}
 */
function editChecksMenu(player, check, previousSelection) {
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const fancyCheck = check.replace(/([A-Z])/g, '/$1').replace(/^./, str => str.toUpperCase());
    const checkData = config.modules[check] ?? config.misc_modules[check];
    let optionsMap = [];
    const originalCheckData = { ...checkData }; // Save a copy of the original check data

    // Create a menu to edit the sub-check's settings
    const menu = new MinecraftUI.ModalFormData()
        .title(`Editing ${fancyCheck}`);

    for (const key of Object.keys(checkData)) {
        if (punishmentSettings.includes(key)) continue;

        const settingName = uppercaseFirstLetter(key).replace(/_./g, (match) => " " + match[1].toUpperCase());

        switch (typeof checkData[key]) {
            case "number":
                const maxSliderValue = checkData[key] > 100 ? checkData[key] : 100;
                const step = Number.isInteger(checkData[key]) ? 1 : 0.01;
                menu.slider(settingName, 0, maxSliderValue, step, checkData[key]);
                optionsMap.push(key);
                break;
            case "boolean":
                menu.toggle(settingName, checkData[key]);
                optionsMap.push(key);
                break;
            case "string":
                menu.textField(settingName, "Enter text here", checkData[key]);
                optionsMap.push(key);
                break;
        }
    }

    if (checkData.punishment) {
        menu.dropdown("Punishment", Object.keys(punishments), punishments[checkData.punishment]);
        menu.textField("Length", "Ex: 1d, 30s, ...", checkData["punishmentLength"]);
        menu.slider("Minimum Violations", 0, 20, 1, checkData["minVlbeforePunishment"]);

        optionsMap = optionsMap.concat(punishmentSettings);
    }

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {
        if (response.canceled) return;

        const formValues = response.formValues ?? [];
        let isChanged = false;

        for (const optionid in optionsMap) {
            const name = optionsMap[optionid];
            const newValue = name === "punishment" ? Object.keys(punishments)[formValues[optionid]] : formValues[optionid];
            
            if (checkData[name] !== newValue) {
                isChanged = true;
            }
            
            checkData[name] = newValue;
        }

        if (isChanged) {
            world.setDynamicProperty("config", JSON.stringify(config));
            player.sendMessage(`${themecolor}Rosh §j> §aUpdated the settings for §8${fancyCheck}§a:\n§8${JSON.stringify(checkData, null, 2)}`);
        } else {
            player.sendMessage(`${themecolor}Rosh §j> §8${fancyCheck} §cwas already set to the provided values.`);
        }

        // Return to the previous menu
        modulesCheckSelectMenu(player, previousSelection);
        
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}




/**
 * Displays a list of all available players to manage.
 * @param {Object} player - The player to whom the menu is shown. 
 */
function playerMenu(player) {
    
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

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

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



//TODO: Implement the new command features (Other: Comments, JSDocs, etc.)
//FIXME: BadPackets/H in fly mode, etc.

/**
 * Displays a menu with various options for managing another player.
 * @param {Object} player - The player to whom the menu is shown. 
 * @param {Object} selectedPlayer - The player who is getting managed.
 */
export function playerMenuSelected(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with various options for managing the selected player
    const menu = new MinecraftUI.ActionFormData()
        .title(`Manage ${selectedPlayer.name}`)
        .body(
            `§8Coordinates: ${Math.floor(selectedPlayer.location.x)}, ${Math.floor(selectedPlayer.location.y)}, ${Math.floor(selectedPlayer.location.z)}\n` + 
            `Dimension: ${uppercaseFirstLetter((selectedPlayer.dimension.id).replace("minecraft:", ""))}\n` + 
            `Operator: ${selectedPlayer.isOp() ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Muted: ${selectedPlayer.hasTag("isMuted") ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Frozen: ${selectedPlayer.hasTag("frozen") ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Vanished: ${selectedPlayer.hasTag("vanish") ? "§8[§a+§8]" : "§8[§c-§8]"}\n` + 
            `Fly Mode: ${selectedPlayer.hasTag("flying") ? "§8[§a+§8]" : "§8[§c-§8]"}`
        )
        .button("Clear EnderChest")  // Fixed
        .button("Kick Player")       // Fixed
        .button("Ban Player")        // Fixed
        .button(`${selectedPlayer.hasTag("flying") ? "Disable Fly Mode" : "Enable Fly Mode"}`) // Fixed
        .button(`${selectedPlayer.hasTag("frozen") ? "Unfreeze Player" : "Freeze Player"}`)    // Fixed
        .button(`${selectedPlayer.hasTag("isMuted") ? "Unmute Player" : "Mute Player"}`)       // Fixed
        .button(`${selectedPlayer.isOp() ? "Remove Operator status" : "Set as Operator"}`)     // Fixed
        .button(`${selectedPlayer.hasTag("vanish") ? "Unvanish Player" : "Vanish Player"}`)    // Fixed   
        .button("Teleport")        // Fixed
        .button("Switch Gamemode") // Fixed
        .button("View Logs")       // Broken (needs to be improved)
        .button('Killaura Check')  // Broken (needs to be improved)
        .button("Back");

    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        switch (response.selection) {

            case 0:
                clearEnderchest(selectedPlayer);
                selectedPlayer.sendMessage(`${themecolor}Rosh §j> §cYour ender chest has been cleared by §8${player.name}§c.`)
                player.sendMessage(`${themecolor}Rosh §j> §cYou have cleared §8${selectedPlayer.name}'s §cenderchest.`);
                playerMenuSelected(player, selectedPlayer);
                break;

            case 1:
                kickPlayerMenu(player, selectedPlayer, 1);
                break;

            case 2:
                banPlayerMenu(player, selectedPlayer, 1);
                break;

            case 3:
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

            case 4:
                if (selectedPlayer.hasTag("frozen")) {
                    selectedPlayer.removeTag("frozen");
                    selectedPlayer.sendMessage(`§r${themecolor}Rosh §j> §aYou are no longer frozen.`);
                    selectedPlayer.runCommandAsync("inputpermission set @s movement enabled");
                    selectedPlayer.runCommandAsync("inputpermission set @s camera enabled");
                    selectedPlayer.runCommandAsync(`hud @s reset`);
                    player.sendMessage(`§r${themecolor}Rosh §j> §aYou have unfrozen §8${selectedPlayer.name}§a.`);
                } else {
                    // Prevent freezing yourself
                    if (selectedPlayer.id === player.id) {
                        player.sendMessage(`${themecolor}Rosh §j> §cYou can't freeze yourself.`);
                        return;
                    }
                    selectedPlayer.addTag("frozen");
                    selectedPlayer.sendMessage(`§r${themecolor}Rosh §j> §cYou are now frozen.`);
                    selectedPlayer.runCommandAsync("inputpermission set @s movement disabled");
                    selectedPlayer.runCommandAsync("inputpermission set @s camera disabled");
                    selectedPlayer.runCommandAsync(`hud @s hide`);
                    player.sendMessage(`§r${themecolor}Rosh §j> §cYou have frozen §8${selectedPlayer.name}§c.`);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 5:
                if (selectedPlayer.hasTag("isMuted")) {
                    selectedPlayer.removeTag("isMuted");
                    selectedPlayer.sendMessage(`${themecolor}Rosh §j> §aYou are no longer muted.`);
                    selectedPlayer.runCommandAsync("ability @s mute false");
                    player.sendMessage(`${themecolor}Rosh §j> §aYou have unmuted §8${selectedPlayer.id === player.id ? "§ayourself" : `${selectedPlayer.name}`}§a.`);
                } else {
                    // Prevent muting yourself
                    if (selectedPlayer.id === player.id) {
                        player.sendMessage(`${themecolor}Rosh §j> §cYou can't mute yourself.`);
                        return;
                    }
                    selectedPlayer.addTag("isMuted");
                    selectedPlayer.sendMessage(`${themecolor}Rosh §j> §cYou are now muted.`);
                    selectedPlayer.runCommandAsync("ability @s mute true");
                    player.sendMessage(`${themecolor}Rosh §j> §cYou have muted §8${selectedPlayer.name}§c.`);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 6:
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

            case 7:
                if (selectedPlayer.hasTag("vanish")) {
                    removeVanish(selectedPlayer, themecolor);
                } else {
                    addVanish(selectedPlayer, themecolor);
                }
                playerMenuSelected(player, selectedPlayer);
                break;

            case 8: playerMenuTeleport(player, selectedPlayer); break;
            case 9: playerMenuGamemode(player, selectedPlayer); break;
            case 10: selectedPlayer.runCommandAsync("function tools/stats"); break;         // TODO
            case 11: selectedPlayer.runCommandAsync("summon rosh:killaura ~ ~4 ~3"); break; // TODO
            case 12: playerMenu(player); break;
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays the teleport menu to allow for easy teleportation between players.
 * @param {Object} player - The player to whom the menu is shown. 
 * @param {Object} selectedPlayer - The second player to execute the teleport with.
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
            `§aDimension: §8${uppercaseFirstLetter((selectedPlayer.dimension.id).replace("minecraft:", ""))}`
        )
        .button(`Teleport to ${selectedPlayer.name}`)
        .button(`Teleport ${selectedPlayer.name} to you`)
        .button("Back");
    
    // Show the menu to the player and handle the response
    menu.show(player).then((response) => {

        switch(response.selection) {
            case 0:
                player.tryTeleport(selectedPlayer.location, {
                    checkForBlocks: false,
                    dimension: selectedPlayer.dimension, 
                    keepVelocity: false
                }); 
                player.sendMessage(`${themecolor}Rosh §j> §aYou have been teleported to ${selectedPlayer.id === player.id ? "yourself" : `§8${selectedPlayer.name}`}§a.`);
                break;

            case 1:
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
 * Changes a player's gamemode.
 * @param {Object} player - The player to whom the menu is shown. 
 * @param {Object} selectedPlayer - The player whos gamemode should be changed.
 */
function playerMenuGamemode(player, selectedPlayer) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu for changing gamemodes
    const menu = new MinecraftUI.ActionFormData()
        .title(`Gamemode Menu - ${selectedPlayer.name}`)
        .body(`§aGamemode: §8${uppercaseFirstLetter(selectedPlayer.getGameMode())}`)
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
 * @param {Object} selectedPlayer - The player whose gamemode to change.
 * @param {Object} player - The player who initiated the change.
 * @param {String} gamemode - The gamemode to which the selected player should be updated.
 */
function updateGameMode(selectedPlayer, player, gamemode) {

    const themecolor = config.themecolor;

    // Checks if the player has the neccessary privileges to change to a specific gamemode
    if (gamemode === "creative" || gamemode === "spectator" && !selectedPlayer.isOp()) {
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
    player.sendMessage(`${themecolor}Rosh §j> ${selectedPlayer.id === player.id ? "§aYour" : `§8${selectedPlayer.name}'s`} §agamemode is now §8${uppercaseFirstLetter(selectedPlayer.getGameMode())}§a.`);
}