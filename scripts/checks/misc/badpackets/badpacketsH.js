import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name badpackets_h
 * @param {player} player - The player to check
 * @remarks Checks for flying without permission
*/

export function badpackets_h(player) {

    if(config.modules.badpacketsH.enabled) {
        
        if(player.isFlying && !player.hasTag("op") && !player.hasTag("gmc")) {
            flag(player, "BadPackets", "H", "isFlying", "true", true);
            player.runCommandAsync(`ability "${player.name}" mayfly false`);
        }
    }
}