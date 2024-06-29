import config from "./data/config.js";
import data from "./data/data.js";
import { world } from "@minecraft/server";
import { resetWarns } from "./commands/staff/resetwarns.js";

/**
 * Alerts staff if a player fails a check.
 * @param {object} player - The player object.
 * @param {string} check - The name of the check that was failed.
 * @param {string} checkType - The type of sub-check that was failed.
 * @param {string | undefined} [debugName] - The name of the debug value.
 * @param {string | number | object | undefined} [debug] - Debug information.
 * @param {boolean} [shouldTP=false] - Whether to teleport the player to their last good position.
 * @param {object | undefined} [cancelObject] - Object with property "cancel" to cancel the event.
 * @remarks Dependend on handler functions such as resetWarns, handlePunishment etc.
 * @example 
 * flag(player, "Spammer", "B", "Combat", undefined, undefined, undefined, msg, undefined);
 */
export function flag(player, check, checkType, debugName, debug, shouldTP = false, cancelObject) {
    // Input validation
    if (typeof player !== "object") throw new TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if (typeof check !== "string") throw new TypeError(`Error: check is type of ${typeof check}. Expected "string"`);
    if (typeof checkType !== "string") throw new TypeError(`Error: checkType is type of ${typeof checkType}. Expected "string"`);
    if (typeof debugName !== "string" && typeof debugName !== "undefined") throw new TypeError(`Error: debugName is type of ${typeof debugName}. Expected "string" or "undefined"`);
    if (typeof debug !== "string" && typeof debug !== "number" && typeof debug !== "object" && typeof debug !== "undefined") throw new TypeError(`Error: debug is type of ${typeof debug}. Expected "string", "number", "object", or "undefined"`);
    if (typeof shouldTP !== "boolean") throw new TypeError(`Error: shouldTP is type of ${typeof shouldTP}. Expected "boolean"`);
    if (typeof cancelObject !== "object" && typeof cancelObject !== "undefined") throw new TypeError(`Error: cancelObject is type of ${typeof cancelObject}. Expected "object" or "undefined"`);

    // Exclude staff or whitelisted players if configured
    if ((config.exclude_staff && player.hasTag("op")) || config.flagWhitelist.includes(player.name)) return;

    // Sanitize and limit debug information
    debug = String(debug).replace(/"|\\|\n/gm, "");
    if (debug.length > 256) {
        const extraLength = debug.length - 256;
        debug = debug.slice(0, 256) + `(+${extraLength} additional characters)`;
    }

    // Teleport player if needed
    const rotation = player.getRotation();
    if (shouldTP && config.silent === false) {
        player.teleport(check === "Crasher" ? {x: 30000000, y: 30000000, z: 30000000} : player.lastGoodPosition, {
            dimension: player.dimension,
            rotation: {x: rotation.x, y: rotation.y},
            keepVelocity: true
        });
    }

    // Cancel the event if requested
    if (cancelObject) cancelObject.cancel = true;

    // Handle scoreboard for the check
    const scoreboardObjective = check === "CommandBlockExploit" ? "cbevl" : `${check.toLowerCase()}vl`;
    if (!world.scoreboard.getObjective(scoreboardObjective)) {
        world.scoreboard.addObjective(scoreboardObjective, scoreboardObjective);
    }

    let currentVl = getScore(player, scoreboardObjective, 0);

    // Increment the violation level
    setScore(player, scoreboardObjective, currentVl + 1);
    currentVl++;

    // Log to console if enabled
    if (config.console_debug) {
        console.warn(`Rosh > ${player.nameTag} failed ${check}/${checkType.toUpperCase()} - {${debugName}=${debug}, V=${currentVl}}`);
    }

    // Notify staff in-game
    const themecolor = config.themecolor;
    player.runCommandAsync(`tellraw @a[tag=notify,tag=debug] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {${debugName}=${debug}, §8${currentVl}x§j}"}]}`);
    player.runCommandAsync(`tellraw @a[tag=notify,tag=!debug] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {§8${currentVl}x§j}"}]}`);

    // Log the flag to the UI log section
    const logMessage = config.logSettings.showDebug 
        ? `§8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType} §j- {${debugName}=${debug}, §8${currentVl}x§j}`
        : `§8${player.name} §jfailed ${themecolor}${check}§j/${themecolor}${checkType} §j- {§8${currentVl}x§j}`;
    data.recentLogs.push(logMessage);

    // Get check data
    const checkData = config.modules[`${check.toLowerCase()}${checkType.toUpperCase()}`];
    if (!checkData) throw new Error(`No valid check data found for ${check}/${checkType}.`);

    // Ensure the check is enabled
    if (!checkData.enabled) throw new Error(`${check}/${checkType} was flagged but the module was disabled.`);

    // Handle punishment based on the check's configuration
    const punishment = checkData.punishment?.toLowerCase();
    if (typeof punishment !== "string") throw new TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);
    if (punishment === "none" || currentVl < checkData.minVlbeforePunishment) return;

    // Calculate scores for fancy kick logic
    const kickvl = getScore(player, "kickvl", 0);
    if (config.fancy_kick_calculation.on) {
        const movement_vl = getScore(player, "motionvl", 0) + getScore(player, "flyvl", 0) + getScore(player, "speedvl", 0) + getScore(player, "strafevl", 0) + getScore(player, "noslowvl", 0) + getScore(player, "invalidjumpvl", 0) + getScore(player, "invalidsprintvl", 0);
        const combat_vl = getScore(player, "reachvl", 0) + getScore(player, "killauravl", 0) + getScore(player, "autoclickervl", 0) + getScore(player, "hitboxvl", 0);
        const world_vl = getScore(player, "scaffoldvl", 0) + getScore(player, "nukervl", 0) + getScore(player, "towervl", 0);
        const misc_vl = getScore(player, "badpacketsvl", 0) + getScore(player, "badenchantsvl", 0) + getScore(player, "crashervl", 0) + getScore(player, "spammervl", 0) + getScore(player, "timervl", 0) + getScore(player, "autototemvl", 0) + getScore(player, "autoshieldvl", 0) + getScore(player, "illegalitemsvl", 0);

        if (
            movement_vl > config.fancy_kick_calculation.movement &&
            combat_vl > config.fancy_kick_calculation.combat &&
            world_vl > config.fancy_kick_calculation.world &&
            misc_vl > config.fancy_kick_calculation.misc
        ) {
            handlePunishment("kick", player, check, checkType, themecolor);
            return;
        }
    }

    // Handle punishments using a switch statement
    handlePunishment(punishment, player, check, checkType, themecolor, kickvl, "30d");
}

/**
 * Handles various types of punishments.
 * @param {string} punishment - The type of punishment (e.g., "kick", "ban", "mute").
 * @param {object} player - The player to be punished.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 * @param {number} [kickvl] - The current kick violation level.
 * @param {string} [punishmentLength="30d"] - The length of the punishment for bans.
 */
function handlePunishment(punishment, player, check, checkType, themecolor, kickvl, punishmentLength = "30d") {
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
        default:
            console.warn(`Unhandled punishment type: ${punishment}`);
            break;
    }
}

/**
 * Handles kick punishment logic.
 * @param {object} player - The player to be kicked.
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
            const message = `§8${player.name} §chas been kicked!`;
            data.recentLogs.push(message);

            player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been kicked for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!"}]}`);
            if (config.console_debug) console.warn(`Rosh > ${player.name} has been kicked for ${check}/${checkType}`);

            resetWarns(player);

            player.runCommandAsync(`kick "${player.name}" §r${themecolor}Rosh §j> §cKicked for ${themecolor}${check} §c!`);
        }
    } catch (error) {
        // Fallback in case of an error
        player.triggerEvent("scythe:kick");
        console.error(error, error.stack);
    }
}

/**
 * Handles ban punishment logic.
 * @param {object} player - The player to be banned.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 * @param {string} [punishmentLength="30d"] - The length of the ban.
 */
function handleBanPunishment(player, check, checkType, themecolor, punishmentLength = "30d") {
    try {
        if (config.autoban) {
            // Tag the player as banned and remove existing ban related tags
            player.addTag("isBanned");
            player.getTags().forEach(tag => {
                if (tag.includes("Reason:") || tag.includes("Length:")) player.removeTag(tag);
            });

            // Add the default reason message
            player.addTag(`Reason:Cheat Detection`);

            // Calculate the ban length based on the provided punishment length
            let banLength;
            try {
                banLength = parseTime(punishmentLength);
                player.addTag(`Length:${Date.now() + banLength}`);
            } catch (error) {
                console.error(`Error parsing ban length: ${error.message}`);
            }

            // Notify about the ban
            const message = `§8${player.name} §chas been banned!`;
            data.recentLogs.push(message);

            player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been banned for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!"}]}`);
            if (config.console_debug) console.warn(`Rosh > ${player.name} has been banned for ${check}/${checkType}`);

            resetWarns(player);
        }
    } catch (error) {
        // Fallback in case of an error
        player.triggerEvent("scythe:kick");
        console.error(`${new Date().toISOString()} | ${error}${error.stack}`);
    }
}

/**
 * Handles mute punishment logic.
 * @param {object} player - The player to be muted.
 * @param {string} check - The name of the check.
 * @param {string} checkType - The type of sub-check.
 * @param {string} themecolor - The theme color for messages.
 */
function handleMutePunishment(player, check, checkType, themecolor) {
    // If the player is already muted, dont send the mute message again
    if (!player.hasTag("isMuted")) {
        // Notify the muted player about the mute
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou have been muted!`);
    }

    // Tag the player as muted and enable mute ability
    player.addTag("isMuted");
    player.runCommandAsync("ability @s mute true");

    // Notify about the mute
    const message = `§8${player.name} §chas been muted!`;
    data.recentLogs.push(message);

    player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been muted for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!"}]}`);
    if (config.console_debug) console.warn(`Rosh > ${player.name} has been muted for ${check}/${checkType}`);
    
    resetWarns(player);
}



/**
 * Bans a player from the game.
 * @name ban
 * @param {import("@minecraft/server").Player} player - The player object
 * @example ban(rqosh);
 * @throws {TypeError} If player is not an object
 */
export function ban(player) {
    // Validate that the input is an object
    if (typeof player !== "object" || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    }

    // If the player is in the whitelist, do nothing
    if (config.flagWhitelist.includes(player.name)) return;

    const themecolor = config.themecolor;

    // Define messages for unbanning scenarios
    const unbanQueueMessage = `§r${themecolor}Rosh §j> §8${player.name} §ahas been found in the unban queue and has been unbanned!`;
    const expiredBanMessage = `§r${themecolor}Rosh §j> §8${player.name}'s §aban has expired and has now been unbanned!`;

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
        data.unbanQueue = data.unbanQueue.filter(name => name !== playerName);
        return;
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
            player.removeTag("isBanned");

            player.getTags().forEach(tag => {
                if (tag.includes("Reason:") || tag.includes("Length:")) player.removeTag(tag);
            });

            return;
        }

        // Calculate the remaining ban time
        const remainingTime = msToTime(banEndTime - currentTime);
        time = `§nYou have §8${remainingTime.weeks} §nweeks, §8${remainingTime.days} §ndays, §8${remainingTime.hours} §nhours, §8${remainingTime.minutes} §nminutes and §8${remainingTime.seconds} §nseconds left!`;
    }

    // Default values if reason or time is not provided
    let banReason;
    if (reason) {
        banReason = ` for §8${reason}§c!`;
    } else {
        banReason = "!";
    }
    const banLength = time || "§nYour punishment is §8Permanent§n!";    
    
    // Kick the player with the ban message
    player.runCommandAsync(`kick "${player.name}" §r${themecolor}Rosh §j> §cYou have been banned${banReason}\n§r\n ${banLength}`);
}



/**
 * Executes an animation on the player.
 * @name animation
 * @param {import("@minecraft/server").Player} player - The player where the animation gets executed
 * @param {number} type - The type of the animation
 * @example animation(rqosh, 2); // Executes the totem particle animation
 * @throws {TypeError} If player is not an object or type is not a number
 */
export async function animation(player, type) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
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

    // Execute the animation
    try {
        await player.runCommandAsync(`particle minecraft:${animation} ~ ~ ~`);
    } catch (error) {
        console.error(`Error: Failed to execute animation for player. ${error.message}`);
    }
}



/**
 * Parses a time string into milliseconds.
 * @name parseTime
 * @param {string} str - The time value to convert to milliseconds
 * @example parseTime("24d"); // returns 2073600000
 * @returns {number | null} The converted time in milliseconds, or null if the input is invalid
 * @throws {TypeError} If the input is not a string
 */
export function parseTime(str) {
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
 * @name msToTime
 * @param {number} [milliseconds=0] - The number of milliseconds to convert
 * @returns {Object} An object containing the converted time in weeks, days, hours, minutes, and seconds
 * @throws {TypeError} Throws if the input is not a number or is negative
 * @example msToTime(88200000); // Returns { weeks: 0, days: 1, hours: 0, minutes: 30, seconds: 0 }
 */
export function msToTime(milliseconds = 0) {
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
 * Gets the scoreboard objective value for a player.
 * @name getScore
 * @param {import("@minecraft/server").Entity} player - The player to get the scoreboard value from
 * @param {string} objectiveName - The name of the scoreboard objective
 * @param {number} [defaultValue=0] - Default value to return if unable to get scoreboard score
 * @example getScore(player, "delay", 1); // Gets the scoreboard objective value for the player, returns 1 if unable to get scoreboard score
 * @remarks Returns default value if unable to get score
 * @returns {number} score - The scoreboard objective value
 * @throws {TypeError} If player is not an object, objectiveName is not a string, or defaultValue is not a number
 */
export function getScore(player, objectiveName, defaultValue = 0) {
    // Check if the player is an object
    if (typeof player !== 'object' || player === null) {
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
 * @name setScore
 * @param {import("@minecraft/server").Entity} player - The player to set the score for
 * @param {string} objectiveName - The scoreboard objective
 * @param {number} value - The new value of the scoreboard objective
 * @example setScore(player, "delay", 2); // Sets the scoreboard objective "delay" to 2
 * @throws {TypeError} If player is not an object, objectiveName is not a string, or value is not a number
 */
export function setScore(player, objectiveName, value) {
    // Check if the player is an object
    if (typeof player !== 'object' || player === null) {
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
 * Capitalizes the first letter of the given string.
 * @name uppercaseFirstLetter
 * @param {string} string - The string to modify
 * @returns {string} The updated string with the first letter capitalized
 * @example uppercaseFirstLetter('hello'); // returns 'Hello'
 * @example uppercaseFirstLetter(''); // returns ''
 * @example uppercaseFirstLetter(123); // returns 123
 * @remarks Gives back the original input if it is not a string/or length = 0
 */
export function uppercaseFirstLetter(string) {
    // Check if the input is a string or is an empty string
    if (typeof string !== 'string' || string.length === 0) {
        return string;
    }

    const [first, ...rest] = string;
    return `${first.toUpperCase()}${rest.join('')}`;
}



/**
 * Lowercases the first letter of the given string.
 * @name lowercaseFirstLetter
 * @param {string} string - The string to modify
 * @returns {string} The updated string with the first letter lowercased
 * @example lowercaseFirstLetter('Hello'); // returns 'hello'
 * @example lowercaseFirstLetter(''); // returns ''
 * @example lowercaseFirstLetter(123); // returns 123
 * @remarks Gives back the original input if it is not a string/or length = 0
 */
export function lowercaseFirstLetter(string) {
    // Check if the input is a string or is an empty string
    if (typeof string !== 'string' || string.length === 0) {
        return string;
    }

	const [first, ...rest] = string;
    return `${first.toLowerCase()}${rest.join('')}`;
}



/**
 * @name angleCalc
 * @param {import("@minecraft/server").Player} player - The Player to calculate the angle on
 * @param {import("@minecraft/server").Entity} entity - The Entity to calculate the angle to
 * @returns {number} - The angle between the player and the entity in degrees
*/
export function angleCalc(player, entity) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    if (typeof entity !== "object") {
        throw new TypeError(`Error: entity is of type ${typeof entity}. Expected "object".`);
    }

    // Get positions of player and entity
    const playerPos = player.location;
    const entityPos = entity.location;

    // Calculate differences in x and z coordinates
    const deltaX = entityPos.x - playerPos.x;
    const deltaZ = entityPos.z - playerPos.z;

    // Calculate the angle in radians between the player and entity
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
 * Find every possible coordinate between two sets of Vector3.
 * @name getBlocksBetween
 * @param {object} pos1 - First set of coordinates {x: number, y: number, z: number}
 * @param {object} pos2 - Second set of coordinates {x: number, y: number, z: number}
 * @returns {Array<object>} coordinates - Each possible coordinate within the given ranges [{x: number, y: number, z: number}]
 * @remarks If the input is not a number it will return an empty array
 */
export function getBlocksBetween({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    // Validate inputs
    if (
        typeof x1 !== 'number' || typeof y1 !== 'number' || typeof z1 !== 'number' ||
        typeof x2 !== 'number' || typeof y2 !== 'number' || typeof z2 !== 'number'
    ) {
        return [];
    }

    // Ensure min and max coordinates are correctly assigned
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);

    const coordinates = [];

    // Iterating z innermost can be beneficial for cache locality
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                coordinates.push({ x, y, z });
            }
        }
    }

    return coordinates;
}



/**
 * Finds the nearest player to a given entity.
 * @name getClosestPlayer
 * @param {object} entity - The entity to check.
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
 * Finds a player object by a player name.
 * @name findPlayerByName
 * @param {string} name - The player to look for
 * @returns {import("@minecraft/server").Player | null} - The player object, or null if not found
 * @throws {TypeError} If name is not a string
 */
export function findPlayerByName(name) {
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
 * Adds the "op" tag to a player, making them an operator.
 * @name addOp
 * @param {import("@minecraft/server").Player} player - The player to add the "op" tag to.
 * @param {import("@minecraft/server").Player} initiator - The player who initiated the action.
 * @example addOp(player, initiator); // Adds the "op" tag to the player
 * @throws {TypeError} If player or initiator is not an object.
 */
export function addOp(player, initiator) {
    // Validate the inputs
    if (typeof player !== 'object' || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }
    if (typeof initiator !== 'object' || initiator === null) {
        throw new TypeError(`Error: initiator is type of ${typeof initiator}. Expected "object".`);
    }

    try {
        // Check if the player already has the "op" tag before adding it
        if (!player.hasTag("op")) {
            // Add the "op" tag to the player
            player.addTag("op");
            const message = `Player ${player.name} has been given operator status by ${initiator.name}.`;
            console.log(message);
            player.sendMessage(`§r${themecolor}Rosh §j> §8You have been given operator status by ${initiator.name}.`);
            tellStaff(`§r§uRosh §j> §8${initiator.name} §ahas given §8${player.name} §aRosh-Op status.`);
        } else {
            initiator.sendMessage(`§r${themecolor}Rosh §j> §8${player.name} §calready has Rosh operator status!`);
        }
    } catch (error) {
        console.error(`Error: Failed to add "op" tag to player. ${error.message}`);
    }
}



/**
 * Removes the "op" tag from a player, revoking their operator status.
 * @name removeOp
 * @param {import("@minecraft/server").Player} player - The player to remove the "op" tag from.
 * @param {import("@minecraft/server").Player} initiator - The player who initiated the action.
 * @example removeOp(player, initiator); // Removes the "op" tag from the player
 * @throws {TypeError} If player or initiator is not an object.
 */
export function removeOp(player, initiator) {
    // Validate the inputs
    if (typeof player !== 'object' || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }
    if (typeof initiator !== 'object' || initiator === null) {
        throw new TypeError(`Error: initiator is type of ${typeof initiator}. Expected "object".`);
    }

    try {
        // Check if the player has the "op" tag before attempting to remove it
        if (player.hasTag("op")) {
            // Remove the "op" tag from the player
            player.removeTag("op");
            const message = `Player ${player.name} has been revoked operator status by ${initiator.name}.`;
            console.log(message);
            player.sendMessage(`§r${themecolor}Rosh §j> §8Your operator status has been revoked by ${initiator.name}.`);
            tellStaff(`§r§uRosh §j> §8${initiator.name} §chas removed §8${player.name}'s §cRosh-Op status.`);
        } else {
            initiator.sendMessage(`§r${themecolor}Rosh §j> §8${player.name} §cdoesnt have Rosh operator status!`);
        }
    } catch (error) {
        console.error(`Error: Failed to remove "op" tag from player. ${error.message}`);
    }
}



/**
 * Sends a message to all players with specified tags (Rosh-Op).
 * @name tellStaff
 * @param {string} message - The message to send.
 * @param {Array<string>} [tags=["op"]] - The tags that players must have to receive the message.
 * @throws {TypeError} If message is not a string or tags is not an array of strings.
 */
export function tellStaff(message, tags = ["op"]) {
    // Validate the input
    if (typeof message !== "string") {
        throw new TypeError(`Error: message is type of ${typeof message}. Expected "string".`);
    }

    if (!Array.isArray(tags) || !tags.every(tag => typeof tag === "string")) {
        throw new TypeError(`Error: tags is type of ${typeof tags}. Expected "array of strings".`);
    }

    // Get all players with the specified tags
    const players = world.getPlayers({ tags });

    // Send the message to each player
    for (const player of players) {
        player.sendMessage(message);
    }
}



/**
 * Sends a message to a specific player.
 * @name tellPlayer
 * @param {import("@minecraft/server").Player} player - The player that should receive the message.
 * @param {string} message - The message the player will be told.
 * @throws {TypeError} If player is not an object or message is not a string.
 */
export function tellPlayer(player, message) {
    // Validate the input
    if (typeof player !== "object" || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    if (typeof message !== "string") {
        throw new TypeError(`Error: message is type of ${typeof message}. Expected "string".`);
    }

    // Send the message to the player
    try {
        player.runCommandAsync(`tellraw "${player.name}" {"rawtext":[{"text":"${message}"}]}`);
    } catch (error) {
        console.error(`Error: Failed to send message to player. ${error.message}`);
    }
}



/**
 * Gets a player's horizontal speed.
 * @name getSpeed
 * @param {import("@minecraft/server").Player} player - The player to get the speed from.
 * @returns {number} The horizontal speed of the player.
 * @throws {TypeError} If player is not an object.
 */
export function getSpeed(player) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
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
 * Gets a player's total speed.
 * @name getTotalSpeed
 * @param {import("@minecraft/server").Player} player - The player to get the speed from.
 * @returns {number} The total speed of the player.
 * @throws {TypeError} If player is not an object.
 */
export function getTotalSpeed(player) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
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
 * @name hVelocity
 * @param {import("@minecraft/server").Player} player - The player to get the velocity from.
 * @returns {number} The horizontal velocity of the player.
 * @throws {TypeError} If player is not an object.
 * @example
 * const velocity = hVelocity(player);
 * console.log(`Player's horizontal velocity: ${velocity}`);
 */
export function hVelocity(player) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
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
 * @name aroundAir - Returns true if a player is surrounded by air
 * @param {object} player - The player that you are checking
 * @example if(aroundAir(player)) flag(player, "Movement", "A")
 * @remarks Flags for Movement/A if a player is surrounded by air
 */
export function aroundAir(player) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
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
                if (block.typeId !== "minecraft:air") {
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
 * @name inAir - Returns true if a player is in air (Paradox Anticheat Code)
 * @param {object} player - The player that you are checking
 * @example if(inAir(player)) flag(player, "Movement', "A")
 * @remarks Flags for Movement/A if a player is in air
 */
export function inAir(player) {
    // Check if player is an object
    if (typeof player !== 'object' || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    // Get player's location and dimension
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



/**
 * Plays a sound for a player.
 * @name setSound
 * @param {object} player - The player running the sound function. This should be an object with a `runCommandAsync` method.
 * @param {string} id - The id of the played sound. This should be a non-empty string.
 * @returns {Promise<void>} - A promise that resolves if the command is successful, and rejects with an error message if not.
 * @throws {TypeError} - Throws if the player object is invalid or if the id is not a string.
 * @example
 * setSound(player, "mob.goat.death.screamer")
 *   .then(() => console.log("Sound played successfully"))
 *   .catch(error => console.error("Failed to play sound:", error));
 */
export async function setSound(player, id) {
    // Validate the input
    if (typeof player !== 'object' || typeof player.runCommandAsync !== 'function') {
        throw new TypeError("Invalid player object. It must have a runCommandAsync method.");
    }

    if (typeof id !== 'string' || id.trim() === '') {
        throw new TypeError("Invalid id. It must be a non-empty string.");
    }

    // Play the requested sound
    try {
        await player.runCommandAsync(`playsound ${id} @s`);
    } catch (error) {
        throw new Error(`Failed to play sound: ${error.message}`);
    }
}



/**
 * Sends debug information to players with a specific tag.
 * @name debug
 * @param {import("@minecraft/server").Player} player - The player running the debug function.
 * @param {string} name - The type of information being debugged.
 * @param {string | number | object} debugInfo - The debug information.
 * @param {string} tag - The tag that players need to have to receive the debug information.
 * @throws {TypeError} If player is not an object, name or tag is not a string, or debugInfo is not a string, number, or object.
 * @example debug(player, "Speed", speed, "debug"); // Sends the player's speed to players with the "debug" tag.
 * @remarks Requires the player to have the specified tag to receive the debug information.
 */
export function debug(player, name, debugInfo, tag) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    if (typeof name !== 'string') {
        throw new TypeError(`Error: name is type of ${typeof name}. Expected "string".`);
    }

    if (typeof tag !== 'string') {
        throw new TypeError(`Error: tag is type of ${typeof tag}. Expected "string".`);
    }

    if (typeof debugInfo !== 'string' && typeof debugInfo !== 'number' && typeof debugInfo !== 'object') {
        throw new TypeError(`Error: debugInfo is type of ${typeof debugInfo}. Expected "string", "number", or "object".`);
    }

    const themecolor = config.themecolor;

    // Convert debugInfo to a string if it is an object
    const debugInfoStr = typeof debugInfo === 'object' ? JSON.stringify(debugInfo) : debugInfo;

    // Send the debug information to players with the specified tag
    try {
        player.runCommandAsync(`tellraw @s[tag=op, tag=${tag}] {"rawtext":[{"text":"§r${themecolor}Debug §j> ${name}: §8${debugInfoStr}"}]}`);
    } catch (error) {
        console.error(`Error: Failed to send debug information. ${error.message}`);
    }
}