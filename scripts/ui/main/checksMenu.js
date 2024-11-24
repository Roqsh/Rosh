import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../../data/config.js";
import data from "../../data/data.js";
import { mainMenu } from "../mainMenu.js";
import { String } from "../../utils/String.js";

const moduleList = Object.keys(config.modules);
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

/**
 * Displays all available checks to edit.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown.
 */
export function checksMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu that shows all categorised checks
    const menu = new MinecraftUI.ActionFormData()
        .title("Checks")

    for (const subModule of modules) {
        menu.button(String.toUpperCase(subModule));
    }

    menu.button("Back");

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        if (!modules[response.selection ?? - 1]) {
            return mainMenu(player);
        }

        modulesCheckSelectMenu(player, response.selection);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a menu to configure checks for a specific module category.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. This object represents the player in the game.
 * @param {number} selection - The selected module or category which determines which checks are shown in the menu.
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

        const checkData = config.modules[module];
        menu.button(`${String.toUpperCase(subCheck)}/${module[module.length - 1]}\n${checkData.enabled ? "§8[§a+§8]" : "§8[§c-§8]"}`);
    }

    if (checks.length === 1) return editChecksMenu(player, checks[0]);

    menu.button("Back");

    // Show the menu to the player and handle the responsebased on the player's selection
    menu.show(player).then((response) => {

        const selection = response.selection ?? -1;

        if (!checks[selection]) return checksMenu(player);

        editChecksMenu(player, checks[selection]);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a menu for editing the settings of a specific check.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown. This object represents the player in the game.
 * @param {string} check - The key of the check in the config to be edited. This determines which check's settings will be shown.
 */
function editChecksMenu(player, check) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const formattedCheckName = check.replace(/([A-Z])/g, '/$1').replace(/^./, str => str.toUpperCase());
    const checkData = config.modules[check];
    const originalCheckData = { ...checkData }; // Save a copy of the original check data
    let optionsMap = [];

    // Create a menu to edit the sub-check's settings
    const menu = new MinecraftUI.ModalFormData()
        .title(`Editing ${formattedCheckName}`);

    for (const key of Object.keys(checkData)) {

        if (punishmentSettings.includes(key)) continue;

        const settingName = String.toUpperCase(key).replace(/_./g, (match) => " " + match[1].toUpperCase());

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

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

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

        // Update the check's settings
        if (isChanged) {
            world.setDynamicProperty("config", JSON.stringify(config));
            player.sendMessage(`${themecolor}Rosh §j> §aUpdated the settings for §8${formattedCheckName}§a:\n§8${JSON.stringify(checkData, null, 2)}`);
        } else {
            // If the settings are the same as before, notify the player
            player.sendMessage(`${themecolor}Rosh §j> §8${formattedCheckName} §cwas already set to the provided values.`);
        }

        // Re-open the checks menu for the player
        checksMenu(player);
        
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}