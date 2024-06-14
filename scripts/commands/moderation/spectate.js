import config from "../../data/config.js";

/**
 * Allows a player to spectate another player.
 * @param {object} message - The message object containing the sender property.
 * @param {Minecraft.Player} message.sender - The player who initiated the spectate command.
 * @param {Array} args - The arguments provided for the spectate command, where args[0] is the target player name.
 * @throws {TypeError} If the message or args are not of type "object".
 */
export function spectate(message, args) {
    // Validate message and args
    if (typeof message !== "object") throw new TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (!Array.isArray(args)) throw new TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to spectate.`);
        return;
    }

    // Check if target player name is valid
    if (args[0].length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to unban.`);
        return;
    }

    const member = args[0].replace(/"|\\/g, ""); // Extract member name

    // Set player's game mode to spectator and teleport them to the member
    player.runCommandAsync(`gamemode spectator @s`);
    player.runCommandAsync(`tp @s ${member}`);

    // Send confirmation message to the player
    player.sendMessage(`§r${themecolor}Rosh §j> §aYou are now spectating §8${member}§a!`);
}