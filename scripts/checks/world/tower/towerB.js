import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

/**
 * @name tower_b
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 * @remarks Checks for too short delays between towering up [Beta]
*/

const lastTime = new Map();

export function tower_b(player, block) {

    if(config.modules.towerB.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(!player.isJumping || player.isFlying || player.isInWater) return;

        let min_delay = config.modules.towerB.delay;

        if(player.getEffect("jump_boost")) min_delay -= 300;

        if(lastTime.has(player.name)) {

            const last = lastTime.get(player.name);
            
            const delay = Date.now() - last.time;
            const upwards = block.location.y > last.y;
            const sameXZblock = block.location.x === last.x && block.location.z === last.z;
            const sameXZplayer = player.location.x === block.location.x && player.location.z === block.location.z;
            const below = block.location.y < player.location.y

            debug(player, "Delay", delay, "delay");

            if(upwards && sameXZblock && sameXZplayer && below && delay < min_delay) {
                flag(player, "Tower", "B", "delay", delay);
            }
        }

        lastTime.set(player.name, {
            time: Date.now(),
            x: block.location.x,  
            y: block.location.y,
            z: block.location.z 
        });
    } 
}