import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * Checks for breaking too many blocks within a tick. (default set to 3)
 * @name nuker_a
 * @param {player} player - The player to check
 * @remarks Some Nuker cheats can lead to an error: command queue is full when they are extremely fast
 * (Therefore the check stops when it exceeds 8 blocks to reduce performance losses)
 */
export async function nuker_a(player, revertBlock) {

    if(config.modules.nukerA.enabled) {

		if(player.getGameMode() === "creative") return;

	    player.blocksBroken++;

		const blocks = player.blocksBroken;

		if(blocks > 6) return;

		if(blocks > config.modules.nukerA.maxBlocks) {

			revertBlock = true;
		        
            flag(player, "Nuker", "A", "blocks", blocks);
		}
	}
}