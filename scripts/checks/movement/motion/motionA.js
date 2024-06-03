import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";



export function motion_a(player) {

    if (config.modules.motionA.enabled) {

        if (
            !player.isOnGround || 
            player.hasTag("trident") || 
            player.hasTag("elytra")
        ) return;

        if (player.getEffect("speed")) {

            if (player.getEffect("speed").amplifier > 5) return;
        }

        const speed = getSpeed(player);
        
        if (speed > config.modules.motionA.speed) {          
            flag(player, "Motion", "A", "speed", speed, true);  
        }
    }  
}