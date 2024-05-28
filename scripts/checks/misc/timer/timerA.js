import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

/**
 * @name timer_a
 * @param {player} player - The player to check
 * @remarks Checks for timer (acting with slower/faster tick speed)
*/

const timerData = new Map();

export function timer_a(player, lastPosition, Value){
    
    if(player.lastPosition && config.modules.timerA.enabled && !player.hasTag("placing")) {

        const velocity = player.getVelocity();
        const calcVelocity = {
            x: player.location.x - lastPosition.x, 
            y: player.location.y - lastPosition.y, 
            z: player.location.z - lastPosition.z
        };

        const ServerSpeed = Math.hypot(Math.hypot(calcVelocity.x, calcVelocity.z), calcVelocity.y);
        const ClientSpeed = Math.hypot(Math.hypot(velocity.x, velocity.z), velocity.y);

        const duped = ServerSpeed / ClientSpeed;

        if(player.timerHold == null) player.timerHold = [];

        player.timerHold.push(duped * 20 / Value);
        
        if(player.timerHold.length >= 20){

            let timer = 0;
            
            for(const currentTH of player.timerHold){
                timer += currentTH;
            }
          
            debug(player, "Timer", `${timer / player.timerHold.length} V:${Value}`, "timer-debug");
               
            if(timerData.has(player.name)) {

                let timer_lev = config.modules.timerA.timer_level;
                let timer_lev_low = config.modules.timerA.timer_level_low;

                if(config.modules.timerA.strict && player.hasTag("strict")) {
                    timer_lev--;
                    timer_lev_low++;
                }

                if(timerData.get(player.name)?.t > timer_lev && (timer / player.timerHold.length) > timer_lev || timerData.get(player.name)?.t < timer_lev_low && (timer / player.timerHold.length) < timer_lev_low) {
                   
                    if(Math.abs(player.lastPosition.y - player.location.y) > 5) {
                        timerData.set(player.name, {t: 20});
                        player.addTag("timer_bypass");
                    }

                    if(!player.hasTag("timer_bypass") && !player.hasTag("ender_pearl")) {
                        flag(player, "Timer", "A", "timer", timerData.get(player.name)?.t);
                    }
                }
            }

            if(!player.hasTag("timer_bypass")) {
                timerData.set(player.name, {t: timer / player.timerHold.length});
            }
            player.timerHold.splice(0);
        }
    }
    player.lastPosition = player.location;
}