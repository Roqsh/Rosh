import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name tower_a
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 * @remarks Checks for getting pushed out of the tower due to BDS
*/

const lastBlock = new Map();

export function tower_a(player, block) {

    if(config.modules.towerA.enabled) {

        if(player.isOnGround || !player.isJumping || player.isFlying || player.isInWater || block.typeId === "minecraft:scaffolding") return;

        const rotation = player.getRotation();

        if(lastBlock.has(player.name)) {
            
            const upwards = block.location.y > lastBlock.get(player.name)?.y;
            const sameXZblock = block.location.x === lastBlock.get(player.name)?.x && block.location.z === lastBlock.get(player.name)?.z;
            const above = block.location.y > player.location.y;

            if(upwards && sameXZblock && above && rotation.x > 50) {
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