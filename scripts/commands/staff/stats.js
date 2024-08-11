import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { getScore, findPlayerByName } from "../../util";

/**
 * Gets stats from a player (such as kicks, flags, etc.).
 * @name stats
 * @param {object} message - The message object containing the sender's information.
 * @param {Minecraft.Player} message.sender - The player who initiated the stats command.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function stats(message, args) {
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
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide whose stats to get.`);
        return;
    }

    // Replace @s with the sender's name
    const targetName = args[0].replace(/"|\\|@s/g, player.name);

    const minNameLength = 3;
    const maxNameLength = player.name.endsWith(')') ? 15 : 12;

    // Check if target player name is valid
    if (targetName.length < minNameLength || targetName.length > maxNameLength) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a valid player to get their stats from.`);
        return;
    }

    // Find the target player by name
    const member = findPlayerByName(targetName);

    // Handle case where the target player is not found
    if (!member) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
        return;
    }

    // Declare all violations
    const violations = [
        "killauravl", "reachvl", "hitboxvl", "aimvl", "autoclickervl", "autoshieldvl", 
        "autototemvl", "badpacketsvl", "badenchantsvl", "crashervl", "cbevl", "exploitvl", "illegalitemsvl", 
        "spammervl", "fastusevl", "autotoolvl", "namespoofvl", "timervl", 
        "motionvl", "strafevl", "flyvl", "speedvl", "noslowvl", "invalidsprintvl", "invalidjumpvl", 
        "invmovevl", "scaffoldvl", "nukervl", "towervl"
    ];

    for (const violation of violations) {
        // Get the score for each violation
        const score = getScore(member, violation, 0);

        // Only display violations that have a score higher than 0
        if (score !== 0) {
            const violationText = {
                invalidjumpvl: "InvalidJump",
                towervl: "Tower",
                strafevl: "Strafe",
                exploitvl: "Exploit",
                timervl: "Timer",
                autotoolvl: "AutoTool",
                autoclickervl: "AutoClicker",
                autoshieldvl: "AutoShield",
                autototemvl: "AutoTotem",
                badenchantsvl: "BadEnchants",
                badpacketsvl: "BadPackets",
                cbevl: "Command Block Exploit",
                crashervl: "Crasher",
                fastusevl: "FastUse",
                flyvl: "Fly",
                illegalitemsvl: "IllegalItems",
                invalidsprintvl: "Invalidsprint",
                invmovevl: "Invmove",
                killauravl: "Killaura",
                namespoofvl: "Namespoof",
                noslowvl: "NoSlow",
                nukervl: "Nuker",
                reachvl: "Reach",
                spammervl: "Spammer",
                scaffoldvl: "Scaffold",
                gamemodevl: "Gamemode",
                speedvl: "Speed",
                motionvl: "Motion",
                aimvl: "Aim",
                nukervl: "Nuker",
                hitboxvl: "Hitbox"
            };

            // Send the message to the player
            player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §chas §8${score} §c${violationText[violation]} violation${score > 1 ? "s" : ""}.`);
        }
    }

    // Get the kick amount
    const kickAmount = getScore(member, "kickvl", 0);

    // Send the message to the player
    player.sendMessage(`§r${themecolor}Rosh §j> §8${member.name} §chas been kicked §8${kickAmount} §ctime${kickAmount > 1 ? "s" : ""}.`);
}