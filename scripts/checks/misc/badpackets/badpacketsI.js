import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name badpackets_i
 * @param {player} player - The player to check
 * @remarks Checks for impossible x/y rotations (higher than 90/180)
*/

export function badpackets_i(player) {

    if(config.modules.badpacketsI.enabled) {

        const rotation = player.getRotation();

        if(Math.abs(rotation.x) >= 90 || Math.abs(rotation.y) > 180) {
            flag(player, "BadPackets", "I", "xRot", `${rotation.x},yRot=${rotation.y}`);
        }
    }
}