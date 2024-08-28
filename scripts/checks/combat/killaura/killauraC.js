import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for attacking multiple entities at once. (default 2, flags when going above 20cps)
 * @param {Minecraft.Player} player - The player to check.
 * @param {entity} entity - The attacked entity
 */
export function killaura_c(player, entity) {

	if (config.modules.killauraC.enabled) {

        if (!player.entitiesHit.includes(entity.id)) {

            player.entitiesHit.push(entity.id);

		    if (player.entitiesHit.length >= config.modules.killauraC.entities) {
			    flag(player, "Killaura", "C", "entitiesHit", `${player.entitiesHit.length}`);
		    }
        }
	}
}