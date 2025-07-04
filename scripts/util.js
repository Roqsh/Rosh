import * as Minecraft from "@minecraft/server";
import config from "./data/config.js";
import data from "./data/data.js";
import { world } from "@minecraft/server";
import { resetWarns } from "./commands/staff/resetwarns.js";
import { Embed } from "./utils/Embed.js";
import { Webhook } from "./utils/Webhook.js";

/**
 * Alerts staff if a player fails a check.
 * @param {Minecraft.Player} player - The player who should be flagged.
 * @param {string} check - The name of the check that was failed.
 * @param {string} checkType - The type of sub-check that was failed.
 * @param {string | undefined} [debugName] - The name of the debug value.
 * @param {string | number | object | undefined} [debug] - The debug information.
 * @param {boolean} [revertAction=false] - Whether to teleport the player to their last good position.
 * @param {object | undefined} [cancelObject] - Object with property "cancel" to cancel the event. (Usually a before event)
 * @example flag(player, "Spammer", "B", "Delay", `${delay}ms`, false, Minecraft.ChatSendBeforeEvent);
 */
export function flag(player, check, checkType, debugName, debug, revertAction = false, cancelObject) {
    // Input validation
    if (!player.isPlayer()) throw new TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if (typeof check !== "string") throw new TypeError(`Error: check is type of ${typeof check}. Expected "string"`);
    if (typeof checkType !== "string") throw new TypeError(`Error: checkType is type of ${typeof checkType}. Expected "string"`);
    if (typeof debugName !== "string" && typeof debugName !== "undefined") throw new TypeError(`Error: debugName is type of ${typeof debugName}. Expected "string" or "undefined"`);
    if (typeof debug !== "string" && typeof debug !== "number" && typeof debug !== "object" && typeof debug !== "undefined") throw new TypeError(`Error: debug is type of ${typeof debug}. Expected "string", "number", "object", or "undefined"`);
    if (typeof revertAction !== "boolean") throw new TypeError(`Error: revertAction is type of ${typeof revertAction}. Expected "boolean"`);
    if (typeof cancelObject !== "object" && typeof cancelObject !== "undefined") throw new TypeError(`Error: cancelObject is type of ${typeof cancelObject}. Expected "object" or "undefined"`);

    // Exclude staff or whitelisted players if configured
    if ((config.exclude_staff && player.isOp()) || config.excluded_players.includes(player.name)) return;

    // Sanitize and limit debug information
    debug = String(debug).replace(/"|\\|\n/gm, "");
    if (debug.length > 256) {
        const extraLength = debug.length - 256;
        debug = debug.slice(0, 256) + `(+${extraLength} more)`;
    }

    const rotation = player.getRotation();

    // Teleport player if needed
    if (revertAction && !config.silent) {
        player.teleport(player.lastGroundPosition, {
            dimension: player.dimension,
            rotation: {x: rotation.x, y: rotation.y},
        });
    }

    // Cancel the event if requested
    if (cancelObject) cancelObject.cancel = true;

    // Handle scoreboard for the check
    const scoreboardObjective = `${check.toLowerCase()}vl`;
    if (!world.scoreboard.getObjective(scoreboardObjective)) {
        world.scoreboard.addObjective(scoreboardObjective, scoreboardObjective);
    }

    let currentVl = getScore(player, scoreboardObjective, 0);

    // Increment the violation level
    setScore(player, scoreboardObjective, currentVl + 1);
    currentVl++;

    const themecolor = config.themecolor;
    const thememode = config.thememode;

    // Notify staff in-game and log the flag to the UI log section
    handleAlert(player, check, checkType, currentVl, debugName, debug, themecolor, thememode);

    // Get check data
    const checkData = config.modules[`${check.toLowerCase()}${checkType.toUpperCase()}`];

    // Ensure the check data exists in the config.js file
    if (!checkData) throw new Error(`${player.name} flagged ${check}/${checkType} but no valid check data was found in config.js.`);

    // Ensure the check is enabled (However, all checks already check wheter the they are enabled, kinda making this useless)
    if (!checkData.enabled) throw new Error(`${player.name} flagged ${check}/${checkType} but the module was disabled.`);

    // Handle punishment based on the check's configuration
    const punishment = checkData.punishment?.toLowerCase();

    // Ensure the punishment has valid properties
    if (typeof punishment !== "string") throw new TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);

    // If the volume does not meet the requirements for a punishment, return early
    if (currentVl < checkData.minVlbeforePunishment) return;

    const kickvl = getScore(player, "kickvl", 0);

    // Calculate scores for fancy kick logic if enabled
    if (config.fancy_kick_calculation.enabled) {

        const movement_vl = getScore(player, "motionvl", 0) + getScore(player, "flyvl", 0) + getScore(player, "speedvl", 0) + getScore(player, "strafevl", 0) + getScore(player, "noslowvl", 0) + getScore(player, "invalidjumpvl", 0) + getScore(player, "invalidsprintvl", 0);
        const combat_vl = getScore(player, "reachvl", 0) + getScore(player, "killauravl", 0) + getScore(player, "autoclickervl", 0) + getScore(player, "hitboxvl", 0) + getScore(player, "aimvl", 0);
        const world_vl = getScore(player, "scaffoldvl", 0) + getScore(player, "nukervl", 0) + getScore(player, "towervl", 0);
        const misc_vl = getScore(player, "badpacketsvl", 0) + getScore(player, "badenchantsvl", 0) + getScore(player, "crashervl", 0) + getScore(player, "spammervl", 0) + getScore(player, "timervl", 0) + getScore(player, "autototemvl", 0) + getScore(player, "autoshieldvl", 0) + getScore(player, "illegalitemsvl", 0) + getScore(player, "namespoofvl", 0) + getScore(player, "exploitvl", 0);

        if (
            movement_vl > config.fancy_kick_calculation.movement &&
            combat_vl > config.fancy_kick_calculation.combat &&
            world_vl > config.fancy_kick_calculation.world &&
            misc_vl > config.fancy_kick_calculation.misc
        ) {
            handlePunishment("kick", player, check, checkType, themecolor, kickvl);
            return;
        }
    }

    // Handle punishments using a switch statement
    handlePunishment(punishment, player, check, checkType, themecolor, kickvl, "30d");
}

/**
 * Handles various types of punishments.
 * @param {string} punishment - The type of punishment (e.g., "kick", "ban", "mute", "none").
 * @param {Minecraft.Player} player - The player to be punished.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 * @param {number} [kickvl] - The current kick violation level.
 * @param {string} [punishmentLength] - The length of the punishment for bans.
 */
function handlePunishment(punishment, player, check, checkType, themecolor, kickvl, punishmentLength) {
    switch (punishment) {
        case "kick":
            handleKickPunishment(player, kickvl, check, checkType, themecolor);
            break;
        case "ban":
            handleBanPunishment(player, check, checkType, themecolor, punishmentLength);
            break;
        case "mute":
            handleMutePunishment(player, check, checkType, themecolor);
            break;
        case "none":
            handleNoPunishment(player, check, checkType, themecolor);
            break;
        default:
            console.warn(`Unhandled punishment type: ${punishment}. Only "kick", "ban", "mute" and "none" are supported.`);
            break;
    }
}

/**
 * Handles kick punishment logic.
 * @param {Minecraft.Player} player - The player to be kicked.
 * @param {number} kickvl - The current kick violation level.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 */
function handleKickPunishment(player, kickvl, check, checkType, themecolor) {
    try {
        // Increment the kick violation level
        setScore(player, "kickvl", kickvl + 1);

        // Check if the player should be banned instead of kicked
        if (kickvl > config.kicksBeforeBan) {
            if (config.autoban) {
                handleBanPunishment(player, check, checkType, themecolor, "30d");
            }
            // Reset the kick violation level
            setScore(player, "kickvl", 0);

        } else {
            // Notify about the kick and reset warnings
            const message = `${timeDisplay()}§8${player.name} §chas been kicked!`;
            data.recentLogs.push(message);

            tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas been kicked for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!`, "notify");
            if (config.console_debug) console.warn(`Rosh > ${player.name} has been kicked for ${check}/${checkType.toUpperCase()}!`);

            handleKickWebhook(player, check, checkType, kickvl)

            resetWarns(player);

            player.kick(`${themecolor}Rosh §j> §cKicked for ${themecolor}${check} §c!`);
        }
    } catch (error) {
        // Fallback in case of an error
        player.triggerEvent("rosh:kick");
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
    }
}

/**
 * Handles ban punishment logic.
 * @param {Minecraft.Player} player - The player to be banned.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 * @param {string} [punishmentLength="30d"] - The length of the ban.
 */
function handleBanPunishment(player, check, checkType, themecolor, punishmentLength = "30d") {
    try {
        if (config.autoban) {
            // Tag the player as banned and remove existing ban-related tags
            player.addTag("isBanned");
            player.getTags().forEach(tag => {
                if (tag.includes("Reason:") || tag.includes("Length:")) player.removeTag(tag);
            });

            // Add the default reason message
            player.addTag(`Reason:Cheat Detection`);

            // Calculate the ban length based on the provided punishment length
            let banLength;
            let untilDate = null;
            let duration = "Permanent";

            if (punishmentLength !== "Permanent") {
                try {
                    banLength = convertToMs(punishmentLength);
                    player.addTag(`Length:${Date.now() + banLength}`);
                    untilDate = new Date(Date.now() + banLength);
                    duration = `${punishmentLength} (Until ${untilDate.toLocaleString()})`;
                } catch (error) {
                    console.error(`Error parsing ban length: ${error.message}`);
                }
            }

            // Save all ban-related information
            data.banList[player.name] = {
                bannedBy: "Rosh Anticheat",
                date: new Date().toLocaleString(),
                reason: `${check}/${checkType.toUpperCase()}`,
                duration: duration
            };

            // Notify about the ban and reset warnings
            const message = `${timeDisplay()}§8${player.name} §chas been banned!`;
            data.recentLogs.push(message);

            tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas been banned for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!`, "notify");
            if (config.console_debug) console.warn(`Rosh > ${player.name} has been banned for ${check}/${checkType.toUpperCase()}!`);

            handleBanWebhook(player, check, checkType, duration);

        } else {
            tellStaff(`${themecolor}Rosh §j> §8${player.name} §cshould have been banned for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§c, but '§8config.autoban§c' was disabled!`, "notify");
            if (config.console_debug) console.warn(`Rosh > ${player.name} should have been banned for ${check}/${checkType.toUpperCase()}, but 'config.autoban' was disabled!`);
        }
    } catch (error) {
        // Fallback in case of an error
        if (config.autoban) {
            player.triggerEvent("rosh:kick");
        }
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
    }

    resetWarns(player);
}

/**
 * Handles mute punishment logic.
 * @param {Minecraft.Player} player - The player to be muted.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 */
function handleMutePunishment(player, check, checkType, themecolor) {
    // If the player is already muted, dont send the mute message again
    if (!player.hasTag("isMuted")) {
        // Notify the muted player about the mute
        player.sendMessage(`${themecolor}Rosh §j> §cYou have been muted!`);
    }

    // Tags the player as muted which prevents messages from being sent in Minecraft.ChatSendBeforeEvent
    player.mute();

    // Notify about the mute and reset warnings
    const message = `${timeDisplay()}§8${player.name} §chas been muted!`;
    data.recentLogs.push(message);

    tellStaff(`${themecolor}Rosh §j> §8${player.name} §chas been muted for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!`, "notify");
    if (config.console_debug) console.warn(`Rosh > ${player.name} has been muted for ${check}/${checkType.toUpperCase()}!`);
    
    resetWarns(player);
}

/**
 * Handles punishment logic if no direct punishment should be applied to the player.
 * @param {Minecraft.Player} player - The player who exceeded a checks volume.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 */
function handleNoPunishment(player, check, checkType, themecolor) {

    // Notify staff and reset warnings
    const logMessage = `${timeDisplay()}§8${player.name} §cfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §cmultiple times!`;
    data.recentLogs.push(logMessage);

    const staffMessage = `${themecolor}Rosh §j> §8${player.name} §chas reached the threshold for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c! (No punishment was applied)`;
    tellStaff(staffMessage, "notify");
    if (config.console_debug) console.warn(staffMessage);
    
    resetWarns(player);
}

/**
 * Handles alerting staff and logging information when a player fails a check.
 * @param {Minecraft.Player} player - The player who failed the check.
 * @param {string} check - The name of the check that was failed.
 * @param {string} checkType - The type of sub-check that was failed.
 * @param {number} currentVl - The current violation level.
 * @param {string} debugName - The name of the debug value.
 * @param {string | number | object} debug - Debug information.
 * @param {string} themecolor - The theme color for messages.
 * @param {string} thememode - The theme mode for alert messages.
 */
function handleAlert(player, check, checkType, currentVl, debugName, debug, themecolor, thememode) {

    // Validate thememode and set it to default if incorrect.
    if (typeof thememode !== "string" || (thememode !== "Rosh" && thememode !== "Alice")) {
        thememode = "Rosh";
    }

    // Determine the maximum violation level that a player is allowed to have before a punishment
    const maxVl = config.modules[check.toLowerCase() + checkType.toUpperCase()].minVlbeforePunishment;

    // Handling alert based on the theme mode
    if (thememode === "Rosh") {

        // Notify staff in-game
        tellStaff(`${themecolor}Rosh §j> §8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {${debugName}=${debug}, §8${currentVl}x§j}`, ["notify", "debug"]);
        tellStaff(`${themecolor}Rosh §j> §8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {§8${currentVl}x§j}`, "notify", "debug");

        // Log the flag to the UI log section
        const message = config.logSettings.showDebug 
            ? `${timeDisplay()}§8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType} §j- {${debugName}=${debug}, §8${currentVl}x§j}`
            : `${timeDisplay()}§8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType} §j- {§8${currentVl}x§j}`;
        data.recentLogs.push(message);

        // Log to console if enabled
        if (config.console_debug) {
            console.warn(`Rosh > ${player.name} failed ${check}/${checkType.toUpperCase()} - {${debugName}=${debug}, ${currentVl}x}`);
        }

    } else if (thememode === "Alice") {

        // Generate a visual representation of the violation level
        let volume = ``;

        // If maxVl exceeds 10, calculate filled as a percentage of 10
        if (maxVl > 10) {

            const filled = Math.round((10 * currentVl) / maxVl);
            const unfilled = 10 - filled;

            // Fill the volume bar with filled and unfilled sections
            for (let i = 0; i < filled; i++) {
                volume += `${themecolor}|`;
            }
            for (let i = 0; i < unfilled; i++) {
                volume += `§8|`;
            }

        } else {
            
            // Fill the volume bar directly if maxVl is 10 or less
            for (let i = 0; i < currentVl; i++) {
                volume += `${themecolor}|`;
            }
            for (let i = 0; i < maxVl - currentVl; i++) {
                volume += `§8|`;
            }
        }

        // Notify staff in-game
        tellStaff(`${themecolor}Rosh §j> §8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {${debugName}=${debug}§j} [${volume}§j]`, ["notify", "debug"]);
        tellStaff(`${themecolor}Rosh §j> §8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - [${volume}§j]`, "notify", "debug");

        // Log the flag to the UI log section
        const message = config.logSettings.showDebug 
            ? `${timeDisplay()}§8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType} §j- {${debugName}=${debug}§j} [${volume}§j]`
            : `${timeDisplay()}§8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType} §j- [${volume}§j]`;
        data.recentLogs.push(message);
        
        // Log to console if enabled
        if (config.console_debug) {
            console.warn(`Rosh > ${player.name} failed ${check}/${checkType.toUpperCase()} - {${debugName}=${debug}} [${volume}]`);
        }
    }

    // Send a webhook if enabled
    handleAlertWebhook(player, check, checkType, debugName, debug, currentVl, maxVl);
}

/**
 * Handles the webhook logic when a player fails a check.
 * @param {Minecraft.Player} player - The player who failed the check.
 * @param {string} check - The name of the check that was failed.
 * @param {string} checkType - The type of sub-check that was failed.
 * @param {string} debugName - The name of the debug value.
 * @param {string | number | object} debug - Debug information.
 * @param {number} currentVl - The current violation level.
 * @param {number} maxVl - The maximum violation level before punishment.
 */
function handleAlertWebhook(player, check, checkType, debugName, debug, currentVl, maxVl) {

    // Only send a webhook if enabled
    if (!config.webhook.enabled) return;

    // Handle webhook based on style
    if (config.webhook.style === "message") {

        const message = `**Rosh** > ${player.name} failed ${check}/${checkType.toUpperCase()} - {${debugName}=${debug}} [${currentVl}/${maxVl}]`;

        // Send the webhook
        const url = config.webhook.url;
        Webhook.sendWebhook(url, { content: message, embeds: undefined });

    } else if (config.webhook.style === "embed") {
        
        const embed = new Embed();
        
        // Configure the embed's properties
        embed.setTitle("Alert");
        embed.setTimestamp(new Date());
        embed.setDescription([
            `Player: \` ${player.name} \``,
            `Check: \` ${check}/${checkType.toUpperCase()} \``,
            `Debug: \` ${debugName}=${debug} \``,
            `Violations: \` ${currentVl}/${maxVl} \``
        ]);
        
        // Send the webhook
        const url = config.webhook.url;
        Webhook.sendWebhook(url, { content: undefined, embeds: [embed] });
    }
}

/**
 * Handles sending a webhook message when a player is kicked.
 * @param {Minecraft.Player} player - The player who was kicked.
 * @param {string} check - The name of the check that was failed.
 * @param {string} checkType - The type of sub-check that was failed.
 * @param {number} kickVl - The current kick violation level.
 */
function handleKickWebhook(player, check, checkType, kickVl) {

    // Only send a webhook if enabled
    if (!config.webhook.enabled) return;

    // Handle webhook based on style
    if (config.webhook.style === "message") {

        const violations = config.autoban ? ` [${kickVl}/${config.kicksBeforeBan}]` : "";

        const message = `**Rosh** > ${player.name} has been kicked for ${check}/${checkType.toUpperCase()}!${violations}`;

        const url = config.webhook.url;
        Webhook.sendWebhook(url, { content: message, embeds: undefined });

    } else if (config.webhook.style === "embed") {
        
        const embed = new Embed();

        const violations = config.autoban ? `\nViolations: \` ${kickVl}/${config.kicksBeforeBan} \`` : "";
        
        // Configure the embed's properties
        embed.setTitle("Kick");
        embed.setColor(16711680); // Red
        embed.setTimestamp(new Date());
        embed.setDescription([
            `Player: \` ${player.name} \``,
            `Reason: \` ${check}/${checkType.toUpperCase()} \``,
            `By: \` Rosh Anticheat \`${violations}`, // Only show kickBeforeBan-violations if autoban is enabled
        ]);
        
        // Send the webhook
        const url = config.webhook.url;
        Webhook.sendWebhook(url, { content: undefined, embeds: [embed] });
    }
}

/**
 * Sends a webhook notification when a player is banned.
 * @param {Minecraft.Player} player - The player who was banned.
 * @param {string} check - The name of the check that was failed.
 * @param {string} checkType - The type of sub-check that was failed.
 * @param {string} duration - The duration of the ban (e.g., "30d" for 30 days).
 */
function handleBanWebhook(player, check, checkType, duration) {

    // Only send a webhook if enabled
    if (!config.webhook.enabled) return;

    // Handle webhook based on style
    if (config.webhook.style === "message") {

        const message = `**Rosh** > ${player.name} has been banned for ${check}/${checkType.toUpperCase()}!`;

        const url = config.webhook.url;
        Webhook.sendWebhook(url, { content: message, embeds: undefined });

    } else if (config.webhook.style === "embed") {
        
        const embed = new Embed();
        
        // Configure the embed's properties
        embed.setTitle("Ban");
        embed.setColor(16711680); // Red
        embed.setTimestamp(new Date());
        embed.setDescription([
            `Player: \` ${player.name} \``,
            `Reason: \` ${check}/${checkType.toUpperCase()} \``,
            `Duration: \` ${duration} \``,
            `By: \` Rosh Anticheat \``
        ]);
        
        // Send the webhook
        const url = config.webhook.url;
        Webhook.sendWebhook(url, { content: undefined, embeds: [embed] });
    }
}



/**
 * Bans a player from the game.
 * @param {Minecraft.Player} player - The player to be banned.
 * @returns {boolean} Whether or not the player was banned. (If the ban length runs out **OR** the player gets unbanned by staff **OR** the player is in a ban whitelist, this will return false.)
 * @example ban(rqosh); // Returns a boolean indicating whether or not the player was banned.
 * @throws {TypeError} If player is not an object.
 */
export function ban(player) {
    // Validate that the input is an object
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    }

    // If the player is in the whitelist, do nothing
    if (config.excluded_players.includes(player.name)) return false;

    const themecolor = config.themecolor;

    // Define messages for unbanning scenarios
    const unbanQueueMessage = `${themecolor}Rosh §j> §8${player.name} §ahas been found in the unban queue and has been unbanned!`;
    const expiredBanMessage = `${themecolor}Rosh §j> §8${player.name}'s §aban has expired and has now been unbanned!`;

    // Extract the base player name for checking the unban queue
    const playerName = player.name.toLowerCase().split(" ")[0];

    // Check if the player is in the unban queue
    if (data.unbanQueue.includes(playerName)) {
        // Remove the ban tag/unban and inform staff
        player.removeTag("isBanned");
        tellStaff(unbanQueueMessage);

        // Remove all tags related to ban reason and length
        player.getTags().forEach(tag => {
            if (tag.includes("Reason:") || tag.includes("Length:")) player.removeTag(tag);
        });

        // Remove the player from the unban queue
        delete data.banList[player.name];
        data.unbanQueue = data.unbanQueue.filter(name => name !== playerName);
        return false;
    }

    // Initialize variables for reason and time
    let reason;
    let time;

    // Extract the reason and length tags from the player's tags
    player.getTags().forEach(tag => {
        if (tag.startsWith("Reason:")) {
            reason = tag.slice(7); // Extract reason text
        } else if (tag.startsWith("Length:")) {
            time = tag.slice(7); // Extract ban end time
        }
    });

    // If there is a length tag, check if the ban has expired
    if (time) {
        const currentTime = Date.now();
        const banEndTime = Number(time);

        if (banEndTime < currentTime) {
            // Inform staff about the expired ban and remove related tags
            tellStaff(expiredBanMessage);

            // Remove the ban information from data.banList
            delete data.banList[player.name];

            player.removeTag("isBanned");

            player.getTags().forEach(tag => {
                if (tag.includes("Reason:") || tag.includes("Length:")) player.removeTag(tag);
            });

            return false;
        }

        // Calculate the remaining ban time
        const remainingTime = convertToTime(banEndTime - currentTime);
        time = `§nYou have §8${remainingTime.weeks} §nweek${remainingTime.weeks > 1 ? "s" : ""}, §8${remainingTime.days} §nday${remainingTime.days > 1 ? "s" : ""}, §8${remainingTime.hours} §nhour${remainingTime.hours > 1 ? "s" : ""}, §8${remainingTime.minutes} §nminute${remainingTime.minutes > 1 ? "s" : ""} and §8${remainingTime.seconds} §nsecond${remainingTime.seconds > 1 ? "s" : ""} left!`;
    }

    // Default values if reason or time is not provided
    let banReason;
    if (reason) {
        banReason = ` for §8${reason}§c!`;
    } else {
        banReason = "!";
    }
    const banLength = time || "§nYour punishment is §8Permanent§n!";

    // Determine the final ban message
    let banMessage = `§r${themecolor}Rosh §j> §cYou have been banned${banReason}\n\n ${banLength}`;
    if (config.customBanMessage) {
        banMessage = `${banMessage}\n\n ${config.customBanMessage}`;
    }

    // Kick the player with the ban message
    player.kick(banMessage);

    return true;
}



/**
 * Executes an animation on the player.
 * @param {Minecraft.Player} player - The player where the animation gets executed
 * @param {number} type - The type of the animation
 * @example animation(rqosh, 2); // Executes the totem particle animation
 * @throws {TypeError} If player is not an object or type is not a number
 */
export function animation(player, type) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    if (typeof type !== 'number' || !Number.isInteger(type) || type < 1 || type > 5) {
        throw new TypeError(`Error: type is not a valid animation type. Expected an integer number between 1 and 5.`);
    }

    // Define the available animations
    const animations = {
        1: "huge_explosion_emitter",
        2: "totem_particle",
        3: "campfire_smoke_particle",
        4: "critical_hit_emitter",
        5: "mobflame_single"
    };

    // Get the animation based on the type
    const animation = animations[type];

    // Check if the animation exists
    if (!animation) {
        throw new Error(`Error: No animation found for type ${type}.`);
    }

    // Create the location to spawn the particle
    const location = {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
    };

    // Execute the animation
    try {
        player.spawnParticle(`minecraft:${animation}`, location);
    } catch (error) {
        console.error(`Error: Failed to execute animation for player. ${error.message}`);
    }
}



/**
 * Parses a time string into milliseconds.
 * @param {string} str - The time value to convert to milliseconds
 * @example convertToMs("24d"); // returns 2073600000
 * @returns {number | null} The converted time in milliseconds, or null if the input is invalid
 * @throws {TypeError} If the input is not a string
 */
export function convertToMs(str) {
    // Validate the input
    if (typeof str !== "string") {
        throw new TypeError(`Error: str is type of ${typeof str}. Expected "string"`);
    }

    // Match the input string to a pattern of one or more digits followed by a single time unit character
    const time = str.match(/^(\d+)([smhdwy])$/);

    // If the input does not match the expected pattern, return null
    if (!time) {
        return null;
    }

    // Extract the number and the unit from the matched groups
    const [, num, unit] = time;

    // Define a mapping from unit characters to milliseconds
    const unitToMs = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
        w: 604800000,
        y: 31536000000
    };

    // Convert the number string to an integer and multiply by the corresponding milliseconds value
    const milliseconds = unitToMs[unit] * Number(num);

    // Check for overflow or invalid large numbers, if necessary
    if (!Number.isFinite(milliseconds)) {
        return null;
    }

    // Return the calculated milliseconds value
    return milliseconds;
}



/**
 * Converts milliseconds to a human-readable time string.
 * @param {number} [milliseconds=0] - The number of milliseconds to convert
 * @returns {Object} An object containing the converted time in weeks, days, hours, minutes, and seconds
 * @throws {TypeError} Throws if the input is not a number or is negative
 * @example convertToTime(88200000); // Returns { weeks: 0, days: 1, hours: 0, minutes: 30, seconds: 0 }
 */
export function convertToTime(milliseconds = 0) {
    // Validate the input
    if (typeof milliseconds !== 'number' || milliseconds < 0) {
        throw new TypeError(`Error: milliseconds must be a non-negative number. Received: ${milliseconds}`);
    }

    // Define constants for time conversion
    const msPerSecond = 1000;
    const msPerMinute = 60 * msPerSecond;
    const msPerHour = 60 * msPerMinute;
    const msPerDay = 24 * msPerHour;
    const msPerWeek = 7 * msPerDay;

    // Calculate the time components
    const weeks = Math.floor(milliseconds / msPerWeek);
    const days = Math.floor((milliseconds % msPerWeek) / msPerDay);
    const hours = Math.floor((milliseconds % msPerDay) / msPerHour);
    const minutes = Math.floor((milliseconds % msPerHour) / msPerMinute);
    const seconds = Math.floor((milliseconds % msPerMinute) / msPerSecond);

    // Return the converted time as an object
    return { weeks, days, hours, minutes, seconds };
}



/**
 * Displays a time based on the provided format.
 * @param {string} format - Either 'german' or 'default'. If no format is given, default will be used.
 * @returns {string} formattedTime - The formatted time as a string.
 * @remarks This functon was designed for the 'showTimestamps' option for logging,
 * and therefore only returns a string if enabled via config! (config.logSettings.showTimestamps)
 * @example timeDisplay(); // Returns current time in this format: [12:24:2050]
 */
export function timeDisplay(format) {

    // Create a new Date object
    const now = new Date();

    // Get date and time components
    const day = String(now.getDate()).padStart(2, '0'); // e.g., 11
    const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., 08 (months are zero-indexed)
    const year = now.getFullYear(); // e.g., 2024

    let formattedTime = ``;

    if (format === "german") {
    
        // Format the date and time in German style
        formattedTime = config.logSettings.showTimestamps 
            ? `§j[§8${day}.${month}.${year}§j] ` 
            : ``;

    } else {
        
        formattedTime = config.logSettings.showTimestamps
            ? `§j[§8${month}:${day}:${year}§j] `
            : ``;
    }

    return formattedTime;
}



/**
 * Gets the scoreboard objective value for a player.
 * @param {Minecraft.Player} player - The player to get the scoreboard value from
 * @param {string} objectiveName - The name of the scoreboard objective
 * @param {number} [defaultValue=0] - Default value to return if unable to get scoreboard score
 * @example getScore(player, "delay", 1); // Gets the scoreboard objective value for the player, returns 1 if unable to get scoreboard score
 * @remarks Returns default value if unable to get score
 * @returns {number} score - The scoreboard objective value
 * @throws {TypeError} If player is not an object, objectiveName is not a string, or defaultValue is not a number
 */
export function getScore(player, objectiveName, defaultValue = 0) {
    // Check if the player is an object
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    // Check if the objectiveName is a string
    if (typeof objectiveName !== 'string') {
        throw new TypeError(`Error: objectiveName is type of ${typeof objectiveName}. Expected "string".`);
    }

    // Check if the defaultValue is a number
    if (typeof defaultValue !== 'number') {
        throw new TypeError(`Error: defaultValue is type of ${typeof defaultValue}. Expected "number".`);
    }

    try {
        // Get the objective, or create it if it doesn't exist
        let objective = world.scoreboard.getObjective(objectiveName);
        if (!objective) {
            player.runCommandAsync(`/scoreboard objectives add ${objectiveName} dummy`);
            objective = world.scoreboard.getObjective(objectiveName);
        }

        // Check if the objective was successfully created or retrieved
        if (!objective) {
            throw new Error(`Failed to create or retrieve objective "${objectiveName}".`);
        }

        // Get the score for the player or the default value if unable to get score
        const score = objective.getScore(player);
        return typeof score === 'number' ? score : defaultValue;
    } catch (error) {
        console.error(`Error: Failed to get score for player. ${error.message}`);
        return defaultValue;
    }
}



/**
 * Sets the scoreboard objective value for a player.
 * @param {Minecraft.Player} player - The player to set the score for
 * @param {string} objectiveName - The scoreboard objective
 * @param {number} value - The new value of the scoreboard objective
 * @example setScore(player, "delay", 2); // Sets the scoreboard objective "delay" to 2
 * @throws {TypeError} If player is not an object, objectiveName is not a string, or value is not a number
 */
export function setScore(player, objectiveName, value) {
    // Check if the player is an object
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    // Check if the objectiveName is a string
    if (typeof objectiveName !== 'string') {
        throw new TypeError(`Error: objectiveName is type of ${typeof objectiveName}. Expected "string".`);
    }

    // Check if the value is a number
    if (typeof value !== 'number') {
        throw new TypeError(`Error: value is type of ${typeof value}. Expected "number".`);
    }

    try {
        // Get the objective, or create it if it doesn't exist
        let objective = world.scoreboard.getObjective(objectiveName);
        if (!objective) {
            player.runCommandAsync(`/scoreboard objectives add ${objectiveName} dummy`);
            objective = world.scoreboard.getObjective(objectiveName);
        }

        // Check if the objective was successfully created or retrieved
        if (!objective) {
            throw new Error(`Failed to create or retrieve objective "${objectiveName}".`);
        }

        // Set the score for the player
        objective.setScore(player, value);
    } catch (error) {
        console.error(`Error: Failed to set score for player. ${error.message}`);
    }
}



/**
 * Calculates the angle between a player and a second position on the XZ-level (2D).
 * @param {Minecraft.Player} player - The Player to calculate the angle on
 * @param {object} position - The position to calculate the angle to
 * @returns {number} - The angle between the player and the position in degrees.
 * @remarks The param `position` both works with an entity or a block.
*/
export function getAngle(player, position) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    if (typeof position !== "object") {
        throw new TypeError(`Error: position is of type ${typeof position}. Expected "object".`);
    }

    // Get positions of player and the second position
    const playerPos = player.location;
    const secondPos = position.location;

    // Calculate differences in x and z coordinates
    const deltaX = secondPos.x - playerPos.x;
    const deltaZ = secondPos.z - playerPos.z;

    // Calculate the angle in radians between the player and the second position
    let angleRad = Math.atan2(deltaZ, deltaX);

    // Convert the angle from radians to degrees
    let angleDeg = angleRad * 180 / Math.PI;

    // Adjust the angle based on the player's rotation
    const playerYaw = player.getRotation().y;
    angleDeg = angleDeg - playerYaw - 90;

    // Normalize the angle to be between -180 and 180 degrees
    if (angleDeg <= -180) {
        angleDeg += 360;
    } else if (angleDeg > 180) {
        angleDeg -= 360;
    }

    // Return the absolute value of the angle
    return Math.abs(angleDeg);
}



/**
 * Returns a number representing the eye height on the y-axis of a target depending on their current action.
 * @param {Minecraft.Player | Minecraft.Entity} target - The target to calculate the eye height for.
 * @returns {number} - The eye height of the target.
 * @remarks
 * TODO: Once Mojang adds .isCrawling or something similar, account for it by 0.40625. (.isRiding needs to be accounted for too)
 */
export function getEyeHeight(target) {
    // Validate the input
    if (typeof target !== "object") {
        throw new TypeError(`Error: player is of type ${typeof target}. Expected "object".`);
    }
    
    switch (true) {
        case target.isSneaking:
            return 1.28125;

        case target.isSwimming:
            return 0.40625;

        case target.isGliding:
            return 0.40625;

        default:
            return 1.625;
    }
}



/**
 * Finds the nearest player to a given entity. [Unused]
 * @param {Minecraft.Entity} entity - The entity used to determine what player is the closest to that entity.
 * @returns {object|null} - The closest player object, or null if no player is found.
 */
export function getClosestPlayer(entity) {
    // Check if entity is an object
    if (typeof entity !== "object") {
        throw new TypeError(`Error: entity is of type ${typeof entity}. Expected "object".`);
    }

    // Check if the entity has necessary properties
    if (!entity.dimension || !entity.location) {
        throw new Error("Error: Entity is missing necessary properties (dimension or location).");
    }

    // Get players in the same dimension as the entity
    const playersInDimension = entity.dimension.getPlayers();

    // Initialize variables for tracking the closest player and its distance
    let closestPlayer = null;
    let closestDistanceSquared = Infinity;

    // Iterate through players to find the closest one
    for (const player of playersInDimension) {
        // Calculate squared distance between entity and player
        const dx = entity.location.x - player.location.x;
        const dy = entity.location.y - player.location.y;
        const dz = entity.location.z - player.location.z;
        const distanceSquared = dx * dx + dy * dy + dz * dz;

        // Update closest player if this player is closer
        if (distanceSquared < closestDistanceSquared) {
            closestPlayer = player;
            closestDistanceSquared = distanceSquared;
        }
    }

    return closestPlayer;
}



/**
 * Finds a player object by their name.
 * @param {string} name - The player to look for.
 * @returns {Minecraft.Player | null} - The player object, or null if not found.
 * @throws {TypeError} If name is not a string.
 */
export function getPlayerByName(name) {
    // Validate the input
    if (typeof name !== "string") {
        throw new TypeError(`Error: name is type of ${typeof name}. Expected "string".`);
    }

    // Get all players in the world
    const players = world.getPlayers();

    // Find the player with the matching name
    for (const player of players) {
        if (player.name === name) {
            return player;
        }
    }

    return null;
}



/**
 * Finds a player object by their id.
 * @param {string} id - The player to look for.
 * @returns {Minecraft.Player | null} - The player object, or null if not found.
 * @throws {TypeError} If id is not a number.
 */
export function getPlayerById(id) {
    // Validate the input
    if (typeof id !== "number") {
        throw new TypeError(`Error: id is type of ${typeof id}. Expected "number".`);
    }

    // Get all players in the world
    const players = world.getPlayers();

    // Find the player with the matching id
    for (const player of players) {
        if (player.id === id) {
            return player;
        }
    }

    return null;
}



/**
 * Checks if a string ends with a number enclosed in parentheses.
 * @param {string} string - The string to check.
 * @returns {boolean} - Returns true if the string ends with a number inside parentheses, false otherwise.
 * @remarks This function is used to detect if a player's name has been modified by the game. (eg. "Player(2)" )
 */
export function endsWithNumberInParentheses(string) {
    return /\(\d+\)$/.test(string);
}



/**
 * Grants operator status to a specified player.
 * @param {Minecraft.Player} player - The player to grant the operator status to.
 * @param {Minecraft.Player} initiator - The player who initiated the action.
 * @example addOp(player, initiator); // Adds operator status to the player
 * @throws {TypeError} If player or initiator is not an object.
 */
export function addOp(player, initiator) {
    // Validate the inputs
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }
    if (typeof initiator !== 'object' || initiator === null) {
        throw new TypeError(`Error: initiator is type of ${typeof initiator}. Expected "object".`);
    }

    const themecolor = config.themecolor;

    try {
        // Check if the player already has an operator status before attempting to add it
        if (!player.isOp()) {
            // Add the operator status to the player
            player.setOp(true);

            // Log the event to the UI and console
            const message = `${timeDisplay()}§8${player.name} §ahas been oped by §8${initiator.name}§a!`;
            data.recentLogs.push(message);

            console.log(message);

            player.sendMessage(`§r${themecolor}Rosh §j> §aYou have been given operator status by §8${initiator.name}§a.`);
            tellStaff(`§r${themecolor}Rosh §j> §8${initiator.name} §ahas given §8${player.name} §aOperator status.`);
        } else {
            initiator.sendMessage(`§r${themecolor}Rosh §j> §8${player.name} §calready has an Operator status!`);
        }
    } catch (error) {
        console.error(`Error: Failed to grant operator status to ${player.name}: ${error.message}`);
    }
}



/**
 * Revokes a player's operator status.
 * @param {Minecraft.Player} player - The player to be revoked of operator status.
 * @param {inecraft.Player} initiator - The player who initiated the action.
 * @example removeOp(player, initiator); // Removes operator status from the player
 * @throws {TypeError} If player or initiator is not an object.
 */
export function removeOp(player, initiator) {
    // Validate the inputs
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }
    if (typeof initiator !== 'object' || initiator === null) {
        throw new TypeError(`Error: initiator is type of ${typeof initiator}. Expected "object".`);
    }

    const themecolor = config.themecolor;

    try {
        // Check if the player has an operator status before attempting to remove it
        if (player.isOp()) {
            // Remove the operator status from the player
            player.setOp(false);

            // Log the event to the UI and console
            const message = `${timeDisplay()}§8${player.name} §chas been de-oped by §8${initiator.name}§c!`;
            data.recentLogs.push(message);

            console.log(message);

            player.sendMessage(`§r${themecolor}Rosh §j> §cYour operator status has been revoked by §8${initiator.name}§c.`);
            tellStaff(`§r${themecolor}Rosh §j> §8${initiator.name} §chas removed §8${player.name}'s §cOperator status.`);
        } else {
            initiator.sendMessage(`§r${themecolor}Rosh §j> §8${player.name} §cdoesnt have an Operator status!`);
        }
    } catch (error) {
        console.error(`Error: Failed to remove operator status from ${player.name}: ${error.message}`);
    }
}



/**
 * Sends a message to all staff members. (Operator status)
 * @param {string} message - The message to send.
 * @param {string|string[]} [tags] - An optional tag or array of tags to differentiate between staff members.
 * @param {string|string[]} [excludeTags] - An optional tag or array of tags to exclude certain staff members.
 * @throws {TypeError} If message is not a string.
 */
export function tellStaff(message, tags, excludeTags) {
    // Validate the input
    if (typeof message !== "string") {
        throw new TypeError(`Error: message is type of ${typeof message}. Expected "string".`);
    }

    // Ensure tags and excludeTags are arrays if provided
    if (tags && !Array.isArray(tags)) {
        tags = [tags];
    }
    if (excludeTags && !Array.isArray(excludeTags)) {
        excludeTags = [excludeTags];
    }

    // Get all players
    const players = world.getPlayers();

    // Send the message to each staff member, optionally filtered by tags and excludeTags
    for (const player of players) {

        if (player.isOp()) {

            let hasAllTags = true;
            let hasExcludeTag = false;

            // Check for include tags
            if (tags) {
                for (const tag of tags) {
                    if (!player.hasTag(tag)) {
                        hasAllTags = false;
                        break;
                    }
                }
            }

            // Check for exclude tags
            if (excludeTags) {
                for (const excludeTag of excludeTags) {
                    if (player.hasTag(excludeTag)) {
                        hasExcludeTag = true;
                        break;
                    }
                }
            }

            // Send message if all include tags are present and no excluded tags are present
            if (hasAllTags && !hasExcludeTag) {
                player.sendMessage(message);
            }
        }
    }
}



/**
 * Sets the title, subtitle, and actionbar for a player. [Unused]
 * @param {Minecraft.Player} player - The player object.
 * @param {string|null} [title=null] - The main title to display. If null, no title is displayed.
 * @param {string|null} [subtitle=null] - The subtitle to display. If null, no subtitle is displayed.
 * @param {string|null} [actionbar=null] - The actionbar message to display. If null, no actionbar message is displayed.
 * @returns {Promise<void>} A promise that resolves when all commands have been executed.
 */
export async function setTitle(player, title = null, subtitle = null, actionbar = null) {
    // Validate the inputs
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }
    
    try {
        const commands = [];

        // Add the title command if a title is provided
        if (title) {
            commands.push(`title "${player.name}" title ${title}`);
        }

        // Add the subtitle command if a subtitle is provided
        if (subtitle) {
            commands.push(`title "${player.name}" subtitle ${subtitle}`);
        }

        // Add the actionbar command if an actionbar message is provided
        if (actionbar) {
            commands.push(`title "${player.name}" actionbar ${actionbar}`);
        }

        // Execute all collected commands in parallel if there are any
        if (commands.length > 0) {
            await Promise.all(commands.map(command => player.runCommandAsync(command)));
        }
    } catch (error) {
        // Log an error message if command execution fails
        console.error(`Failed to set titles for player ${player.name}:`, error);
    }
}



/**
 * Gets a player's horizontal speed.
 * @param {Minecraft.Player} player - The player to get the speed from.
 * @returns {number} The horizontal speed of the player.
 * @throws {TypeError} If player is not an object.
 */
export function getSpeed(player) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    // Get the player's velocity
    const velocity = player.getVelocity();

    // Calculate the horizontal speed using the Pythagorean theorem
    const horizontalSpeed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);

    // Return the horizontal speed
    return horizontalSpeed;
}



/**
 * Gets a player's total speed. [Unused]
 * @param {Minecraft.Player} player - The player to get the speed from.
 * @returns {number} The total speed of the player.
 * @throws {TypeError} If player is not an object.
 */
export function getTotalSpeed(player) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    // Get the player's velocity
    const velocity = player.getVelocity();

    // Calculate the total speed using the Pythagorean theorem in 3D
    const totalSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);

    // Return the total speed
    return totalSpeed;
}



/**
 * Calculates a player's horizontal velocity.
 * @param {Minecraft.Player} player - The player to get the velocity from.
 * @returns {number} The horizontal velocity of the player.
 * @throws {TypeError} If player is not an object.
 * @example
 * const velocity = hVelocity(player);
 * console.log(`Player's horizontal velocity: ${velocity}`);
 */
export function hVelocity(player) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    try {
        // Get the player's velocity
        const velocity = player.getVelocity();

        // Calculate the horizontal velocity using the Pythagorean theorem
        const horizontalVelocity = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);

        // Return the horizontal velocity
        return horizontalVelocity;
    } catch (error) {
        console.error(`Error: Failed to calculate horizontal velocity. ${error.message}`);
        return 0; // Return 0 as a fallback value
    }
}



/**
 * Returns true if a player is surrounded by air.
 * @param {Minecraft.Player} player - The player to check.
 * 
 * @important
 * This method currently causes **2 major issues !!!** :
 * - A fly bypass similar to the one used in Flareon where you could just bridge next to you and fly.
 * - A hover bypass aslong as you dont go up more than 1 block which can lead to extreme speeds etc.
 */
export function aroundAir(player) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    const { x, y, z } = player.location;
    const dimension = player.dimension;

    // Iterate through the surrounding blocks (3x3x3 cube centered on the player)
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                // Skip the player's current location
                if (dx === 0 && dy === 0 && dz === 0) continue;

                const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
                if (block?.typeId !== "minecraft:air") {
                    // Found a non-air block, early exit
                    return false;
                }
            }
        }
    }
    
    // All surrounding blocks are air
    return true;
}



/**
 * Returns true if a player is in air. (Refactored Paradox Anticheat Code)
 * @param {Minecraft.Player} player - The player to check.
 * @returns {boolean} True if the player is in air, false otherwise.
 */
export function inAir(player) {
    // Validate the input
    if (!player.isPlayer()) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    const { x, y, z } = player.location;
    const dimension = player.dimension;

    // Check for blocks below the player within a 1.8 block radius
    for (let dy = -1.8; dy <= 0; dy += 0.1) {
        const block = dimension.getBlock({ x, y: y + dy, z });

        // If a non-air block is found, the player is not in air
        if (block.typeId !== "minecraft:air") {
            return false;
        }
    }

    // If no non-air blocks are found below the player, they are in air
    return true;
}



// Initialize a Map to store the starting Y position of a fall for each player
const playerFallData = new Map();

/**
 * Calculates the fall distance of a player from the start of the fall.
 * @param {Minecraft.Player} player - The player to calculate the fall distance for.
 * @returns {number} The fall distance of the player (0 if not falling or on ground).
 */
export function calculateFallDistance(player) {

    const currentY = player.location.y;
    const isOnGround = player.isOnGround;
    const isFalling = player.isFalling;
    let fallDistance = 0;

    if (isOnGround) {
        // Reset fall tracking when the player lands
        playerFallData.delete(player);
        return fallDistance; // No fall distance if on the ground
    }

    if (isFalling) {
        // Check if we already have a recorded fall start position
        if (!playerFallData.has(player)) {
            // Mark the current position as the start of the fall
            playerFallData.set(player, currentY);
        }
        // Calculate fall distance from the start Y position
        const startY = playerFallData.get(player);
        fallDistance = startY - currentY;
    } else {
        // If the player is not falling, reset the fall start position
        playerFallData.delete(player);
    }

    return fallDistance;
}



// Initialize a Map to store the starting Y position
const playerFlyData = new Map();

/**
 * Calculates the distance of upward motion from the start of the levitation.
 * @param {Minecraft.Player} player - The player to calculate the upward motion for.
 * @returns {number} The distance of upward motion of the player (0 if falling or on ground).
 */
export function calculateUpwardMotion(player) {

    const currentY = player.location.y;
    const isOnGround = player.isOnGround;
    const isFalling = player.isFalling;
    let upwardMotion = 0;

    if (isOnGround) {
        // Reset fly tracking when the player lands
        playerFlyData.delete(player);
        return upwardMotion; // No fly distance if on the ground
    }

    if (!isFalling) {
        // Check if we already have a recorded flight start position
        if (!playerFlyData.has(player)) {
            // Mark the current position as the start of the flight
            playerFlyData.set(player, currentY);
        }
        // Calculate fly distance from the start Y position
        const startY = playerFlyData.get(player);
        upwardMotion = currentY - startY;
    } else {
        // If the player is falling, reset the fly start position
        playerFlyData.delete(player);
    }

    return upwardMotion;
}



/**
 * Sends debug information to players with a specific tag.
 * @param {Minecraft.Player} player - The player running the debug function.
 * @param {string} name - The type of information being debugged.
 * @param {string | number | object} debugInfo - The debug information.
 * @param {string} tag - The tag that players need to have to receive the debug information.
 * @throws {TypeError} If player is not an object, name or tag is not a string, or debugInfo is not a string, number, or object.
 * @example debug(player, "Speed", speed, "debug"); // Sends the player's speed to players with the "debug" tag.
 * @remarks Requires the player to have the specified tag to receive the debug information.
 */
export function debug(player, name, debugInfo, tag) {
    // Validate the input
    if (!player.isPlayer()) throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    if (typeof name !== 'string') throw new TypeError(`Error: name is type of ${typeof name}. Expected "string".`);
    if (typeof tag !== 'string') throw new TypeError(`Error: tag is type of ${typeof tag}. Expected "string".`);
    if (typeof debugInfo !== 'string' && typeof debugInfo !== 'number' && typeof debugInfo !== 'object') throw new TypeError(`Error: debugInfo is type of ${typeof debugInfo}. Expected "string", "number", or "object".`);
    
    const themecolor = config.themecolor;

    // Convert debugInfo to a string if it is an object
    const debugInfoStr = typeof debugInfo === 'object' ? JSON.stringify(debugInfo) : debugInfo;

    // Send the debug information to players with the specified tag
    try {
        tellStaff(`§r${themecolor}Debug §j> ${name}: §8${debugInfoStr}`, tag);
    } catch (error) {
        console.error(`Error: Failed to send debug information. ${error.message}`);
    }
}