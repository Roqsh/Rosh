import config from "../../../data/config.js";
import { flag } from "../../../util.js";

/**
 * @name reach_b
 * @param {player} player - The player to check
 * @remarks Checks for placing too far away
*/

export function reach_b(player, block, undoPlace) {
	
	if(config.modules.reachB.enabled) {

		if(player.fallDistance > 1.3 || block.typeId === "minecraft:scaffolding") return;

		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));

		if(distance > config.modules.reachB.reach) {
			flag(player, "Reach", "B", "distance", distance);
			undoPlace = true;
		}
	}
}