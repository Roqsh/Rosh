import config from "../../../data/config.js";
import { flag, getScore, aroundAir } from "../../../util";

/**
 * @name fly_d
 * @param {player} player - The player to check
 * @remarks Checks for non BDS based fly (Only use if ur server doesnt use BDS Prediction - Not a realm) [Beta]
*/

const data = new Map();

export function fly_d(player) {

    const preset = config.preset?.toLowerCase();
    if(preset === "stable") return;
    
    if(config.modules.flyD.enabled) {

        if(
            !player.isFlying && 
            !player.getGameMode() === "creative" && 
            !player.isOnGround && 
            !player.isJumping &&
            getScore(player, "airTime", 0) > 10 &&
            aroundAir(player) &&
            player.fallDistance < config.modules.flyD.dist &&
            !player.getEffect("jump_boost") &&
            !player.getEffect("levitation") &&
            !player.getEffect("slow_falling") &&
            getScore(player, "tick_counter2", 0) > 8 &&
            !player.hasTag("damaged")
        ) {
            flag(player, "Fly", "D", "fallDistance", player.fallDistance);
        }
            
    }
}