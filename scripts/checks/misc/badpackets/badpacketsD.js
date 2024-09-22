import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastYRot = new Map();
const lastXRot = new Map();

/**
 * Checks for smooth yaw and pitch movements.
 * @name badpackets_d
 * @param {player} player - The player to check
 */
export function badpackets_d(player) {

    if (!config.modules.badpacketsD.enabled) return;

    if (player.isRiding()) return;

    const rotation = player.getRotation();

    if (lastYRot.has(player.name)) {
            
        const yDiff = Math.abs(rotation.y - lastYRot.get(player.name)?.y);

        if (!yDiff == 0 && Number.isInteger(yDiff)) {
            flag(player, "BadPackets", "D", "yawDiff", yDiff);
        }
    }

    if (lastXRot.has(player.name)) {
            
        const xDiff = Math.abs(rotation.x - lastXRot.get(player.name)?.x);

        if (!xDiff == 0 && Number.isInteger(xDiff)) {
            flag(player, "BadPackets", "D", "xDiff", xDiff);
        }
    }
      
    lastYRot.set(player.name, {
        y: rotation.y
    });

    lastXRot.set(player.name, {
        x: rotation.x
    });  
}