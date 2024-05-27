import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name scaffold_g
 * @param {player} player - The player to check
 * @remarks Checks for not triggering the 'itemUse' event [Beta]
*/

export function scaffold_g(player) {
   
    if(config.modules.scaffoldG.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
        
        if(!player.hasTag("itemUse") && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {        
            flag(player, "Scaffold", "G-Beta", "itemUse", "false");          
        }
    }
}