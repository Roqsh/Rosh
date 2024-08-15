import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name noslow_b
 * @param {player} player - The player to check
 * @remarks Checks for moving too fast while being in cobwebs
*/

const lastPos = new Map();

export function noslow_b(player) {

    if(!config.modules.noslowB.enabled || player.getGameMode() === "spectator" || player.isFlying) return;
    
    const playerLocation = player.location;
    const playerLastPos = lastPos.get(player.name) ?? player.location;
    const { x: velocityX, z: velocityZ } = player.getVelocity();

    const headWeb = player.dimension.getBlock({
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y) + 1,
        z: Math.floor(player.location.z)
    })?.typeId === "minecraft:web";

    const bodyWeb = player.dimension.getBlock({
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y),
        z: Math.floor(player.location.z)
    })?.typeId === "minecraft:web";

    if(!headWeb && !bodyWeb) {
        lastPos.set(player.name, playerLocation);
    }

    const playerSpeed = Math.hypot(velocityX, velocityZ);
    const limitIncrease = getSpeedIncrease(player.getEffect("speed"));

    if(headWeb === true || bodyWeb === true) {

        if(playerSpeed <= (0.45 + limitIncrease)) {
            lastPos.set(player.name, playerLocation);
        }

        else {

            if(!(player.lastExplosionTime && Date.now() - player.lastExplosionTime < 1000)) {
                flag(player, "NoSlow", "B", "speed", playerSpeed);
                if(!config.silent) {
                    player.teleport(playerLastPos, {
                        checkForBlocks: false,
                        dimension: player.dimension
                    });

                }
            }
        }
    }
}

function getSpeedIncrease(speedEffect) {
    if(speedEffect === undefined)
        return 0;
    return(speedEffect?.amplifier + 1) * 0.0476;
}