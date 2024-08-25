import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { findPlayerByName, endsWithNumberInParentheses } from "../../util.js";

/**
 * Adds a tag in front of the player's nametag or resets it.
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the tag command.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function tag(message, args) {
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
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to add a tag to.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].toLowerCase().replace(/"|\\|@s/g, player.name.toLowerCase());

    const minNameLength = 3;
    const maxNameLength = endsWithNumberInParentheses(targetName) ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to add a tag to.`);
        return;
    }

    // Handle case where no tag is provided
    if (!args[1]) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a tag to add.`);
        return;
    }

    // Join the remaining args to form the tag
    const tag = args.slice(1).join(" ").replace(/"|\\/g, "");

    // Check if tag length exceeds 16 characters
    if (tag.length > 16) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cTags can only be up to 16 characters long.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Check if the new tag is the same as the current tag
    const currentTag = member.getTags().find(t => t.startsWith("tag:"));
    if (currentTag && currentTag.slice(4) === tag) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cThis player already has that tag.`);
        return;
    }

    // Handle resetting the nametag
    if (args[1].includes("reset")) {
        member.getTags().forEach(t => {
            if (t.replace(/"|\\/g, "").startsWith("tag:")) member.removeTag(t);
        });
        member.nameTag = member.name;
        player.sendMessage(`§r${themecolor}Rosh §j> §aReset §8${member.name}'s §anametag.`);
        return;
    }

    // Get the colors from the config
    const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;

    // Build the nametag
    const nametag = `${borderColor}[§r${mainColor}${tag}§r${borderColor}]§r ${playerNameColor}${member.name}§r`.replace(/"|\\/g, "");

    // Update the target player's nametag
    member.nameTag = nametag;

    // Remove existing tags starting with "tag:"
    member.getTags().forEach(t => {
        if (t.replace(/"|\\/g, "").startsWith("tag:")) member.removeTag(t);
    });

    // Add the new tag
    member.addTag(`tag:${tag}`);

    // Inform the initiator about the tag change
    player.sendMessage(`§r${themecolor}Rosh §j> §aChanged §8${member.name}'s §anametag to §8${nametag}§a.`);
}