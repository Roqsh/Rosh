import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

/**
 * @name speed_a
 * @param {player} player - The player to check
 * @remarks Checks for moving too fast
*/

export function speed_a(player) {

    const playerSpeed = getSpeed(player);

    if(config.modules.speedA.enabled) {

        if(player.hasTag("gmc") || player.hasTag("attacking")) return;

        if(player.getEffect("speed")) {

            const maxSpeed = config.modules.speedA.speed;
            const speedEffectValue = player.getEffect("speed").amplifier;
    
            let modifiedSpeed = maxSpeed; 
            
            for(let i = 0; i < speedEffectValue; i++) {
                modifiedSpeed += 0.3; 
            }
    
            if(playerSpeed > modifiedSpeed && !player.hasTag("damaged") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
                flag(player, "Speed", "A", "speed", playerSpeed, true);
            }
    
        } else {
        
            if(!player.hasTag("strict")) {
                if(playerSpeed > config.modules.speedA.speed + 0.1 && !player.hasTag("strict") && !player.hasTag("damaged") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
                    flag(player, "Speed", "A", "speed", playerSpeed, true);
                }
            
            } else {
                if(playerSpeed > config.modules.speedA.speed && !player.hasTag("damaged") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
                    flag(player, "Speed", "A", "speed", playerSpeed, true);
                }
            }
        }
    } 
}