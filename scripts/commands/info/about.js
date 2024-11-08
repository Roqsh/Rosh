import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { convertString } from "../../util.js";

/**
 * Sends a description of the specified module to the player.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @param {array} args - Additional arguments provided, with the first argument being the module name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function about(message, args) {
    // Validate message and args
    if (typeof message !== "object") {
        throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;
    const moduleName = args[0];

    // Check if the module name is provided
    if (!moduleName) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a check.`);
        return;
    }

    const module = config.modules[moduleName];

    // Check if the module exists in the config
    if (!module) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that check.`);
        return;
    }

    const description = module.description;

    // Check if the module has a description
    if (!description) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThat check has no description.`);
        return;
    }

    // Format the module name for better readability
    const readableCheck = convertString(moduleName);

    // Send the description of the module to the player
    player.sendMessage(`§r${themecolor}Rosh §j> §aDescription of §8${readableCheck}§a: §8${description}`);
}