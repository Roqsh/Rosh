import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../data/config.js";
import data from "../data/data.js";
import { parseTime, uppercaseFirstLetter, tellStaff } from "../util.js";
import { addOp } from "../commands/staff/op.js";
import { removeOp } from "../commands/staff/deop.js";
import { addVanish, removeVanish } from "../commands/tools/vanish.js";
import { clearEnderchest } from "../commands/tools/ecwipe.js";
import { handleNotification } from "../commands/staff/notify.js";

import { worldSettingsMenu } from "./sections/worldSettingsMenu.js";
import { logsMenu } from "./sections/logsMenu.js";

/**
 * Displays the UI that gets opened by the UI item.
 * @param {Object} player - The player to whom the menu is shown. 
 */
export function mainGui(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()

		.title("Rosh Settings")
		.button("Punish Menu")
        .button("Settings")
        .button("Modules")
        .button(`Manage Players\n§8§o${[...world.getPlayers()].length} online`)
        .button("Server Options")
        .button("Rosh Logs")
        .button("Debug Menu");
    
    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0:
                punishMenu(player);
                break;
            case 1:
                settingsMenu(player);
                break;
            case 2:
                modulesMenu(player);
                break;
            case 3:
                playerSettingsMenu(player);
                break;
            case 4:
                worldSettingsMenu(player);
                break;
            case 5:
                logsMenu(player);
                break;
            case 6:
                debugSettingsMenu(player);
                break;
        }

    }).catch((error) => {
        // Handle promise rejection
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred while displaying the main menu. Please try again.`);
        console.error("Error showing main menu: ", error);
    });
}


// ====================== //
//       Punish Menu      //
// ====================== //

function punishMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()

        .title("Punish Menu")
        .button("Kick Player")
        .button("Ban Player")
        .button("Unban Player")
        .button("Back");
    
    menu.show(player).then((response) => {

        if (response.selection === 0) banMenuSelect(player, response.selection);
        if (response.selection === 1) banMenuSelect(player, response.selection);
        if (response.selection === 2) unbanPlayerMenu(player);
        if (response.selection === 3) mainGui(player);

    });
}

function banMenuSelect(player, selection) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");
    const themecolor = config.themecolor;

    const allPlayers = world.getPlayers();

    const menu = new MinecraftUI.ActionFormData()

        .title("Punish Menu");
    
    for(const plr of allPlayers) {

        let playerName = `${plr.name}`;
        if(plr.id === player.id) playerName += " - You";
        if(plr.isOp()) playerName += `\n§8[${themecolor}Op§8]`;
        menu.button(playerName);
    }

    menu.button("Back");

    menu.show(player).then((response) => {

        if(response.canceled) return punishMenu(player);
       
        if([...allPlayers].length > response.selection) {         
            if(selection === 0) kickPlayerMenu(player, [...allPlayers][response.selection]);          
            if(selection === 1) banPlayerMenu(player, [...allPlayers][response.selection]);
        } else punishMenu(player);
    });
}

function kickPlayerMenu(player, playerSelected, lastMenu = 0) {

    const themecolor = config.themecolor;

    if (!config.customcommands.kick.enabled) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §cKicking players is disabled in config.js.`);
    }

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ModalFormData()

        .title("Kick Player Menu - " + playerSelected.name)
        .textField("Kick Reason:", "§o§7No Reason Provided")
        .toggle("Silent", false);

    menu.show(player).then((response) => {

        if (response.canceled) {
            switch (lastMenu) {
                case 0:
                    banMenuSelect(player, lastMenu);
                    break;
                case 1:
                    playerSettingsMenuSelected(player, playerSelected);
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
    });
}

function banPlayerMenu(player, playerSelected, lastMenu = 0) {

    const themecolor = config.themecolor;
    
    if (!config.customcommands.ban.enabled) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §cBanning players is disabled in config.js.`);
    }

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ModalFormData()
        .title("Ban Player Menu - " + playerSelected.name)
        .textField("Ban Reason:", "§o§7No Reason Provided")
        .slider("Ban Length (in days)", 0, 365, 1)
        .toggle("Permanent Ban", true);

    menu.show(player).then((response) => {
        if (response.canceled) {
            if (lastMenu === 0) banMenuSelect(player, lastMenu);
            if (lastMenu === 1) playerSettingsMenuSelected(player, playerSelected);
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
    });
}

function unbanPlayerMenu(player) {

    const themecolor = config.themecolor;

    if (!config.customcommands.unban.enabled) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §cUnbanning players is disabled in config.js.`);
    }

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ModalFormData()

        .title("Unban Player Menu")
        .textField("Player to unban:", "§o§7Enter player name")
        .textField("Unban Reason:", "§o§7No Reason Provided");

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
    });
}


// ====================== //
//     Settings Menu      //
// ====================== //

function settingsMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()
        .title("Settings")
        .button(`Notifications\n${player.hasTag("notify") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Autoban\n${config.autoban ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Preset\n${config.preset === "stable" ? "§8Stable" : "§8Beta"}`)
        .button(`Themecolor\n${config.themecolor}Color`)
        .button(`Thememode\n§8${config.thememode}`)
        .button("Back");

    menu.show(player).then((response) => {
        switch (response.selection) {
            case 0:
                handleNotification(player, themecolor);
                break;
            case 1:
                autobanMenu(player);
                break;
            case 2:
                presetMenu(player);
                break;
            case 3:
                themecolorMenu(player);
                break;
            case 4:
                thememodeMenu(player);
                break;
            case 5:
                mainGui(player);
                break;
        }
    });
}

function autobanMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ModalFormData()
        .title("Autoban")
        .toggle("Enable Autoban", config.autoban);

    menu.show(player).then((response) => {
        if (response.canceled) {
            return settingsMenu(player);
        }

        config.autoban = response.formValues[0];
        world.setDynamicProperty("config", JSON.stringify(config));

        player.sendMessage(`§r${themecolor}Rosh §j> ${config.autoban ? "§a" : "§c"}Auto-baning is now ${config.autoban ? "enabled" : "disabled"}!`);
    });
}

function presetMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const currentPresetIndex = config.preset === "stable" ? 0 : 1;

    const menu = new MinecraftUI.ModalFormData()

       .title("Choose preset")
       .dropdown("Preset", ["Stable", "Beta"], currentPresetIndex);

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
        player.sendMessage(`§r${themecolor}Rosh §j> §cAn error occurred. Please try again.`);
        console.error("Error showing presets menu:", error);
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

    const menu = new MinecraftUI.ModalFormData()
        .title("Choose Themecolor")
        .dropdown("Color", themecolors, currentColorIndex);

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
        console.error("Error showing themecolor menu:", error);
    });
}

function thememodeMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const thememode = config.thememode;
    const thememodes = ["Rosh", "Alice"];

    const currentModeIndex = thememodes.indexOf(thememode);

    const menu = new MinecraftUI.ModalFormData()
        .title("Choose Thememode")
        .dropdown("Mode", thememodes, currentModeIndex);

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
        player.sendMessage("Error showing thememode menu:", error);
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

function modulesMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const settings_menu = new MinecraftUI.ActionFormData()

        .title("Modules")

    for(const subModule of modules) {
        settings_menu.button(uppercaseFirstLetter(subModule));
    }

    settings_menu.button("Back");

    settings_menu.show(player).then((response) => {
        if(!modules[response.selection ?? -1]) return mainGui(player);

        modulesCheckSelectMenu(player, response.selection);
    });
}

function modulesCheckSelectMenu(player, selection) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const subCheck = modules[selection];

    const menu = new MinecraftUI.ActionFormData()

        .title("Configure Modules")

    const checks = [];
    for(const module of moduleList) {
        if(!module.startsWith(subCheck)) continue;
        checks.push(module);

        const checkData = config.modules[module] ?? config.misc_modules[module];
        menu.button(`${uppercaseFirstLetter(subCheck)}/${module[module.length - 1]}\n${checkData.enabled ? "§8[§a+§8]" : "§8[§c-§8]"}`);
    }

    if(checks.length === 1) return editModulesMenu(player, checks[0]);

    menu.button("Back");

    menu.show(player).then((response) => {
        const selection = response.selection ?? - 1;

        if(!checks[selection]) return modulesMenu(player);

        editModulesMenu(player, checks[selection]);
    });
}

function editModulesMenu(player, check) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Retrieve the check data from either modules or misc_modules
    const checkData = config.modules[check] ?? config.misc_modules[check];
    let optionsMap = [];

    const menu = new MinecraftUI.ModalFormData()
        .title(`Editing ${uppercaseFirstLetter(check)}`);

    for (const key of Object.keys(checkData)) {
        // Skip keys that are in the punishmentSettings array
        if (punishmentSettings.includes(key)) continue;

        // Convert the setting key to a more user-friendly format
        const settingName = uppercaseFirstLetter(key).replace(/_./g, (match) => " " + match[1].toUpperCase());

        switch (typeof checkData[key]) {
            case "number":
                // Determine the max value for the slider (either 100 or the current setting value, whichever is higher)
                const maxSliderValue = checkData[key] > 100 ? checkData[key] : 100;
                // Determine the step value based on whether the setting value is an integer or a decimal
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

    // Check if the module supports punishments
    if (checkData.punishment) {

        menu.dropdown("Punishment", Object.keys(punishments), punishments[checkData.punishment]);
        menu.textField("Length", "Ex: 1d, 30s, ...", checkData["punishmentLength"]);
        menu.slider("Minimum Violations", 0, 20, 1, checkData["minVlbeforePunishment"]);

        optionsMap = optionsMap.concat(punishmentSettings);
    }

    menu.show(player).then((response) => {
    
        if (response.canceled) return;

        const formValues = response.formValues ?? [];

        // Update the check data with the new values from the form
        for (const optionid in optionsMap) {
            const name = optionsMap[optionid];
            checkData[name] = name === "punishment" ? Object.keys(punishments)[formValues[optionid]] : formValues[optionid];
        }

        // Save the updated config to the dynamic property
        world.setDynamicProperty("config", JSON.stringify(config));

        // Convert the check name to a more readable format
        const fancyCheck = check.replace(/([A-Z])/g, '/$1').replace(/^./, str => str.toUpperCase());
        
        player.sendMessage(`§r${themecolor}Rosh §j> §aUpdated the settings for §8${fancyCheck}§a:\n§8${JSON.stringify(checkData, null, 2)}`);
    });
}


// ====================== //
//     Manage Players     //
// ====================== //

function playerSettingsMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const allPlayers = world.getPlayers();

    const menu = new MinecraftUI.ActionFormData()

        .title("Manage Players")
    
    for(const plr of allPlayers) {

        let playerName = `${plr.name}`;
        if(plr.id === player.id) playerName += " - You";
        if(plr.isOp()) playerName += `\n§8[${themecolor}Op§8]`;
        menu.button(playerName);
    }

    menu.button("Back");

    menu.show(player).then((response) => {
        if([...allPlayers].length > response.selection) playerSettingsMenuSelected(player, [...allPlayers][response.selection]);
            else mainGui(player);
    });
}

//TODO: Implement the new command features (Other: Comments, JSDocs, etc)
export function playerSettingsMenuSelected(player, playerSelected) { // FIXME: (badpackets/h in vanish (#staff messages), etc. ...)

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    if (!playerSelected) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §cPlayer §8${playerSelected} was not found.`);
    }

    const menu = new MinecraftUI.ActionFormData()
        .title("Manage " + playerSelected.name)
        .body(`§8Coordinates: ${Math.floor(playerSelected.location.x)}, ${Math.floor(playerSelected.location.y)}, ${Math.floor(playerSelected.location.z)}\nDimension: ${uppercaseFirstLetter((playerSelected.dimension.id).replace("minecraft:", ""))}\nOperator: ${playerSelected.isOp() ? "§8[§a+§8]" : "§8[§c-§8]"}\nMuted: ${playerSelected.hasTag("isMuted") ? "§8[§a+§8]" : "§8[§c-§8]"}\nFrozen: ${playerSelected.hasTag("freeze") ? "§8[§a+§8]" : "§8[§c-§8]"}\nVanished: ${playerSelected.hasTag("vanish") ? "§8[§a+§8]" : "§8[§c-§8]"}\nFly Mode: ${playerSelected.hasTag("flying") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button("Clear EnderChest") // Fixed
        .button("Kick Player")      // Fixed
        .button("Ban Player");      // Fixed

    if (!playerSelected.hasTag("flying")) menu.button("Enable Fly Mode"); // Broken
    else menu.button("Disable Fly Mode");

    if (!playerSelected.hasTag("freeze")) menu.button("Freeze Player");   // Fixed
    else menu.button("Unfreeze Player");

    if (!playerSelected.hasTag("isMuted")) menu.button("Mute Player");    // Fixed
    else menu.button("Unmute Player");

    if (!playerSelected.isOp()) menu.button("Set as Operator");      // Fixed (need to fix message for selected player, ex.use util functions) + deop no longer ui ability
    else menu.button("Remove Operator status");

    if (!playerSelected.hasTag("vanish")) menu.button("Vanish Player");   // Broken (false flags for BadPackets/H, messages)
    else menu.button("Unvanish Player");

    menu
        .button("Teleport")        // Fixed
        .button("Switch Gamemode") // Fixed
        .button("View Logs")       // Broken (needs to be improved)
        .button('Killaura Check')
        .button("Back");

    menu.show(player).then((response) => {
        switch (response.selection) {
            case 0:
                if (!config.customcommands.ecwipe.enabled) {
                    return player.sendMessage(`§r${themecolor}Rosh §j> §cEnderchest wiping is disabled in config.`);
                }
                clearEnderchest(playerSelected);
                player.sendMessage(`§r${themecolor}Rosh §j> §cYou have cleared §8${playerSelected.name}'s §cenderchest.`);
                playerSettingsMenuSelected(player, playerSelected);
                break;
            case 1:
                kickPlayerMenu(player, playerSelected, 1);
                break;
            case 2:
                banPlayerMenu(player, playerSelected, 1);
                break;

            case 3:
                if (!config.customcommands.fly.enabled) {
                    return player.sendMessage(`§r${themecolor}Rosh §j> §cToggling Fly is disabled in config.`);
                }
                if (playerSelected.hasTag("flying")) {
                    playerSelected.runCommandAsync("function tools/fly"); // Broken
                    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas disabled fly mode for §8${playerSelected.name}§c.`);
                } else {
                    playerSelected.runCommandAsync("function tools/fly"); // Broken
                    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ahas enabled fly mode for §8${playerSelected.name}§a.`);
                }
                playerSettingsMenuSelected(player, playerSelected);
                break;

            case 4:
                if (!config.customcommands.freeze.enabled) {
                    return player.sendMessage(`§r${themecolor}Rosh §j> §cToggling Freeze is disabled in config.`);
                }
                if (playerSelected.hasTag("freeze")) {
                    playerSelected.removeTag("freeze");
                    playerSelected.sendMessage(`§r${themecolor}Rosh §j> §aYou are no longer frozen.`);
                    playerSelected.runCommandAsync("inputpermission set @s movement enabled");
                    playerSelected.runCommandAsync("inputpermission set @s camera enabled");
                    player.sendMessage(`§r${themecolor}Rosh §j> §aYou have unfrozen §8${playerSelected.name}§a.`);
                } else {
                    playerSelected.addTag("freeze");
                    playerSelected.sendMessage(`§r${themecolor}Rosh §j> §cYou are now frozen.`);
                    playerSelected.runCommandAsync("inputpermission set @s movement disabled");
                    playerSelected.runCommandAsync("inputpermission set @s camera disabled");
                    player.sendMessage(`§r${themecolor}Rosh §j> §cYou have frozen §8${playerSelected.name}§c.`);
                }
                playerSettingsMenuSelected(player, playerSelected);
                break;

            case 5:

                if (!config.customcommands.mute.enabled) {
                    return player.sendMessage(`§r${themecolor}Rosh §j> §cMuting players is disabled in config.`);
                }
                if (playerSelected.hasTag("isMuted")) {
                    playerSelected.removeTag("isMuted");
                    playerSelected.sendMessage(`§r${themecolor}Rosh §j> §aYou are no longer muted.`);
                    player.sendMessage(`§r${themecolor}Rosh §j> §aYou have unmuted §8${playerSelected.name}§a.`);
                } else {
                    playerSelected.addTag("isMuted");
                    playerSelected.sendMessage(`§r${themecolor}Rosh §j> §cYou are now muted.`);
                    player.sendMessage(`§r${themecolor}Rosh §j> §cYou have muted §8${playerSelected.name}§c.`);
                }
                break;

            case 6:
                if (!config.customcommands.op.enabled) {
                    return player.sendMessage(`§r${themecolor}Rosh §j> §cGranting players Operator status is disabled in config.`);
                }
                if (playerSelected.isOp()) {
                    removeOp(playerSelected);
                    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §chas removed Operator status from §8${playerSelected.name}§c.`);
                } else {
                    addOp(playerSelected);
                    tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ahas given §8${playerSelected.name} §aOperator status.`);
                }
                playerSettingsMenuSelected(player, playerSelected);
                break;

            case 7:
                if (!config.customcommands.vanish.enabled) {
                    return player.sendMessage(`§r${themecolor}Rosh §j> §cToggling Vanish is disabled in config.`);
                }
                if (playerSelected.hasTag("vanish")) {
                    removeVanish(playerSelected, themecolor);
                } else {
                    addVanish(playerSelected, themecolor);
                }
                playerSettingsMenuSelected(player, playerSelected);
                break;
            case 8:
                playerSettingsMenuSelectedTeleport(player, playerSelected);
                break;
            case 9:
                playerSettingsMenuSelectedGamemode(player, playerSelected);
                break;
            case 10:
                playerSelected.runCommandAsync("function tools/stats");
                break;
            case 11:
                playerSelected.runCommandAsync("summon rosh:killaura ~ ~4 ~3");
                break;
            case 12:
                playerSettingsMenu(player);
                break;
        }

        if (response.canceled) playerSettingsMenu(player);
    });
}

/**
 * Displays the teleport menu to allow for easy teleportation between players.
 * @param {Object} player - The player to whom the menu is shown. 
 * @param {Object} selectedPlayer - The second player to execute the teleport with.
 */
function playerSettingsMenuSelectedTeleport(player, selectedPlayer) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()

        .title("Teleport Menu")
        .body(`Managing ${selectedPlayer.name}.`)
        .button(`Teleport to ${selectedPlayer.name}`)
        .button(`Teleport ${selectedPlayer.name} to you`)
        .button("Back");
    
    menu.show(player).then((response) => {

        switch(response.selection) {
            case 0:
                player.tryTeleport(selectedPlayer.location, {
                    checkForBlocks: true,
                    dimension: selectedPlayer.dimension, 
                    keepVelocity: false
                });
                break;

            case 1:
                selectedPlayer.tryTeleport(player.location, {
                    checkForBlocks: true,
                    dimension: player.dimension,
                    keepVelocity: false
                });
                break;

            default:
                playerSettingsMenuSelected(player, selectedPlayer);
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
function playerSettingsMenuSelectedGamemode(player, selectedPlayer) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const menu = new MinecraftUI.ActionFormData()

        .title("Gamemode Menu")
        .body(`Managing ${selectedPlayer.name}.`)
        .button("Creative")
        .button("Survival")
        .button("Adventure")
        .button("Spectator")
        .button("Back");
    
    menu.show(player).then((response) => {

        switch (response.selection) {
            case 0:
                selectedPlayer.setGameMode("creative");
                break;
            case 1:
                selectedPlayer.setGameMode("survival");
                break;
            case 2:
                selectedPlayer.setGameMode("adventure");
                break;
            case 3:
                selectedPlayer.setGameMode("spectator");
                break;
            default:
                playerSettingsMenuSelectedGamemode(player, selectedPlayer);
        }

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}



// ====================== //
//       Debug Menu       //
// ====================== //

function debugSettingsMenu(player) {
    
    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()

        .title("Debug Menu")
        .button(`Checks\n${player.hasTag("debug") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Packets\n${player.hasTag("packetlogger") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Speed\n${player.hasTag("devspeed") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`FallDistance\n${player.hasTag("devfalldistance") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Tps\n${player.hasTag("devtps") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`XRotation\n${player.hasTag("devrotationx") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`YRotation\n${player.hasTag("devrotationy") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Cps\n${player.hasTag("cps") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button("Back");
    
    menu.show(player).then((response) => {

        if (response.selection === 0) player.runCommandAsync("function ui/debug");
        if (response.selection === 1) player.runCommandAsync("function ui/packets"); 
        if (response.selection === 2) player.runCommandAsync("function ui/devspeed");
        if (response.selection === 3) player.runCommandAsync("function ui/devfalldistance");
        if (response.selection === 4) player.runCommandAsync("function ui/devtps");
        if (response.selection === 5) player.runCommandAsync("function ui/devrotationx");
        if (response.selection === 6) player.runCommandAsync("function ui/devrotationy");
        if (response.selection === 7) player.runCommandAsync("function ui/devcps");
        if (response.selection === 8) mainGui(player);

    });
}