import * as MinecraftUI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import config from "../../data/config.js";
import { handleNotification } from "../../commands/staff/notify.js";
import { mainMenu } from "../mainMenu.js";

/**
 * Displays a menu with various options for customizing Rosh.
 * @param {import("@minecraft/server").Player} player  - The player to whom the menu is shown.
 */
export function settingsMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu with options for changing certain Rosh settings
    const menu = new MinecraftUI.ActionFormData()
        .title("Settings")
        .button(`Notifications\n${player.hasTag("notify") ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Webhooks\n${config.webhook.enabled ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Autoban\n${config.autoban ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Silent Flags\n${config.silent ? "§8[§a+§8]" : "§8[§c-§8]"}`)
        .button(`Preset\n${config.preset === "stable" ? "§8Stable" : "§8Beta"}`)
        .button(`Themecolor\n${config.themecolor}Color`)
        .button(`Thememode\n§8${config.thememode}`)
        .button("Back");

    // Show the menu to the player and handle the response bassed on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and return if so
        if (response.canceled) {
            return;
        }

        switch (response.selection) {
            case 0: handleNotification(player, themecolor); break;
            case 1: webhookMenu(player); break;
            case 2: autobanMenu(player); break;
            case 3: silentMenu(player); break;
            case 4: presetMenu(player); break;
            case 5: themecolorMenu(player); break;
            case 6: thememodeMenu(player); break; 
            case 7: mainMenu(player); break;
        }
    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Lets a player toggle and customize Webhooks.
 * @param {import("@minecraft/server").Player} player  - The player to whom the menu is shown.
 */
function webhookMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const currentStyleIndex = config.webhook.style === "message" ? 0 : 1;

    // Create a menu to enable or disable Webhooks
    const menu = new MinecraftUI.ModalFormData()
        .title("Webhooks")
        .toggle(`${config.webhook.enabled ? "Disable Webhooks" : "Enable Webhooks"}`, config.webhook.enabled)
        .dropdown("Webhook Style", ["Message", "Embed"], currentStyleIndex)
        .textField("Webhook URL", `${config.webhook.url ? config.webhook.url : "§o§7Enter URL here"}`)
        .submitButton("Save Changes");

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {
        
        // Check if the menu was cancelled and back to the settings menu
        if (response.canceled) {
            return settingsMenu(player);
        }

        // Get the new values from the response
        const newEnabled = response.formValues[0];
        const newStyle = response.formValues[1] === 0 ? "message" : "embed"; // 0 -> message, 1 -> embed
        const newUrl = response.formValues[2];

        // Check if there are any changes
        let feedbackMessage = [];
        if (config.webhook.enabled !== newEnabled) {
            config.webhook.enabled = newEnabled;
            feedbackMessage.push(`${themecolor}Rosh §j> §8Webhooks ${config.webhook.enabled ? "§a" : "§c"}are now ${newEnabled ? "enabled" : "disabled"}!`);
        }

        if (config.webhook.style !== newStyle) {
            config.webhook.style = newStyle;
            feedbackMessage.push(`${themecolor}Rosh §j> §aWebhook Style is now set to §8${newStyle === "message" ? "Message" : "Embed"}§a.`);
        }

        if (config.webhook.url !== newUrl) {
            if (newUrl.indexOf(":") === -1 || newUrl.length === 0) {
                feedbackMessage.push(`${themecolor}Rosh §j> §cPlease enter a valid Webhook URL!`);
            } else {
                config.webhook.url = newUrl;
                feedbackMessage.push(`${themecolor}Rosh §j> §aWebhook URL has been updated to: §8${newUrl}`);
            }
        }

        // Send the feedback messages to the player
        feedbackMessage.forEach(message => {
            player.sendMessage(message);
        });

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a toggle to enable autobanning people.
 * @param {import("@minecraft/server").Player} player  - The player to whom the menu is shown.
 */
function autobanMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu to enable or disable automatically banning other players
    const menu = new MinecraftUI.ModalFormData()
        .title("Autoban")
        .toggle(`${config.autoban ? "Disable Autoban" : "Enable Autoban"}`, config.autoban);

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {
        
        // Check if the menu was cancelled and back to the settings menu
        if (response.canceled) {
            return settingsMenu(player);
        }

        config.autoban = response.formValues[0];
        player.sendMessage(`${themecolor}Rosh §j> ${config.autoban ? "§a" : "§c"}AutoBan is now ${config.autoban ? "enabled" : "disabled"}!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a toggle to enable or disable silent mode for Rosh flags.
 * @param {import("@minecraft/server").Player} player  - The player to whom the menu is shown.
 */
function silentMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    // Create a menu to enable or disable reverting a player's action back after getting flagged
    const menu = new MinecraftUI.ModalFormData()
        .title("Silent Mode")
        .toggle(`${config.silent ? "Disable Silent Flags" : "Enable Silent Flags"}`, config.silent);

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {
        
        // Check if the menu was cancelled and back to the settings menu
        if (response.canceled) {
            return settingsMenu(player);
        }

        config.silent = response.formValues[0];
        player.sendMessage(`${themecolor}Rosh §j> ${config.silent ? "§a" : "§c"}Silent Flagging is now ${config.silent ? "enabled, meaning players movement will no longer be reverted!" : "disabled, meaning players movement will be reverted!"}`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a dropdown to select the preset to use for loading checks.
 * @param {import("@minecraft/server").Player} player  - The player to whom the menu is shown.
 */
function presetMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;

    const currentPresetIndex = config.preset === "stable" ? 0 : 1;

    // Create a menu to choose between the stable and beta preset
    const menu = new MinecraftUI.ModalFormData()
       .title("Choose Preset")
       .dropdown("", ["Stable", "Beta"], currentPresetIndex);

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {

        // Check if the menu was cancelled and back to the settings menu
        if (response.canceled) {
            return settingsMenu(player);
        }

        const selectedPreset = response.formValues[0];

        // Check if the preset is already set to the selected preset
        if ((selectedPreset === 0 && config.preset === "stable") || (selectedPreset === 1 && config.preset === "beta")) {
            player.sendMessage(`${themecolor}Rosh §j> §cPreset is already set to §8${selectedPreset === 0 ? "Stable" : "Beta"}§c!`);
            return;
        }

        config.preset = selectedPreset === 0 ? "stable" : "beta";
        player.sendMessage(`${themecolor}Rosh §j> §aSet the preset to §8${selectedPreset === 0 ? "Stable" : "Beta"}§a.`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a dropdown to select a theme color to use for Rosh messages.
 * @param {import("@minecraft/server").Player} player  - The player to whom the menu is shown.
 */
function themecolorMenu(player) {

    // Play a sound to indicate the menu has been opened
    player.playSound("mob.chicken.plop");

    const themecolor = config.themecolor;
    const themecolors = [
        "§0Color", "§1Color", "§2Color", "§3Color", "§4Color", "§5Color", "§6Color", "§7Color", "§8Color", "§9Color", "§qColor", "§eColor", "§rColor", 
        "§aColor", "§bColor", "§cColor", "§dColor", "§eColor", "§fColor", "§gColor", "§jColor", "§nColor", "§pColor", "§qColor", "§sColor", "§tColor", "§uColor"
    ];

    const currentColorIndex = themecolors.indexOf(themecolor + "Color");

    // Create a menu to select the color to use for Rosh
    const menu = new MinecraftUI.ModalFormData()
        .title("Choose Themecolor")
        .dropdown("", themecolors, currentColorIndex);

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {
        
        // Check if the menu was cancelled and back to the settings menu
        if (response.canceled) {
            return settingsMenu(player);
        }

        const selectedColor = themecolors[response.formValues[0]];

        // Check if the selected color matches the current theme color
        if (selectedColor.substring(0, 2) === config.themecolor) {
            player.sendMessage(`${selectedColor.substring(0, 2)}Rosh §j> §cThemecolor is already set to ${selectedColor.substring(0, 2)}Color§c!`);
            return;
        }

        config.themecolor = selectedColor.substring(0, 2);
        player.sendMessage(`${selectedColor.substring(0, 2)}Rosh §j> §aThemecolor set to ${selectedColor.substring(0, 2)}Color§a!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}

/**
 * Displays a dropdown to select a theme mode to use for Rosh flag messages.
 * @param {import("@minecraft/server").Player} player - The player to whom the menu is shown.
 */
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
        .dropdown("", thememodes, currentModeIndex);

    // Show the menu to the player and handle the response based on the player's selection
    menu.show(player).then((response) => {
        
        // Check if the menu was cancelled and back to the settings menu
        if (response.canceled) {
            return settingsMenu(player);
        }

        const selectedMode = thememodes[response.formValues[0]];

        // Check if the selected mode matches the current theme mode
        if (selectedMode === config.thememode) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cThememode is already set to §8${selectedMode}§c!`);
            return;
        }

        config.thememode = selectedMode;
        player.sendMessage(`§r${themecolor}Rosh §j> §aThememode set to §8${selectedMode}§a!`);

    }).catch((error) => {
        // Handle promise rejection
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`${themecolor}Rosh §j> §cAn error occurred:\n§8${error}\n${error.stack}`);
    });
}