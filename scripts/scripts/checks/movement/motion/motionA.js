import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

//pretty much useless... 4urxra ??

export function motion_a(player) {

    if(config.modules.motionA.enabled) {

        const playerSpeed = getSpeed(player);
        
        if(playerSpeed > config.modules.motionA.speed) {

            if(player.getEffect("speed").amplifier > 5) {
                return;
            }

            if(player.hasTag("ground")) {
                flag(player, "Motion", "A", "speed", playerSpeed, true);
            }
        }
    }  
}