import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastBlock = new Map();

/**
 * Checks for not looking at the place block.
 * @name tower_a
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 */
export function tower_a(player, block) {

    if (config.modules.towerA.enabled) {

        if (!player.isJumping || block.typeId === "minecraft:scaffolding") return;

        const rotation = player.getRotation();

        if (lastBlock.has(player.name)) {

            const last = lastBlock.get(player.name);
            
            const upwards = block.location.y > last.y;
            const sameXZblock = block.location.x === last.x && block.location.z === last.z;
            const sameXZplayer = player.location.x === block.location.x && player.location.z === block.location.z;

            if (upwards && sameXZblock && sameXZplayer && rotation.x < 65) {
                flag(player, "Tower", "A", "xRot", rotation.x);
            }
        }

        lastBlock.set(player.name, {
            x: block.location.x,  
            y: block.location.y,
            z: block.location.z 
        });
    } 
}