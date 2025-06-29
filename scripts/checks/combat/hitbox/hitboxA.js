import config from "../../../data/config.js";
import { flag, getAngle, debug } from "../../../util";

/**
 * Checks for attacking with a too high angle.
 * @name hitbox_a
 * @param {player} player - The player to check
 * @param {entity} entity - The attacked entity
 * @remarks To reduce false flags when flicking it is recommended 
 * to set the angle to 55+ , The distance check is required to not 
 * false flag when walking through the entity with high speed.
 */
export function hitbox_a(player, entity) {

    if (!config.modules.hitboxA.enabled) return;

    const angle = getAngle(player, entity);
    const colour = angle >= 80 ? '§c' : (angle >= 30 ? '§n' : (angle >= 10 ? '§2' : '§a'));

    debug(player, "Angle", `${colour}${angle}°`, "angle");
    
    if (angle > config.modules.hitboxA.angle) {

        const distance = Math.sqrt(
            Math.pow(entity.location.x - player.location.x, 2) + 
            Math.pow(entity.location.y - player.location.y, 2) + 
            Math.pow(entity.location.z - player.location.z, 2)
        );

        if (distance > config.modules.hitboxA.distance) {
            flag(player, "Hitbox", "A", "angle", `${angle}°`);
        }   
    }
}