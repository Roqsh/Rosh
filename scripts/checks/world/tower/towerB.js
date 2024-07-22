import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

const lastTime = new Map();

/**
 * Checks for too short delays between towering up. [Beta]
 * @name tower_b
 * @param {player} player - The player to check.
 * @param {block} block - The placed block.
 */
export function tower_b(player, block) {

    if (!config.modules.towerB.enabled) return;

    const preset = config.preset?.toLowerCase();
    if(preset === "stable") return;

    if (
        player.isFlying ||
        player.isClimbing ||
        player.isInWater
    ) return;

    let min_delay = config.modules.towerB.delay;

    if (player.getEffect("jump_boost")) min_delay -= 300;

    if (lastTime.has(player.name)) {
            
        const delay = Date.now() - lastTime.get(player.name)?.time;
        const upwards = block.location.y > lastTime.get(player.name)?.y && player.location.y > lastTime.get(player.name)?.height;
        const sameXZblock = block.location.x === lastTime.get(player.name)?.x && block.location.z === lastTime.get(player.name)?.z;
        const below = block.location.y < player.location.y
        const sidesAreAir = block.north(1).isAir && block.east(1).isAir && block.south(1).isAir && block.west(1).isAir;

        debug(player, "Delay", delay, "delay");

        if (sidesAreAir && upwards && sameXZblock && below && delay < min_delay) {
            flag(player, "Tower", "B", "delay", delay);
        }
    }

    lastTime.set(player.name, {
        time: Date.now(),
        height: player.location.y,        
        x: block.location.x,  
        y: block.location.y,
        z: block.location.z 
    });
}