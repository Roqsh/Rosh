import config from "../../../data/config.js";
import { flag, angleCalc } from "../../../util";

/**
 * @name hitbox_a
 * @param {player} player - The player to check
 * @param {entity} entity - The attacked entity
 * @remarks Checks for attacking with a too high angle (behind you)
*/

export function hitbox_a(player, entity) {

    if(config.modules.hitboxA.enabled) {

        if(angleCalc(player, entity) > config.modules.hitboxA.angle) {

            const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));

            if(distance > 2.25) {
                flag(player, "Hitbox", "A", "angle", angleCalc(player, entity));
            }
        }
    }
}