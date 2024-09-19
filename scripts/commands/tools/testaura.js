import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { getPlayerByName, endsWithNumberInParentheses } from "../../util.js";

/**
 * Tests if a player uses Killaura.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the stats command.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @remarks **Requires Killaura/E and the Beta toggle to be turned on.**
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function testaura(message, args) {
    // Validate message and args
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }
    
    const player = message.sender;
    const themecolor = config.themecolor;
    
    // Check if target player name is provided
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to test for Killaura.`);
        return;
    }    

    // Replace @s with the sender's name
    const filteredName = args[0].replace(/"|'|`|\\/g, "");
    const targetName = filteredName.replace(/@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to test for Killaura.`);
        return;
    }

    // Find the target player by name
    const member = getPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    summonAuraBot(player, member);
}

/**
 * Summons a bot to detect simple Killaura cheats.
 * @param {Minecraft.Player} player - The player who initiated the check.
 * @param {Minecraft.Player} targetPlayer - The target player to check for Killaura-cheats.
 */
export function summonAuraBot(player, targetPlayer) {

    // Get random coordinates to spawn the bot
    const x = Math.random() * 6 - 3;
    const y = Math.random() * 2; 
    const z = Math.random() * 6 - 3; 

    // Spawn the bot to check for Killaura
    targetPlayer.runCommandAsync(`summon rosh:killaura ~${x} ~${y} ~${z}`);
    
    // Notify the initiator
    player.sendMessage(`${config.themecolor}Rosh §j> §aKillaura bot succesfully spawned.`);
}