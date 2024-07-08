import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for hitting yourself.
 * @name badpackets_c
 * @param {player} player - The player to check
 * @param {entity} entity - The entity that got hit
 */
export function badpackets_c(player, entity) {

    if (!config.modules.badpacketsC.enabled) return;

	if (entity?.id === player?.id) {
        flag(player, "BadPackets", "C", "hitEntity", "damagingEntity");
    }
}