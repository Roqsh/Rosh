import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * @name nuker_a
 * @param {player} player - The player to check
 * @remarks Checks for breaking more than the config amount per tick (default set to 3)
*/

export function nuker_a(player, block, revertBlock) {

    if(config.modules.nukerA.enabled) {

		player.blocksBroken++;

		if(player.blocksBroken > config.modules.nukerA.maxBlocks) {
			flag(player, "Nuker", "A", "amount", player.blocksBroken);
			revertBlock = true;	
		}
	}
}