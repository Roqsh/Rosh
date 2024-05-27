import config from "./data/config.js";
import data from "./data/data.js";
import { world } from "@minecraft/server";

/**
 * @name flag
 * @param {object} player - The player object
 * @param {string} check - What check ran the function.
 * @param {string} checkType - What sub-check ran the function (ex. a, b ,c).
 * @param {string | undefined} [debugName] - Name for the debug value.
 * @param {string | number | undefined} [debug] - Debug info.
 * @param {boolean} [shouldTP] - Whether to tp the player to itself.
 * @param {object | undefined} [cancelObject] - object with property "cancel" to cancel.
 * @param {number | undefined} [slot] - Slot to clear an item out.
 * @example flag(player, "Spammer", "B", "Combat", undefined, undefined, undefined, msg, undefined);
 * @remarks Alerts staff if a player fails a check.
 */

export function flag(player, check, checkType, debugName, debug, shouldTP = false, cancelObject, slot) {

    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof check !== "string") throw TypeError(`Error: check is type of ${typeof check}. Expected "string"`);
    if(typeof checkType !== "string") throw TypeError(`Error: checkType is type of ${typeof checkType}. Expected "string"`);
    if(typeof debugName !== "string" && typeof debugName !== "undefined") throw TypeError(`Error: debugName is type of ${typeof debugName}. Expected "string" or "undefined"`);
    if(typeof debug !== "string" && typeof debug !== "number" && typeof debug !== "undefined") throw TypeError(`Error: debug is type of ${typeof debug}. Expected "string", "number" or "undefined"`);
    if(typeof shouldTP !== "boolean") throw TypeError(`Error: shouldTP is type of ${typeof shouldTP}. Expected "boolean"`);
    if(typeof cancelObject !== "object" && typeof cancelObject !== "undefined") throw TypeError(`Error: cancelObject is type of ${typeof cancelObject}. Expected "object" or "undefined`);
    if(typeof slot !== "number" && typeof slot !== "undefined") throw TypeError(`Error: slot is type of ${typeof slot}. Expected "number" or "undefined`);

    if(config.disable_flags_from_rosh_op && player.hasTag("op")) return;

    const themecolor = config.themecolor;
 
    // remove characters that may break commands, and newlines crash
    debug = String(debug).replace(/"|\\|\n/gm, "");

    // malicious users may try make the debug field ridiculously large to lag any clients that may try to view the alert (anybody with the 'notify' tag)
    if(debug.length > 256) {
        const extraLength = debug.length - 256;
        debug = debug.slice(0, -extraLength) + `(+${extraLength} additional characters)`;
    }
    
    const rotation = player.getRotation();


    if(shouldTP && config.silent === false) player.teleport(check === "Crasher" ? {x: 30000000, y: 30000000, z: 30000000} : player.lastGoodPosition, {dimension: player.dimension, rotation: {x: rotation.x, y: rotation.y}, keepVelocity: false});

    if(cancelObject) cancelObject.cancel = true;
  

    const scoreboardObjective = check === "CommandBlockExploit" ? "cbevl" : `${check.toLowerCase()}vl`;
    if(!world.scoreboard.getObjective(scoreboardObjective)) {
        world.scoreboard.addObjective(scoreboardObjective, scoreboardObjective);
    }
    let currentVl = getScore(player, scoreboardObjective, 0);
    setScore(player, scoreboardObjective, currentVl + 1);
    currentVl++;

    if(config.console_debug) console.warn(`Rosh > ${player.nameTag} failed ${check}/${checkType.toUpperCase()} - {${debugName}=${debug}, V=${currentVl}}`);
    
    
    player.runCommandAsync(`tellraw @a[tag=notify,tag=debug] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {${debugName}=${debug}, V=${currentVl}}"}]}`);
    player.runCommandAsync(`tellraw @a[tag=notify,tag=!debug] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §jfailed ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()}§j - {V=${currentVl}}"}]}`);
      

    if(typeof slot === "number") {
		const container = player.getComponent("inventory").container;
		container.setItem(slot, undefined);
	}

    const checkData = config.modules[check.toLowerCase() + checkType.toUpperCase()];
    if(!checkData) throw Error(`No valid check data found for ${check}/${checkType}.`);

    const kickvl = getScore(player, "kickvl", 0);
    
    if(!checkData.enabled) throw Error(`${check}/${checkType} was flagged but the module was disabled.`);


    const message = `§8${player.name} §jwas flagged for ${themecolor}${check}§j/${themecolor}${checkType}§j ${currentVl}x`;  
    data.recentLogs.push(message);
    
    const punishment = checkData.punishment?.toLowerCase();

    if(typeof punishment !== "string") throw TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);

    if(punishment === "none" || punishment === "" || currentVl < checkData.minVlbeforePunishment) return;

    
    if(config.fancy_kick_calculation.on) {

        const movement_vl = getScore(player, "motionvl", 0) + getScore(player, "flyvl", 0) + getScore(player, "speedvl", 0) + getScore(player, "strafevl", 0) + getScore(player, "noslowvl", 0) + getScore(player, "invalidsprintvl", 0);
        const combat_vl = getScore(player, "reachvl", 0) + getScore(player, "killauravl", 0) + getScore(player, "autoclickervl", 0) + getScore(player, "hitboxvl", 0);
        const world_vl = getScore(player, "scaffoldvl", 0) + getScore(player, "nukervl", 0) + getScore(player, "towervl", 0);
        const misc_vl = getScore(player, "badpacketsvl", 0) + getScore(player, "crashervl", 0) + getScore(player, "spammervl", 0) + getScore(player, "autototemvl", 0) + getScore(player, "autoshieldvl", 0) + getScore(player, "illegalitemvl", 0);

        if(movement_vl > config.fancy_kick_calculation.movement && combat_vl > config.fancy_kick_calculation.combat && world_vl > config.fancy_kick_calculation.block && misc_vl > config.fancy_kick_calculation.other) {
            player.addTag("strict");
            console.warn(`§r${themecolor}Rosh §j> §8${player.name} §chas been kicked for ${themecolor}${check}§j/${themecolor}${checkType} §c!`);
            const message = `§8${player.name} §chas been kicked!`;
            data.recentLogs.push(message)           
            
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been kicked for ${themecolor}${check}§j/${themecolor}${checkType} §c!"}]}`);
            player.runCommandAsync(`kick "${player.name}" §r${themecolor}Rosh §j> §cKicked for ${themecolor}${check} §c!`);
        }
    }

    if(currentVl > checkData.minVlbeforePunishment) {

        if (punishment === "kick") {

            let banLength2;

            try {

                setScore(player, "kickvl", kickvl + 1);
              
                if(kickvl > config.kicksBeforeBan) {

                    if(getScore(player, "autoban", 0) > 0) {
                        player.addTag("isBanned");
                        player.addTag(`reason: Cheat Detection`);
                        banLength2 = parseTime("30d");
                        player.addTag(`Time: ${Date.now() + banLength2}`);
                        if(config.console_debug) console.warn(`Rosh > ${player.name} has been banned for ${check}/${checkType}`);

                        const message = `§8${player.name} §chas been banned!`;   
                        data.recentLogs.push(message)
                    }

                    setScore(player, "kickvl", 0);

                }

                else {

                    player.runCommandAsync("function tools/resetwarns");
                    player.addTag("strict");
                    if(config.console_debug) console.warn(`Rosh > ${player.name} has been kicked for ${check}/${checkType}`);

                    const message = `§8${player.name} §chas been kicked!`;    
                    data.recentLogs.push(message)                              
                    player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been kicked for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!"}]}`);
                    player.runCommandAsync(`kick "${player.name}" §r${themecolor}Rosh §j> §cKicked for ${themecolor}${check} §c!`);

                }

            } catch (error) {
                player.triggerEvent("scythe:kick");
                console.error(error, error.stack);
            }    

        };

        if (punishment === "ban") {

            if(getScore(player, "autoban", 0) > 0) {

                player.addTag("isBanned");
                const punishmentLength = checkData.punishmentLength?.toLowerCase();
                if(config.console_debug) console.warn(`Rosh > ${player.name} has been banned for ${check}/${checkType}`);

                player.getTags().forEach(t => {
                    if(t.includes("§uReason:") || t.includes("§9Length:")) player.removeTag(t);
                });

                let banLength;

                player.addTag(`§uReason: Cheat Detection`);
                try {
                    banLength = parseTime(punishmentLength);
                    player.addTag(`§9Length: ${Date.now() + banLength}`);
                } catch (error) {}
              
                const message = `§8${player.name} §chas been banned!`;   
                data.recentLogs.push(message)
                player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been banned for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!"}]}`);
                                
            }

        }

        if (punishment === "mute") {

            player.addTag("isMuted");
            player.sendMessage(`§r${themecolor}Rosh §j> §cYou have been muted!`);
            player.runCommandAsync("ability @s mute true");
            if(config.console_debug) console.warn(`Rosh > ${player.name} has been muted for ${check}/${checkType}`);

            const message = `§8${player.name} §chas been muted!`;    
            data.recentLogs.push(message)
            player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas been muted for ${themecolor}${check}§j/${themecolor}${checkType.toUpperCase()} §c!"}]}`);

        }
    }
}



/**
 * @name banMessage
 * @param {import("@minecraft/server").Player} player - The player object
 * @example banMessage(rqosh);
 * @remarks Bans the player from the game.
 */
export function banMessage(player) {
    if (typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);

    if (config.flagWhitelist.includes(player.name) && player.hasTag("op")) return;

    if (data.unbanQueue.includes(player.name.toLowerCase().split(" ")[0])) {
        player.removeTag("isBanned");
        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §ahas been found in the unban queue and has been unbanned !"}]}`);

        player.getTags().forEach(t => {
            if (t.includes("Reason:") || t.includes("Length")) player.removeTag(t);
        });

        for (let i = 0; i < data.unbanQueue.length; i++) {
            if (data.unbanQueue[i] !== player.name.toLowerCase().split(" ")[0]) continue;
            data.unbanQueue.splice(i, 1);
            break;
        }

        return;
    }

    let reason;
    let time;

    player.getTags().forEach(t => {
        if (t.includes("Reason:")) reason = t.slice(7);
        else if (t.includes("Length:")) time = t.slice(7);
    });

    if (time) {
        if (Number(time) < Date.now()) {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name}'s §aban has expired and has now been unbanned !"}]}`);
            player.removeTag("isBanned");
            player.getTags().forEach(t => {
                if (t.includes("Reason:") || t.includes("Length:")) player.removeTag(t);
            });
            return;
        }

        const remainingTime = msToTime(Number(time) - Date.now());
        time = `${remainingTime.weeks} weeks, ${remainingTime.days} days, ${remainingTime.hours} hours, ${remainingTime.minutes} minutes, ${remainingTime.seconds} seconds`;
    }

    player.runCommandAsync(`kick "${player.name}" §r${config.themecolor}Rosh §j> §cYou have been banned for §u${reason || "Cheat Detection"}§c!\n\n§r${time ? `§9Length §8- §9${time}` : ""}`);
}



/**
 * @name animation
 * @param {import("@minecraft/server").Player} player - The player where the animation gets executed
 * @param {number} type - The type of the animation
 * @example animation(rqosh, 2); // Executes the totem particle animation
 * @remarks Executes an animation on the player
 * @throws {TypeError} If player is not an object or type is not a number
 */
export async function animation(player, type) {
    // Validate the input
    if (typeof player !== 'object' || player === null) {
        throw new TypeError(`Error: player is type of ${typeof player}. Expected "object".`);
    }

    if (typeof type !== 'number') {
        throw new TypeError(`Error: type is type of ${typeof type}. Expected "number".`);
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
 * @name parseTime
 * @param {string} str - The time value to convert to milliseconds
 * @example parseTime("24d"); // returns 2073600000
 * @remarks Parses a time string into milliseconds.
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
    const remainingAfterWeeks = milliseconds % msPerWeek;

    const days = Math.floor(remainingAfterWeeks / msPerDay);
    const remainingAfterDays = remainingAfterWeeks % msPerDay;

    const hours = Math.floor(remainingAfterDays / msPerHour);
    const remainingAfterHours = remainingAfterDays % msPerHour;

    const minutes = Math.floor(remainingAfterHours / msPerMinute);
    const remainingAfterMinutes = remainingAfterHours % msPerMinute;

    const seconds = Math.floor(remainingAfterMinutes / msPerSecond);

    // Return the converted time as an object
    return { weeks, days, hours, minutes, seconds };
}



/**
 * @name getScore
 * @param {import("@minecraft/server").Entity} player - The player to get the scoreboard value from
 * @param {string} objectiveName - The name of the scoreboard objective
 * @param {number} [defaultValue=0] - Default value to return if unable to get scoreboard score
 * @example getScore(player, "delay", 1); // Gets the scoreboard objective value for the player, returns 1 if unable to get scoreboard score
 * @remarks Gets the scoreboard objective value for a player
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

        // Get the score for the player
        const score = objective.getScore(player);
        return typeof score === 'number' ? score : defaultValue;
    } catch (error) {
        console.error(`Error: Failed to get score for player. ${error.message}`);
        return defaultValue;
    }
}



/**
 * @name setScore
 * @param {import("@minecraft/server").Entity} player - The player to set the score for
 * @param {string} objectiveName - The scoreboard objective
 * @param {number} value - The new value of the scoreboard objective
 * @example setScore(player, "delay", 2); // Sets the scoreboard objective "delay" to 2
 * @remarks Sets the scoreboard objective value for a player
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
 * @name uppercaseFirstLetter
 * @param {string} string - The string to modify.
 * @returns {string} The updated string with the first letter capitalized, or the original input if it is not a string/or length = 0.
 * @example uppercaseFirstLetter('hello'); // returns 'Hello'
 * @example uppercaseFirstLetter(''); // returns ''
 * @example uppercaseFirstLetter(123); // returns 123
 * @remarks Capitalizes the first letter of the given string.
 */
export function uppercaseFirstLetter(string) {
    // Check if the input is a string
    if (typeof string !== 'string') {
        return string;
    }

    // Check if the input is an empty string
    if (string.length === 0) {
        return string;
    }

    const [first, ...rest] = string;
    return `${first.toUpperCase()}${rest.join('')}`;
}



/**
 * @name lowercaseFirstLetter
 * @param {string} string - The string to modify
 * @returns {string} The updated string with the first letter lowercased, or the original input if it is not a string/or length = 0.
 * @example lowercaseFirstLetter('Hello'); // returns 'hello'
 * @example lowercaseFirstLetter(''); // returns ''
 * @example lowercaseFirstLetter(123); // returns 123
 * @remarks Lowercases the first letter of the given string.
 */
export function lowercaseFirstLetter(string) {
    // Check if the input is a string
    if (typeof string !== 'string') {
        return string;
    }

    // Check if the input is an empty string
    if (string.length === 0) {
        return string;
    }

	const [first, ...rest] = string;
    return `${first.toLowerCase()}${rest.join('')}`;
}



/**
 * @name getBlocksBetween
 * @remarks Find every possible coordinate between two sets of Vector3
 * @param {object} pos1 - First set of coordinates
 * @param {object} pos2 - Second set of coordinates
 * @returns {Array} coordinates - Each possible coordinate
*/

export function getBlocksBetween(pos1, pos2) {
    const { x: minX, y: minY, z: minZ } = pos1;
    const { x: maxX, y: maxY, z: maxZ } = pos2;

    const coordinates = [];

    for(let x = minX; x <= maxX; x++) {
        for(let y = minY; y <= maxY; y++) {
            for(let z = minZ; z <= maxZ; z++) {
                coordinates.push({x, y, z});
            }
        }
    }

    return coordinates;
}



/**
 * @name tellStaff
 * @remarks Send a message to all Rosh-Opped players
 * @param {string} message - The message to send
 * @param {Array} tags - What tags should be sent the message
*/

export function tellStaff(message, tags = ["op"]) {
    for(const player of world.getPlayers({tags})) {
        player.sendMessage(message);
    }
}



/**
 * @name addOp
 * @remarks Add Rosh-Op status to a player
 * @param {import("@minecraft/server").Player} initiator - The player that initiated the request
 * @param {import("@minecraft/server").Player} player - The player that will be given Rosh-Op status
*/

export function addOp(initiator, player) {
    tellStaff(`§r§uRosh §j> §8${initiator.name} §ahas given §8${player.name} §aRosh-Op status.`);

    player.addTag("op");

    player.sendMessage("§r§uRosh §j> §aYou are now Rosh-Op.");
}



/**
 * @name removeOp
 * @remarks Remove Rosh-Op status from a player
 * @param {import("@minecraft/server").Player} initiator - The player that initiated the request
 * @param {import("@minecraft/server").Player} player - The player who will get his Rosh-Op status removed
*/

export function removeOp(initiator, player) {
    player.removeTag("op");

    tellStaff(`§r§uRosh §j> §8${initiator.name} §chas removed §8${player.name}'s §cRosh-Op status.`);

    player.sendMessage("§r§uRosh §j> §cYou are no longer Rosh-Op.");
}



/**
 * @name findPlayerByName
 * @remarks Finds a player object by a player name
 * @param {string} name - The player to look for
 * @returns {import("@minecraft/server").Player | undefined} [player] - The player found
*/

export function findPlayerByName(name) {
	const searchName = name.toLowerCase().replace(/\\|@/g, "");

    let player;

    for(const pl of world.getPlayers()) {
        const lowercaseName = pl.name.toLowerCase();
        if(searchName !== lowercaseName && !lowercaseName.includes(searchName)) continue;

		player = pl;
		break;
	}

	return player;
}



/**
 * @name getClosestPlayer
 * @param {object} entity - The entity to check
 * @example getClosestPlayer(entity);
 * @remarks Gets the nearest player to an entity.
 * @returns {object} player - The player that was found
*/

export function getClosestPlayer(entity) {

    if(typeof entity !== "object") return TypeError(`Error: entity is type of ${typeof entity}. Expected "object"`);

    const nearestPlayer = [...entity.dimension.getPlayers({
        closest: 1,
        location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
    })][0];

    return nearestPlayer;

}



/**
 * @name angleCalc
 * @param {import("@minecraft/server").Player} player - The Player to calculate the angle on
*/

export function angleCalc(player, entityHit) {
    const pos1 = { x: player.location.x, y: player.location.y, z: player.location.z };
    const pos2 = { x: entityHit.location.x, y: entityHit.location.y, z: entityHit.location.z };

    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;

    if (angle <= -180) angle += 360;
    angle = Math.abs(angle); 

    return angle;
}



/**
 * @name getSpeed
 * @param {import("@minecraft/server").Player} player - The Player to get the speed from
 * @remarks Gets a players speed
*/

export function getSpeed(player) {
    const velocity = player.getVelocity();
    const speed = Number(Math.sqrt(Math.abs(velocity.x**2 + velocity.z**2)));
    
    return speed;
}



/**
 * @name aroundAir - Returns true if a player is surround by air
 * @param {object} player - The player that you are checking
 * @example if(aroundAir(player)) flag(player, "Movement", "A")
 * @remarks Flags for Movement/A if a player is surrounded by air
*/

export function aroundAir(player) {
    let isSurroundedByAir = true;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
                if (block.typeId !== "minecraft:air") {
                    isSurroundedByAir = false;
                    break;
                }
            }
        }
    }
    return isSurroundedByAir
}



/**
 * @name inAir - Returns true if a player is in air (Paradox Anticheat Code)
 * @param {object} player - The player that you are checking
 * @example if(inAir(player)) flag(player, "Movement', "A")
 * @remarks Flags for Movement/A if a player is in air
*/

export function inAir(player) {
    let isInAir = true;
    for (let y = 0; y < 1.8; y += 0.1) {
        const block = player.dimension.getBlock({ x: player.location.x, y: player.location.y + y, z: player.location.z });
        if (block.typeId !== "minecraft:air") {
            isInAir = false;
            break;
        }
    }
    return isInAir;
}



/**
 * @name setSound - Plays a sound for a player
 * @param {object} player - The player running the sound function
 * @param {string} id - The id of the played sound
 * @example setSound(rqosh, "mob.goat.death.screamer");
 * @remarks Plays the specific sound to rqosh
*/

export function setSound(player, id) {
    player.runCommandAsync(`playsound ${id} @s`);
}



/**
 * @name debug - Debugs a certain value
 * @param {object} player - The player running the debug function
 * @param {string} name - What type of information is debugged
 * @param {number} debug - The debug information
 * @param {string} tag - What tag the player needs to have to recieve the debug
 * @example debug(rqosh, "Speed", speed, debug);
 * @remarks Debugs a player's speed if he has the debug tag
*/

export function debug(player, name, debug, tag) {
    player.runCommandAsync(`tellraw @s[tag=op, tag=${tag}] {"rawtext":[{"text":"§r§uDebug §j> ${name}: §8${debug}"}]}`);
}



/**
 * @name hVelocity
 * @param {import("@minecraft/server").Player} player - The Player to get the velocity from
 * @remarks Calculates a players horizontal velocity
*/

export function hVelocity(player) {
    return (player.getVelocity().x + player.getVelocity().z) / 2
}