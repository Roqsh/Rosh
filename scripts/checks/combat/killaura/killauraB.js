import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name killaura_b
 * @param {player} player - The player to check
 * @param {entity} entity - The attacked entity
 * @remarks Checks for no-swing [Beta]
*/

export function killaura_b(player) {

	if(config.modules.killauraB.enabled) {

		const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

		if(Date.now() - player.firstAttack >= config.modules.killauraB.delay) {

			if(!player.hasTag("left")) {
				flag(player, "Killaura", "B", "noswing", "true");
			}
		}
	}
}