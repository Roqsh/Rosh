import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name badpackets_c
 * @param {player} player - The player to check
 * @param {entity} entity - The entity that got hit
 * @remarks Checks for hitting yourself [Beta]
*/

export function badpackets_c(player, entity) {

	const preset = config.preset?.toLowerCase();
    if(preset === "stable") return;

	if(config.modules.badpacketsC.enabled && entity.typeId === player.typeId) {
		flag(player, "BadPackets", "C", "self-hit", "true");	
	}
}