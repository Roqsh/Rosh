import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a players rotation exceeds the vanilla rotation limit.
 * @name badpackets_a
 * @param {player} player - The player to check
 * @remarks The comparison operator >= has been changed to > as 
 * teleportation could be used to false the check
*/
export function badpackets_a(player) {

    if (!config.modules.badpacketsA.enabled) return;

    const rotation = player.getRotation();

    if (
        Math.abs(rotation.x) > 90 || 
        Math.abs(rotation.y) > 180
    ) {
        flag(player, "BadPackets", "A", "xRot", `${rotation.x},yRot=${rotation.y}`);
    }
}