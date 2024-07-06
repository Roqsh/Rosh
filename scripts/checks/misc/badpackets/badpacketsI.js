import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a players rotation exceeds the vanilla rotation limit.
 * @name badpackets_i
 * @param {player} player - The player to check
 * @remarks 
*/
export function badpackets_i(player) {

    if (!config.modules.badpacketsI.enabled) return;

    const rotation = player.getRotation();

    if (Math.abs(rotation.x) >= 90 || Math.abs(rotation.y) > 180) {
        flag(player, "BadPackets", "I", "xRot", `${rotation.x},yRot=${rotation.y}`);
    }
}