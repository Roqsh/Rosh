import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

/**
 * Displays the team behind Rosh.
 * @param {object} message - Message object
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @throws {TypeError} If message is not an object
 */
export function credits(message) {
    // Check if message is an object.
    if (typeof message !== "object" || message === null) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;

    // Send the player the credits message (<3)
    player.sendMessage(
        `${themecolor}Rosh §j> §aThanks to the team behind Rosh:` + 
        `\n§8Rosh§a/§8rqosh§a,` + 
        `\n§8NT AUTHORITY/hpwd§a/§8MrDiamond64§a,` + 
        `\n§8Dream23322§a/§84urxra §aand` + 
        `\n§8yellowworld777§a!` + 
        `\n§c<3`
    );
}