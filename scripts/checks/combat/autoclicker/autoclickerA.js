import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastCPS = new Map();

/**
 * @param {Minecraft.Player} player - The player to check.
 */
export function autoclicker_a(player) {

	if (config.modules.autoclickerA.enabled) {
		if (player.getCps() > config.modules.autoclickerA.cps) flag(player, "AutoClicker", "A", "cps", player.getCps());
	}

	if (lastCPS.has(player.name)) {

        if (config.modules.autoclickerB.enabled) {
			if (Math.abs(player.getCps() - lastCPS.get(player.name)?.b) < config.modules.autoclickerB.diff && player.getCps() > 12) flag(player, "AutoClicker", "B", "cps", `${player.getCps()},diff=${Math.abs(player.getCps() - lastCPS.get(player.name)?.b)}`);
		}

        if (config.modules.autoclickerC.enabled) {
			if (player.getCps() > 8 && (Number.isInteger(Math.abs(player.getCps() - lastCPS.get(player.name)?.b)))) flag(player, "AutoClicker", "C", "flat-diff", Math.abs(player.getCps() - lastCPS.get(player.name)?.b));              
        }
	}

	if (config.modules.autoclickerC.enabled) {
		if (player.getCps() > 8 && (Number.isInteger(player.getCps()))) flag(player, "AutoClicker", "C", "flat-cps", player.getCps());
	}
		
	lastCPS.set(player.name, {
		b: player.getCps()
	});
}