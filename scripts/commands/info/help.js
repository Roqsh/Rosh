import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

/**
 * Displays all available commands.
 * @param {object} message - Message object
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @throws {TypeError} If message is not an object
 */
export function help(message) {
    // Check if message is an object.
    if (typeof message !== "object" || message === null) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;

    // Set the start of the help message
    let helpMessage = `§r${themecolor}Rosh §j> §aAvailable commands:\n\n`;

    // Convert the customcommands object to an array of keys
    const commandKeys = Object.keys(config.customcommands);

    // Loop through the customcommands object and add the commands to the helpMessage string
    for (const command of commandKeys) {

        // Ignore prefix and sendInvalidCommandMsg as they are settings and not actual commands
        if (command !== "prefix" && command !== "sendInvalidCommandMsg") {

            let categorie = ``;

            // If a new categorie starts, add a line between the commands
            if (command === "unfreeze" || command === "testaura" || command === "tag") {
                categorie = `\n`;
            } else categorie = ``;

            helpMessage += `§8${config.customcommands[command].description}\n${categorie}`;
        }
    }

    // Send the player the help message
    player.sendMessage(helpMessage);
}