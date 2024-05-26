import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name scaffold_h
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 * @remarks Checks for distance-placement paterns [Beta]
*/

const scaffold_h_map = new Map();

export function scaffold_h(player, block) {

    if(config.modules.scaffoldH.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(scaffold_h_map.has(player.name)) {

            const one = scaffold_h_map.get(player.name)?.one;
            const two = scaffold_h_map.get(player.name)?.two;
            const three = scaffold_h_map.get(player.name)?.three;
            const four = scaffold_h_map.get(player.name)?.four;
          
            if(one && two && three && four) {
                if(checkDistance(player, block, one, two, three, four)) {
                    flag(player, "Scaffold", "H", "distance_patern", "3");
                }
            }
        }
        
        scaffold_h_map.set(player.name, {
            one: { x: block.location.x, y: block.location.y, z: block.location.z },
            two: scaffold_h_map.get(player.name)?.one,
            three: scaffold_h_map.get(player.name)?.two,
            four: scaffold_h_map.get(player.name)?.three
        });
    }

    
    function checkDistance(player, block1, block2, block3, block4, block5) {
        const distances = [block1, block2, block3, block4, block5]
            .map(block => Math.hypot(block.x - player.location.x, block.z - player.location.z));

        const [distance5, distance4, distance3, distance2, distance1] = distances.sort((a, b) => a - b);

        return (
            distance5 > distance4 + 0.1 &&
            distance3 > distance4 &&
            distance3 < distance2 &&
            distance2 > distance1
        );
    }
}