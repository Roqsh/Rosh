import config from "./data/config.js";
import data from "./data/data.js";
import { world } from "@minecraft/server";


/**
 * @name banAnimation
 * @param {import("@minecraft/server").Player} player - The player where the animation gets executed
 * @param {number} type - The type of the animation
 * @example banAnimation(rqosh, 2)
 * @remarks Executes an animation when getting banned default
*/

export async function banAnimation(player, type) {

    const banMessages = {
      "type1": {
        particle: "huge_explosion_emitter"
      },
      "type2": {
        particle: "totem_particle"
      }
    };
  
    const banMessage = banMessages[type];
  
    player.runCommandAsync(`particle minecraft:${banMessage.particle} ~ ~ ~`);   
}


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
 
    // remove characters that may break commands, and newlines
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
    
    //Purple Theme - Default
    player.runCommandAsync(`tellraw @a[tag=notify,tag=debug,tag=!blue,tag=!red] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §jfailed §u${check}§j/§u${checkType.toUpperCase()}§j - {${debugName}=${debug}, V=${currentVl}}"}]}`);
    player.runCommandAsync(`tellraw @a[tag=notify,tag=!debug,tag=!blue,tag=!red] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §jfailed §u${check}§j/§u${checkType.toUpperCase()}§j - {V=${currentVl}}"}]}`);
    //Blue Theme
    player.runCommandAsync(`tellraw @a[tag=notify,tag=debug,tag=blue,tag=!red] {"rawtext":[{"text":"§r§9Rosh §j> §8${player.nameTag} §jfailed §9${check}§j/§9${checkType.toUpperCase()}§j - {${debugName}=${debug}, V=${currentVl}}"}]}`);
    player.runCommandAsync(`tellraw @a[tag=notify,tag=!debug,tag=blue,tag=!red] {"rawtext":[{"text":"§r§9Rosh §j> §8${player.nameTag} §jfailed §9${check}§j/§9${checkType.toUpperCase()}§j - {V=${currentVl}}"}]}`);
    //Red Theme
    player.runCommandAsync(`tellraw @a[tag=notify,tag=debug,tag=red,tag=!blue] {"rawtext":[{"text":"§r§cRosh §j> §8${player.nameTag} §jfailed §c${check}§j/§c${checkType.toUpperCase()}§j - {${debugName}=${debug}, V=${currentVl}}"}]}`);
    player.runCommandAsync(`tellraw @a[tag=notify,tag=!debug,tag=red,tag=!blue] {"rawtext":[{"text":"§r§cRosh §j> §8${player.nameTag} §jfailed §c${check}§j/§c${checkType.toUpperCase()}§j - {V=${currentVl}}"}]}`);
    

    if(typeof slot === "number") {
		const container = player.getComponent("inventory").container;
		container.setItem(slot, undefined);
	}

    const checkData = config.modules[check.toLowerCase() + checkType.toUpperCase()];
    if(!checkData) throw Error(`No valid check data found for ${check}/${checkType}.`);

    const kickvl = getScore(player, "kickvl", 0);
    
    if(!checkData.enabled) throw Error(`${check}/${checkType} was flagged but the module was disabled.`);


    const message = `§8${player.name} §jwas flagged for §u${check}§j/§u${checkType}§j ${currentVl}x`;  
    data.recentLogs.push(message);
    

    
    const punishment = checkData.punishment?.toLowerCase();
    if(typeof punishment !== "string") throw TypeError(`Error: punishment is type of ${typeof punishment}. Expected "string"`);


    if(punishment === "none" || punishment === "") return;

    
    if(config.fancy_kick_calculation.on) {

        const movement_vl = getScore(player, "motionvl", 0) + getScore(player, "flyvl", 0) + getScore(player, "speedvl", 0) + getScore(player, "strafevl", 0) + getScore(player, "noslowvl", 0) + getScore(player, "invalidsprintvl", 0);
        const combat_vl = getScore(player, "reachvl", 0) + getScore(player, "killauravl", 0) + getScore(player, "autoclickervl", 0) + getScore(player, "hitboxvl", 0);
        const world_vl = getScore(player, "scaffoldvl", 0) + getScore(player, "nukervl", 0) + getScore(player, "towervl", 0);
        const misc_vl = getScore(player, "badpacketsvl", 0) + getScore(player, "crashervl", 0) + getScore(player, "spammervl", 0) + getScore(player, "autototemvl", 0) + getScore(player, "autoshieldvl", 0) + getScore(player, "illegalitemvl", 0);

        if(movement_vl > config.fancy_kick_calculation.movement && combat_vl > config.fancy_kick_calculation.combat && world_vl > config.fancy_kick_calculation.block && misc_vl > config.fancy_kick_calculation.other) {
            player.addTag("strict");
            console.warn(`§r§uRosh §j> §8${player.name} §chas been kicked for §u${check}§j/§u${checkType} §c!`);
            const message = `§8${player.name} §chas been kicked!`;
            data.recentLogs.push(message)           
            
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §chas been kicked for §u${check}§j/§u${checkType} §c!"}]}`);
            player.runCommandAsync(`kick "${player.name}" §r§uRosh §j> §cKicked for §u${check} §c!`);
        }
    }

    if(currentVl > checkData.minVlbeforePunishment) {

        if(punishment === "kick") {

            let banLength2;

            try {

                setScore(player, "kickvl", kickvl + 1);
              
                if(kickvl > config.kicksBeforeBan) {

                    if(getScore(player, "autoban", 0) > 0) {
                        player.addTag("isBanned");
                        player.addTag(`§uReason: Cheat Detection`);
                        banLength2 = parseTime("30d");
                        player.addTag(`§9Length: ${Date.now() + banLength2}`);
                        console.warn(`Rosh > ${player.name} has been banned for ${check}/${checkType}`);

                        const message = `§8${player.name} §chas been banned!`;   
                        data.recentLogs.push(message)
                    }

                    setScore(player, "kickvl", 0);

                }

                else {

                    player.runCommandAsync("function tools/resetwarns");
                    player.addTag("strict");
                    console.warn(`Rosh > ${player.name} has been kicked for ${check}/${checkType}`);

                    const message = `§8${player.name} §chas been kicked!`;    
                    data.recentLogs.push(message)                              
                    player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §chas been kicked for §u${check}§j/§u${checkType.toUpperCase()} §c!"}]}`);
                    player.runCommandAsync(`kick "${player.name}" §r§uRosh §j> §cKicked for §u${check} §c!`);

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
                console.warn(`Rosh > ${player.name} has been banned for ${check}/${checkType}`);

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
                player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §chas been banned for §u${check}§j/§u${checkType.toUpperCase()} §c!"}]}`);
                                
            }

        }

        if (punishment === "mute") {

            player.addTag("isMuted");
            player.sendMessage(`§r§uRosh §j> §cYou have been muted!`);
            player.runCommandAsync("ability @s mute true");

            const message = `§8${player.name} §chas been muted!`;    
            data.recentLogs.push(message)
            player.runCommandAsync(`tellraw @a[tag=notify,tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §chas been muted for §u${check}§j/§u${checkType.toUpperCase()} §c!"}]}`);

        }

        if (punishment === "crash") {

            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §chas been crashed for §u${check}§j/§u${checkType.toUpperCase()} §c!"}]}`); 

        }
    }

}


/**
 * @name crashPlayer
 * @param {import("@minecraft/server").Player} player - The player who will get crashed
 * @example crashPlayer(rqosh);
 * @remarks Sends a lot of garbage to the player untill he crashes (unused)
*/

export function crashPlayer(player) {

    for(let i = 0; i < 5; i++) {
        player.runCommandAsync(`particle minecraft:villager_angry ~ ~1 ~`);     
    }
}


/**
 * @name banMessage
 * @param {import("@minecraft/server").Player} player - The player object
 * @example banMessage(rqosh);
 * @remarks Bans the player from the game.
*/

export function banMessage(player) {

    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);

    if(config.flagWhitelist.includes(player.name) && player.hasTag("op")) return;

    if(data.unbanQueue.includes(player.name.toLowerCase().split(" ")[0])) {

        player.removeTag("isBanned");
        player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §ahas been found in the unban queue and has been unbanned !"}]}`);

        player.getTags().forEach(t => {
            if(t.includes("reason:") || t.includes("by:") || t.includes("time:")) player.removeTag(t);
        });

        for (let i = -1; i < data.unbanQueue.length; i++) {
            if(data.unbanQueue[i] !== player.name.toLowerCase().split(" ")[0]) continue;
            data.unbanQueue.splice(i, 1);
            break;
        }

        return;

    }

    let reason;
    let time;

    player.getTags().forEach(t => {
        if(t.includes("§uReason:")) reason = t.slice(7);
            else if(t.includes("§9Length")) time = t.slice(5);
    });

    if(time) {
        if(time < Date.now()) {
            player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name}'s §aban has expired and has now been unbanned !"}]}`);
            player.removeTag("isBanned");
            player.getTags().forEach(t => {
                if(t.includes("§uReason:") || t.includes("§9Length")) player.removeTag(t);
            });
            return;
        }
        
        time = msToTime(Number(time));
        time = `${time.w} weeks, ${time.d} days, ${time.h} hours, ${time.m} minutes, ${time.s} seconds`;
    } 

    player.triggerEvent("scythe:kick");
}


/**
 * @name parseTime
 * @param {string} str - The time value to convert to milliseconds
 * @example parseTime("24d"); // returns 2073600000
 * @remarks Parses a time string into milliseconds.
 * @returns {number | null} str - The converted string
*/

export function parseTime(str) {

    if(typeof str !== "string") throw TypeError(`Error: str is type of ${typeof str}. Expected "string"`);

    const time = str.match(/^(\d+)([smhdwy])$/);

    if(time) {
        const [, num, unit] = time;
        const ms = {
            s: 1000,
            m: 60000,
            h: 3600000,
            d: 86400000,
            w: 604800000,
            y: 31536000000
        }[unit];
        return ms * Number(num);
    }
    return time;
}


/**
 * @name msToTime
 * @param {number} ms - The string to convert
 * @example str(88200000); // Returns { d: 1, h: 0, m: 30, s: 0 }
 * @remarks Convert milliseconds to seconds, minutes, hours, days and weeks
 * @returns {object} str - The converted string
*/

export function msToTime(ms) {
    
    if(typeof ms !== "number") throw TypeError(`Error: ms is type of ${typeof ms}. Expected "number"`);

    const now = Date.now();
    if(ms > now) ms = ms - now;

    const w = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
    const d = Math.floor((ms % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);

    return {
        w: w,
        d: d,
        h: h,
        m: m,
        s: s
    };
}


/**
 * @name getScore
 * @param {import("@minecraft/server").Entity} player - The player to get the scoreboard value from
 * @param {string} objectiveName - The player to get the scoreboard value from
 * @param {number} [value] - Default value to return if unable to get scoreboard score
 * @example getScore(player, "cbevl", 0)
 * @remarks Gets the scoreboard objective value for a player
 * @returns {number} score - The scoreboard objective value
*/

export function getScore(player, objectiveName, value) {
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof objectiveName !== "string") throw TypeError(`Error: objective is type of ${typeof objectiveName}. Expected "string"`);
    if(typeof value !== "number") throw TypeError(`Error: defaultValue is type of ${typeof value}. Expected "number"`);

    try {
       return world.scoreboard.getObjective(objectiveName)?.getScore(player) ?? value;
    } catch {
        return value;
    }
}


/**
 * @name setScore
 * @param {import("@minecraft/server").Entity} player - The player to set the score for
 * @param {string} objectiveName - The scoreboard objective
 * @param {number} value - The new value of the scoreboard objective
 * @example setScore(player, "cbevl", 0)
 * @remarks Sets the scoreboard objective value for a player
*/

export function setScore(player, objectiveName, value) {
    if(typeof player !== "object") throw TypeError(`Error: player is type of ${typeof player}. Expected "object"`);
    if(typeof objectiveName !== "string") throw TypeError(`Error: objective is type of ${typeof objectiveName}. Expected "string"`);
    if(typeof value !== "number") throw TypeError(`Error: value is type of ${typeof value}. Expected "number"`);

    const obj = world.scoreboard.getObjective(objectiveName);
    if(!obj) player.runCommandAsync(`/scoreboard objectives add ${objectiveName} dummy`);
    
    world.scoreboard.getObjective(objectiveName).setScore(player, value);
}


/**
 * @name uppercaseFirstLetter
 * @param {string} string - The string to modify
 * @remarks Uppercase the first string
 * @returns {string} string - The updated string
*/

export function uppercaseFirstLetter(string) {
	return string[0].toUpperCase() + string.slice(1);
}


/**
 * @name lowercaseFirstLetter
 * @param {string} string - The string to modify
 * @remarks Lowercase the first string
 * @returns {string} string - The updated string
*/

export function lowercaseFirstLetter(string) {
	return string[0].toLowerCase() + string.slice(1);
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