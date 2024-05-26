import config from "../../../data/config.js";
import { flag, getScore, setScore, angleCalc } from "../../../util";

/**
 * @name killaura_f
 * @param {player} player - The player to check
 * @param {entity} entity - The bot
 * @remarks Checks for unlegit accuracy [Beta]
*/

export function killaura_f(player, entity) {

    if(config.modules.killauraF.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(angleCalc(player, entity) < 1) {
            setScore(player, "killauraF_buffer", getScore(player, "killauraF_buffer", 0) + 1);
        }

        setScore(player, "killauraF_reset", getScore(player, "killauraF_reset", 0) + 1);

        if(getScore(player, "killauraF_reset", 0) > 30) {
            
            setScore(player, "killauraF_reset", 0);

            if(getScore(player, "killauraF_buffer", 0) > 10) {
                
                flag(player, "Killaura", "F", "accuracy", getScore(player, "killauraF_buffer", 0), false);	
                setScore(player, "killauraF_buffer", 0);
            }
            
            setScore(player, "killauraF_buffer", 0);
        }
    }  
}