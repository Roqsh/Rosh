import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Tests if a player uses Killaura. (Killaura/E needs to be enabled aswell as the Beta toggle)
 * @name testaura
 * @param {object} message - The message object containing the sender's information.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
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
    const world = Minecraft.world;
    const themecolor = config.themecolor;
    
    // Check if target player name is provided
    if (args.length === 0) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to test for Killaura.`);
        return;
    }    

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    // Check if target player name is valid
    if (targetName.length < 3) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to test for Killaura.`);
        return;
    }

    // Find the target player by name
    let member = null;
    for (const pl of world.getPlayers()) {
        if (pl.name.toLowerCase().includes(targetName)) {
            member = pl;
            break;
        }
    }

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Get random coordinates to spawn the bot
    const x = Math.random() * 6 - 3;
    const y = Math.random() * 2; 
    const z = Math.random() * 6 - 3; 

    // Spawn the bot to check for Killaura
    member.runCommandAsync(`summon rosh:killaura ~${x} ~${y} ~${z}`);
    
    // Notify the initiator
    player.sendMessage(`§r${themecolor}Rosh §j> §aKillaura bot succesfully spawned.`);
}