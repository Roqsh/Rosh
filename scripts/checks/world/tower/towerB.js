import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

const lastTime = new Map();

/**
 * Checks for too short delays between towering up. [Beta]
 * @name tower_b
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 * @remarks False flags if a player is dragging/butterflying/jittering etc two blocks beneath him while in air
 */
export function tower_b(player, block) {

    if (config.modules.towerB.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if (player.isFlying || 
            player.isInWater ||
            !player.isJumping
        ) return;

        let min_delay = config.modules.towerB.delay;

        if (player.getEffect("jump_boost")) min_delay -= 300;

        if (lastTime.has(player.name)) {
            
            const delay = Date.now() - lastTime.get(player.name)?.time;
            const upwards = block.location.y > lastTime.get(player.name)?.y;
            const sameXZblock = block.location.x === lastTime.get(player.name)?.x && block.location.z === lastTime.get(player.name)?.z;
            const below = block.location.y < player.location.y

            debug(player, "Delay", delay, "delay");

            if (upwards && sameXZblock && below && delay < min_delay) {
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