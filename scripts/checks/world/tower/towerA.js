import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastBlock = new Map();

/**
 * Checks for not looking at the placed block.
 * @name tower_a
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 */
export function tower_a(player, block) {

    const preset = config.preset?.toLowerCase();
    if(preset === "stable") return;

    if (config.modules.towerA.enabled) {

        if (!player.isJumping || block.typeId === "minecraft:scaffolding") return;

        const rotation = player.getRotation();

        if (lastBlock.has(player.name)) {

            const last = lastBlock.get(player.name);
            
            const upwards = block.location.y > last.y;
            const sameXZblock = block.location.x === last.x && block.location.z === last.z;

            if (upwards && sameXZblock && rotation.x < 65) {
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