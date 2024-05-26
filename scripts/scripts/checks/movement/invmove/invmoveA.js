import config from "../../../data/config.js";
import { flag, getScore } from "../../../util";

/**
 * @name invmove_a
 * @param {player} player - The player to check
 * @remarks Checks for moving while having a GUI open [Beta]
*/

const lastXZ = new Map();

export function invmove_a(player) {
       
    if(config.modules.invmoveA.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(lastXZ.has(player.name) && player.hasTag("hasGUIopen") && getScore(player, "invmove_delay", 0) > config.modules.invmoveA.delay) {

            const sameXZ = lastXZ.get(player.name)?.x === player.location.x && lastXZ.get(player.name)?.z === player.location.z;

            if((player.hasTag("sneaking") || !sameXZ) && player.isOnGround && !player.isInWater && !player.isGliding && !player.hasTag("damaged")) {
                flag(player, "Invmove", "A", "moving", "true", true);
            }
        }

        lastXZ.set(player.name, {
            x: player.location.x,  
            z: player.location.z 
        });

        if(!player.hasTag("hasGUIopen")) {
            lastXZ.clear();
        }
    }    
}