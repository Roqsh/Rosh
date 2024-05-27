import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name killaura_e
 * @param {player} player - The player to check
 * @param {entity} entity - The bot
 * @remarks Checks for attacking the bot [Beta]
*/

export function killaura_e(player, entity) {

    if(config.modules.killauraE.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(entity.typeId === "rosh:killaura") {
            flag(player, "Killaura", "E", "attacks bot", "true");
        }        
    }
}


export function dependencies_e(player) {

    if(config.modules.killauraE.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        const tick = 200;

        if(getScore(player, "tick_counter", 0) > tick) {
            
            const x = Math.random() * 6 - 3;
            const y = Math.random() * 2; 
            const z = Math.random() * 6 - 3; 

            player.runCommandAsync(`summon rosh:killaura ~${x} ~${y} ~${z}`);

            setScore(player, "tick_counter", 0);
        }

        if(getScore(player, "tick_counter", 0) > 35) {
            player.runCommandAsync("kill @e[type=rosh:killaura]");
        }
    }
}