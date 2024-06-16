//TODO: Remove fullreport (replaced with stats), recode rest of commands, improve this, add unfreeze
import { world, system } from "@minecraft/server";
import config from "../data/config.js";

// Punishments
import { ban } from "./moderation/ban.js";
import { unban } from "./moderation/unban.js";
import { kick } from "./moderation/kick.js";
import { kickall } from "./moderation/kickall.js";
import { mute } from "./moderation/mute.js";
import { unmute } from "./moderation/unmute.js";
import { freeze } from "./utility/freeze.js";
//import { unfreeze } from "./utility/unfreeze.js";

// Tools
import { spectate } from "./moderation/spectate.js";
import { vanish } from "./utility/vanish.js";
import { fly } from "./utility/fly.js";
import { invsee } from "./utility/invsee.js";
import { cloneinv } from "./utility/cloneinv.js";
import { ecwipe } from "./utility/ecwipe.js";
import { testaura } from "./utility/testaura.js";

// Staff
import { ui } from "./utility/ui.js";
import { op } from "./moderation/op.js";
import { deop } from "./moderation/deop.js";
import { notify } from "./moderation/notify.js";
import { autoban } from "./settings/autoban.js";
import { module } from "./settings/module.js";
import { stats } from "./utility/stats.js";
import { fullreport } from "./utility/fullreport.js";
import { logs } from "./utility/logs.js";
import { resetwarns } from "./moderation/resetwarns.js";
import { report } from "./other/report.js";
import { tag } from "./utility/tag.js";

// Information
import { help } from "./other/help.js";
import { about } from "./utility/about.js";
import { version } from "./other/version.js";
import { credits } from "./other/credits.js";

const prefix = config.customcommands.prefix;

/**
 * @name commandHandler
 * @param {object} message - Message data
 */
export function commandHandler(message) {

    if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object"`);
    if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object"`);

    const player = message.sender;
    const themecolor = config.themecolor;

    if (!message.message.startsWith(prefix)) return;

    const args = message.message.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase().trim();

    //if(config.debug) console.warn(`${new Date().toISOString()} | ${player.name} used the command: ${prefix}${command} ${args.join(" ")}`);

    let commandData;
    let commandName;
    
    try {
        if (typeof config.customcommands[command] === "object") {
            commandData = config.customcommands[command];
            commandName = command;
        } else {
            
            for (const cmd of Object.keys(config.customcommands)) {

                const data = config.customcommands[cmd];

                if(typeof data !== "object" || !data.aliases || !data.aliases.includes(command)) continue;
                if(typeof data !== "object" || !data.aliases || !data.aliases.includes(command)) continue;

                commandData = data;
                commandName = cmd;

                break;
            }

            if (!commandData) {

                if (config.customcommands.sendInvalidCommandMsg) {
                    player.sendMessage(`§r${themecolor}Rosh §j> §cDid not find the command §8${command}§c!`);
                    message.cancel = true;
                }

                return;
            }
        }
        
        message.cancel = true;

        if (commandData.requiredTags.length >= 1 && commandData.requiredTags.some(tag => !player.hasTag(tag))) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cYou must be Op to use this command!`);
            return;
        }

        if (!commandData.enabled) {
            player.sendMessage(`§r${themecolor}Rosh §j> §cThis command is disabled`);
            return;
        }
        
        runCommand(message, commandName, args);
    } catch (error) {
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
        player.sendMessage(`§r${themecolor}Rosh §j> §cThere was an error while trying to run this command:\n§8${error}\n${error.stack}`);
        
    }
}


/**
 * @name runCommand
 * @param {object} msg - Message data
 */
function runCommand(msg, commandName, args) {

    const themecolor = config.themecolor;
    const message = {};

	for(const item in msg) {
		message[item] = msg[item];
	}

    message.sender = world.getPlayers({
        name: msg.sender.name
    })[0];

    
    system.run(() => {
        
        try {

            if(commandName === "ban") ban(message, args);
                else if(commandName === "unban") unban(message, args);
                else if(commandName === "kick") kick(message, args);
                else if(commandName === "kickall") kickall(message);
                else if(commandName === "mute") mute(message, args);
                else if(commandName === "unmute") unmute(message, args);
                else if(commandName === "freeze") freeze(message, args);

                else if(commandName === "spectate") spectate(message, args);
                else if(commandName === "vanish") vanish(message);
                else if(commandName === "fly") fly(message, args);
                else if(commandName === "invsee" ) invsee(message, args);
                else if(commandName === "cloneinv" ) cloneinv(message, args);
                else if(commandName === "ecwipe") ecwipe(message, args);
                else if(commandName === "testaura") testaura(message, args);

                else if(commandName === "ui") ui({ sender: message.sender });
                else if(commandName === "op") op(message, args);
                else if(commandName === "deop") deop(message, args);
                else if(commandName === "notify") notify(message);
                else if(commandName === "autoban") autoban(message);
                else if(commandName === "module") module(message, args);
                else if(commandName === "stats") stats(message, args);
                else if(commandName === "fullreport") fullreport(message);
                else if(commandName === "logs") logs(message);
                else if(commandName === "resetwarns") resetwarns(message, args);
                else if(commandName === "report") report(message, args);
                else if(commandName === "tag") tag(message, args);

                else if(commandName === "help") help(message);
                else if(commandName === "about") about(message, args);
                else if(commandName === "version") version(message);
                else if(commandName === "credits") credits(message);
                else throw Error(`Command ${commandName} was found in config.js but no handler for it was found`);

        } catch (error) {
            console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
            message.sender.sendMessage(`§r${themecolor}Rosh §j> §cThere was an error while trying to run this command:\n§8${error}\n${error.stack}`);
        }
    });
}