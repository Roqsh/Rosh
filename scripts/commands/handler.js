import * as Minecraft from "@minecraft/server";
import { world, system } from "@minecraft/server";
import config from "../data/config.js";

// Importing Punishments
import { ban } from "./punishments/ban.js";
import { unban } from "./punishments/unban.js";
import { kick } from "./punishments/kick.js";
import { kickall } from "./punishments/kickall.js";
import { mute } from "./punishments/mute.js";
import { unmute } from "./punishments/unmute.js";
import { warn } from "./punishments/warn.js";
import { freeze } from "./punishments/freeze.js";
import { unfreeze } from "./punishments/unfreeze.js";

// Importing Tools
import { spectate } from "./tools/spectate.js";
import { vanish } from "./tools/vanish.js";
import { fly } from "./tools/fly.js";
import { invsee } from "./tools/invsee.js";
import { cloneinv } from "./tools/cloneinv.js";
import { ecwipe } from "./tools/ecwipe.js";
import { testaura } from "./tools/testaura.js";

// Importing Staff Functions
import { ui } from "./staff/ui.js";
import { op } from "./staff/op.js";
import { deop } from "./staff/deop.js";
import { tellstaff } from "./staff/tellstaff.js";
import { notify } from "./staff/notify.js";
import { autoban } from "./staff/autoban.js";
import { module } from "./staff/module.js";
import { stats } from "./staff/stats.js";
import { logs } from "./staff/logs.js";
import { banlist } from "./staff/banlist.js";
import { resetwarns } from "./staff/resetwarns.js";
import { report } from "./staff/report.js";
import { tag } from "./staff/tag.js";

// Importing Information Commands
import { help } from "./info/help.js";
import { about } from "./info/about.js";
import { version } from "./info/version.js";
import { credits } from "./info/credits.js";

/**
 * Handles incoming commands from players.
 * @param {object} message - Message data
 * @param {Minecraft.Player} message.sender - The player who initiated the command.
 * @throws {TypeError} If message is not an object
 */
export function commandHandler(message) {
    // Validate message
    if (typeof message !== "object") {
        throw new TypeError(`message is type of ${typeof message}. Expected "object"`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;
    const prefix = config.customcommands.prefix;

    // Ignore messages that do not start with the prefix
    if (!message.message.startsWith(prefix)) return;

    const args = message.message.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase().trim();

    let commandData;
    let commandName;

    try {
        // Check if command is directly available
        if (typeof config.customcommands[command] === "object") {
            commandData = config.customcommands[command];
            commandName = command;
        } else {
            // Check for command aliases
            for (const cmd in config.customcommands) {
                const data = config.customcommands[cmd];

                if (data.aliases && data.aliases.includes(command)) {
                    commandData = data;
                    commandName = cmd;
                    break;
                }
            }

            // If no command or alias found, send invalid command message
            if (!commandData && config.customcommands.sendInvalidCommandMsg) {
                player.sendMessage(`§r${themecolor}Rosh §j> §cDid not find the command §8${command}§c!`);
                message.cancel = true;
                return;
            }
        }

        message.cancel = true;

        // Check for required permission (operator)
        if (!player.isOp() && config.customcommands[commandName].operator) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cYou must be Op to use this command!`);
            return;
        }

        // Check if command is enabled
        if (!commandData.enabled) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cThis command is disabled.`);
            return;
        }

        // Run the command
        runCommand(message, commandName, args);

    } catch (error) {
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`§r${themecolor}Rosh §j> §cThere was an error while trying to run this command:\n§8${error}\n${error.stack}`);
    }
}

/**
 * Executes the specified command.
 * @param {object} msg - Message data
 * @param {string} commandName - Name of the command to execute
 * @param {Array<string>} args - Arguments passed to the command
 */
function runCommand(msg, commandName, args) {
    
    const themecolor = config.themecolor;
    const message = { ...msg, sender: world.getPlayers({ name: msg.sender.name })[0] };

    system.run(() => {
        try {
            switch (commandName) {
                case "ban": ban(message, args); break;
                case "unban": unban(message, args); break;
                case "kick": kick(message, args); break;
                case "kickall": kickall(message); break;
                case "mute": mute(message, args); break;
                case "unmute": unmute(message, args); break;
                case "warn": warn(message, args); break;
                case "freeze": freeze(message, args); break;
                case "unfreeze": unfreeze(message, args); break;
                case "spectate": spectate(message, args); break;
                case "vanish": vanish(message); break;
                case "fly": fly(message, args); break;
                case "invsee": invsee(message, args); break;
                case "cloneinv": cloneinv(message, args); break;
                case "ecwipe": ecwipe(message, args); break;
                case "testaura": testaura(message, args); break;
                case "ui": ui({ sender: message.sender }); break;
                case "op": op(message, args); break;
                case "deop": deop(message, args); break;
                case "tellstaff": tellstaff(message, args); break;
                case "notify": notify(message); break;
                case "autoban": autoban(message); break;
                case "module": module(message, args); break;
                case "stats": stats(message, args); break;
                case "logs": logs(message, args); break;
                case "banlist": banlist(message, args); break;
                case "resetwarns": resetwarns(message, args); break;
                case "report": report(message, args); break;
                case "tag": tag(message, args); break;
                case "help": help(message); break;
                case "about": about(message, args); break;
                case "version": version(message); break;
                case "credits": credits(message); break;
                default: throw new Error(`Command ${commandName} was found in config.js but no handler for it was found`);
            }
        } catch (error) {
            console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
            message.sender.sendMessage(`§r${themecolor}Rosh §j> §cThere was an error while trying to run this command:\n§8${error}\n${error.stack}`);
        }
    });
}