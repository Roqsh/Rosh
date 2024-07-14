import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * Unfreezes the players movement, camera and hud.
 * @name unfreeze
 * @param {object} message - The message object containing the sender's information.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function unfreeze(message, args) {
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
    if (!args.length) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to unfreeze.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    const minNameLength = 3;
    const maxNameLength = player.name.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to unfreeze.`);
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

    // Check if the target player is already unfrozen
    if (!member.hasTag("frozen")) {
        player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §cis not frozen.`);
        return;
    }

    // Remove the frozen mark
    member.removeTag("frozen");

    // Unfreeze the input actions of the target player
    member.runCommandAsync(`inputpermission set @s movement enabled`);
    member.runCommandAsync(`inputpermission set @s camera enabled`);
    member.runCommandAsync(`hud @s reset`);

    // Notify the player that he is unfrozen
    member.sendMessage(`§r${themecolor}Rosh §j> §aYou are now unfrozen!`);

    // Notify other staff members about the freeze
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §ahas unfrozen §8${member.name}§a."}]}`);
}