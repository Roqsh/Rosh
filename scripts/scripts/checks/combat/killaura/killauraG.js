import config from "../../../data/config.js";
import { flag, getScore } from "../../../util";

/**
 * @name killaura_g
 * @param {player} player - The player to check
 * @param {entity} entity - The attacked entity
 * @remarks Checks for attacking while using an item [Beta]
*/

export function killaura_g(player, entity) {

	if(config.modules.killauraG.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(!player.hasTag("right")) return;

        const rightTicks = getScore(player, "right", 0);

        if(rightTicks > config.modules.killauraG.rightTicks) {
            flag(player, "Killaura", "G", "ticks", rightTicks);
        }
    }
}