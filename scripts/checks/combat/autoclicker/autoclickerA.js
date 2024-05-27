import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

/**
 * @name autoclicker_a
 * @param {player} player - The player to check
 * @remarks Checks for too high cps (amount)
*/

const lastCPS = new Map();

export function autoclicker_a(player) {

    if(config.modules.autoclickerA.enabled) {
        
        if(player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.delay) {

			player.cps = player.cps / ((Date.now() - player.firstAttack) / config.modules.autoclickerA.delay);
			
			if(player.cps > config.modules.autoclickerA.cps) flag(player, "AutoClicker", "A", "cps", player.cps);

			if(lastCPS.has(player.name)) {
				if(Math.abs(player.cps - lastCPS.get(player.name)?.b) < config.modules.autoclickerB.diff && player.cps > 12) flag(player, "AutoClicker", "B", "cps", `${player.cps},diff=${Math.abs(player.cps - lastCPS.get(player.name)?.b)}`);
				if(player.cps > 8 && (Number.isInteger(Math.abs(player.cps - lastCPS.get(player.name)?.b)))) flag(player, "AutoClicker", "C", "flat-diff", Math.abs(player.cps - lastCPS.get(player.name)?.b));
			}

			if(player.cps > 8 && (Number.isInteger(player.cps))) flag(player, "AutoClicker", "C", "flat-cps", player.cps);

			debug(player, "Cps", player.cps, "cps");

			lastCPS.set(player.name, {b: player.cps});
			player.firstAttack = Date.now();
			player.cps = 0;
		}
    }
}