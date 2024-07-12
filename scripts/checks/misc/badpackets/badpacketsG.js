import config from "../../../data/config.js";
import { flag, getTotalSpeed } from "../../../util";

const lastPosition = new Map();

/**
 * Checks for movements without valid velocities.
 * @name badpackets_g
 * @param {player} player - The player to check
 * @remarks The getTotalSpeed function uses all three velocities to 
 * determine the players speed.
 */
export function badpackets_g(player) {

    if (!config.modules.badpacketsG.enabled) return;

    const velocity = player.getVelocity();
    const speed = getTotalSpeed(player);

    if (lastPosition.has(player.name)) {
            
        const position = player.location;

        const dx = Math.abs(position.x - lastPosition.get(player)?.x);
        const dy = Math.abs(position.y - lastPosition.get(player)?.y);
        const dz = Math.abs(position.z - lastPosition.get(player)?.z);

        if (
            speed === 0 &&
            (dx > 0.1 || dy > 0.1 || dz > 0.1)
        ) {
            flag(player, "BadPackets", "G", "vel", `${velocity},dx=${dx},dy=${dy},dz=${dz}`, true);
        }
    }

    lastPosition.set(player, {
        x: player.location.x, 
        y: player.location.y, 
        z: player.location.z
    });
}