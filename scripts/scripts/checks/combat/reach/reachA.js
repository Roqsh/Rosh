import config from "../../../data/config.js";
import { flag, getScore, setScore, getSpeed, debug } from "../../../util";
import { getDistanceY } from "../../../utils/mathUtil.js";

/**
 * @name reach_a
 * @param {player} player - The player to check
 * @param {entity} entity - The hit entity
 * @remarks Checks for invalid reach
*/

export function reach_a(player, entity) {

	if(config.modules.reachA.enabled) {
		
		if(failedTags(player)) return;

		setScore(player, "reach_a_reset", getScore(player, "reach_a_reset", 0) + 1);

		let xz_distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2));

		debug(player, "Distance", xz_distance, "reach-a");

		let y_distance = getDistanceY(player, entity);

		checkDistance(player, xz_distance, y_distance, entity);

		if(getScore(player, "reach_a_reset", 0) > 10) {
			if(getScore(player, "reach_a_buffer", 0) > config.modules.reachA.buffer) {
				flag(player, "Reach", "A", "distance", xz_distance, false);
			}
			setScore(player, "reach_a_buffer", 0);
			setScore(player, "reach_a_reset", 0);
		}
	}
}

function failedTags(player) {

	const tags = ["gmc", "trident", "bow"];

	for(const tag in tags) {
		if(player.hasTag(tag)) return true;
	} 

	return false;
}

function checkDistance(player, xy_distance, y_distance, entity) {

	let min_reach = config.modules.reachA.reach;

	if(config.modules.reachA.smartReach) {

		if(getSpeed(player) > 0.6) min_reach + 0.3;
		if(player.hasTag("damaged")) min_reach + 0.04;
		if(player.isSprinting) min_reach - 0.2;
		min_reach - y_distance / 10;
	}

	if(xy_distance > min_reach && !config.modules.reachA.entities_blacklist.includes(entity.typeId)) {
		setScore(player, "reach_a_buffer", getScore(player, "reach_a_buffer", 0) + 1);
	}
}