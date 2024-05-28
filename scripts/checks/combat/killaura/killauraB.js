import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for attacking invalid entities or while using an item.
 * @name killaura_b
 * @param {player} player - The player to check
 * @param {entity} entity - The attacked entity
 */
export function killaura_b(player, entity) {

	if (config.modules.killauraB.enabled) {

		const Id = entity.typeId;
		const invalid = Id == "minecraft:xp_orb" || Id == "minecraft:xp_bottle" || Id == "minecraft:splash_potion" || Id == "minecraft:snowball"

        if (invalid) flag(player, "Killaura", "B", "invalid_entity", Id);

		if (player.hasTag("right")) flag(player, "Killaura", "B", "using", "item");
	}
}