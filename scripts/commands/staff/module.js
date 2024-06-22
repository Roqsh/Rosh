import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';
import defaultConfig from '../../data/defaultConfig.js';

/**
 * Handles the module command to view or update configuration settings.
 * @param {object} message - The message object containing the sender information.
 * @param {Array} args - The arguments provided with the command.
 * @throws {TypeError} - If message or args are not objects.
 */
export function module(message, args) {
    // Validate message and args types
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (typeof args !== "object") throw new TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const world = Minecraft.world;
    const themecolor = config.themecolor;

    // Determine the category based on the command name
    const category = "module" === "module" ? "modules" : "misc_modules";
    const module = args[0];
    const name = args[1];
    const value = args.slice(2).join(" ");

    // If no module is provided, send the list of available modules
    if (!module) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §aAvailable modules: §8\n${Object.keys(config[category]).join(", ")}`);
    }

    const moduleData = config[category][module];

    // Format the module name for better readability
    const fancyCheck = module.replace(/([A-Z])/g, '/$1').replace(/^./, str => str.toUpperCase());

    // If the module is not found, send an error message with the list of available modules
    if (!moduleData) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find §8${module}§c. Please select a module from this list: §8\n${Object.keys(config[category]).join(", ")}`);
    }

	// Handle the reset command
    if (name === "reset") {
        // Reset the module settings to default values
        config[category][module] = { ...defaultConfig[category][module] };

        // Save the updated config to the world properties
        world.setDynamicProperty("config", JSON.stringify(config));

        // Notify the player of the successful reset
        return player.sendMessage(`§r${themecolor}Rosh §j> §aReset the settings for §8${fancyCheck}§a to default values:\n§8${JSON.stringify(config[category][module], null, 2)}`);
    }

    // If no setting name is provided, send the current module data
    if (!name) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §8${fancyCheck}'s §acurrent data:\n§8${JSON.stringify(moduleData, null, 2)}`);
    }

    // If the setting name is not found, send an error message with the list of available settings
    if (!(name in moduleData)) {
        return player.sendMessage(`§r${themecolor}Rosh §j> §8${fancyCheck} §cdoes not have a setting called §8${name}§c. Please select a setting from this list: §8\n${Object.keys(moduleData).join(", ")}`);
    }

    // If no value is provided, send an error message
    if (value === "") {
        return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to enter a value for this setting.`);
    }

    let newValue;

    // Update the setting based on its type
    switch (typeof moduleData[name]) {
        case "boolean":
            newValue = value === "true";
            break;
        case "number":
            newValue = Number(value);
            break;
        case "string":
            newValue = value;
            break;
        case "object":
            // Handle special case for RegExp objects
            if (moduleData[name] instanceof RegExp) {
                newValue = new RegExp(value);
            } else {
                newValue = JSON.parse(value);
            }
            break;
        default:
            return player.sendMessage(`§r${themecolor}Rosh §j> §cUnsupported setting type for §8${name}§c.`);
    }

	// Check if the new value is the same as the current value
    if (JSON.stringify(moduleData[name]) === JSON.stringify(newValue)) {
	    return player.sendMessage(`§r${themecolor}Rosh §j> §8${fancyCheck} §cis already set to the provided value.`);
	}

    // Update the module setting
    moduleData[name] = newValue;

    // Save the updated config to the world properties
    world.setDynamicProperty("config", JSON.stringify(config));

    // Notify the player of the successful update
    player.sendMessage(`§r${themecolor}Rosh §j> §aUpdated the settings for §8${fancyCheck}§a:\n§8${JSON.stringify(moduleData, null, 2)}`);
}