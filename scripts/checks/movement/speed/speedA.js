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

        if (player.isFlying || 
            player.isGliding ||
            player.hasTag("attacking")
        ) return;

        if(player.getEffect("speed")) {

            const maxSpeed = config.modules.speedA.speed;
            const speedEffectValue = player.getEffect("speed").amplifier;
    
            let modifiedSpeed = maxSpeed; 
            
            for(let i = 0; i < speedEffectValue; i++) {
                modifiedSpeed += 0.3; 
            }
    
            if(player.hasTag("riding")) {
                modifiedSpeed += 0.9;
            }

            if(playerSpeed > modifiedSpeed && !player.hasTag("damaged") && !player.isHoldingTrident && !player.isOnIce && !player.isOnSlime) {
                flag(player, "Speed", "A", "speed", playerSpeed, true);
            }
    
        } else {
        
            let maxSpeed2 = config.modules.speedA.speed;
            
            if(player.hasTag("riding")) {
                maxSpeed2 += 0.9;
            }
    
            if(!player.hasTag("strict")) {
                if(playerSpeed > maxSpeed2 + 0.1 && !player.hasTag("strict") && !player.hasTag("damaged") && !player.isFlying && !player.isHoldingTrident && !player.isOnIce && !player.isOnSlime) {
                    flag(player, "Speed", "A", "speed", playerSpeed, true);
                }
            
            } else {
                if(playerSpeed > maxSpeed2 && !player.hasTag("damaged") && !player.isFlying && !player.isHoldingTrident && !player.isOnIce && !player.isOnSlime) {
                    flag(player, "Speed", "A", "speed", playerSpeed, true);
                }
            }
        }
    } 
}