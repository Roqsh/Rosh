import config from "../../../data/config.js";
import { flag, getScore } from "../../../util";

/**
 * Checks for sending too many packets at once.
 * @name badpackets_i
 * @param {player} player - The player to check
 * @remarks 
 */
export function badpackets_i(player) {

    if (!config.modules.badpacketsI.enabled) return;

    const packets = getScore(player, "packets", 0);

    if (packets > config.modules.badpacketsI.packets) {
        flag(player, "BadPackets", "I", "packets", packets, true);
    }
}