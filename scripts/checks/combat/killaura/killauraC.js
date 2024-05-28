import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for attacking multiple entities at once (default 2, flags when going above 20cps)
 * @name killaura_c
 * @param {player} player - The player to check
 * @param {entity} entity - The attacked entity
 */
export function killaura_c(player, entity, entitiesHit) {

	if (config.modules.killauraC.enabled) {

        if (!entitiesHit.includes(entity.id)) {

            entitiesHit.push(entity.id);

		    if (entitiesHit.length >= config.modules.killauraC.entities) {
			    flag(player, "Killaura", "C", "entitiesHit", `${entitiesHit.length}`);
		    }
        }
	}
}