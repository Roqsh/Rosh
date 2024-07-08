import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if the length of a message is valid.
 * @name badpackets_e
 * @param {player} player - The player to check
 * @remarks This check is currently not needed as it 
 * got patched out entirely from Mojang.
 */
export function badpackets_e(player, message, msg) {

    if (config.modules.badpacketsE.enabled) return;
    
    if (
        message.length > 512 ||
        message.length < 1
    ) {
        flag(player, "BadPackets", "E", "message-length", `${message.length}`);
        msg.cancel = true;
    }
}