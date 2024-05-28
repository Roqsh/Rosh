import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

//pretty much useless... 4urxra ??

export function motion_a(player) {

    if (config.modules.motionA.enabled) {

        if (!player.hasTag("ground")) return;

        if (player.getEffect("speed")) {

            if (player.getEffect("speed").amplifier > 5) return;
        }

        const speed = getSpeed(player);
        
        if (speed > config.modules.motionA.speed) {          
            flag(player, "Motion", "A", "speed", speed, true);  
        }
    }  
}