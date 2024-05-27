import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name badpackets_g
 * @param {player} player - The player to check
 * @remarks Checks for 
*/

export function badpackets_g(player) {

    if(config.modules.badpacketsG.enabled) {
        return;    
    }
}