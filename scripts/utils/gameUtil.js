export function setTitle(player, title, subtitle) {
    player.runCommandAsync(`title "${player.name}" title ${title}`);
    player.runCommandAsync(`title "${player.name}" subtitle ${subtitle}`);
}


export function kickPlayer(player, reason) {
    player.runCommandAsync(`kick "${player.name}" ${reason}`);
}


export function setParticle(player, particleName) {
    player.runCommandAsync(`particle minecraft:${particleName} ~~~`);
}


export function getHealth(player) {
    const healthComponent = player.getComponent("minecraft:health");
    return healthComponent;
}




/**
 * @name aroundAir - Returns true if a player is surround by air
 * @param {object} player - The player that you are checking
 * @example if(aroundAir(player)) flag(player, "Movement', "A")
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
 * @name playerTellraw - Easy tellraw command
 * @param {object} player - The player you want to use the tellraw message on
 * @param {string} message - The message the player will be told
*/

export function playerTellraw(player, message) {
    player.runCommandAsync(`tellraw "${player.name}" {"rawtext":[{"text":"${message}"}]}`);
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