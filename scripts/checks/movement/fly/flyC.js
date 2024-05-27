import config from "../../../data/config.js";
import { flag, getScore, aroundAir } from "../../../util";

/**
 * @name fly_c
 * @param {player} player - The player to check
 * @remarks Checks for ground spoof
*/

const data2 = new Map();

export function fly_c(player) {
  
    if(config.modules.flyC.enabled) {

        if(aroundAir(player) && getScore(player, "tick_counter2", 0) > 8 && data2.has(player.name) && !player.hasTag("elytra") && !player.isGliding) {

            const posDiff = Math.abs(player.location.x - data2.get(player.name).x) + Math.abs(player.location.z - data2.get(player.name).z);

            if((player.hasTag("ground") || player.isOnGround) && posDiff < 8 && posDiff !== 0 && !player.isJumping && !player.hasTag("damaged")) {
                flag(player, "Fly", "C", "onGround", ">spoof");
            }
        }
    }

    data2.set(player.name, {x: player.location.x, y: player.location.y, z: player.location.z})
}