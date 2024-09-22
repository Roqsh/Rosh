import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name badpackets_f
 * @param {player} player - The player to check
 * @remarks Checks for flat x/y rotation (Horions scaffold is excluded for scaffoldB) [Beta]
 * prolly gets removed
 */
export function badpackets_f(player) {

    if (!config.modules.badpacketsF.enabled) return;

    const preset = config.preset?.toLowerCase();
    if(preset === "stable") return;

    if (player.isRiding()) return;
        
    const rotation = player.getRotation();

    if ((Number.isInteger(rotation.x) || Number.isInteger(rotation.y)) && rotation.x !== 0 && rotation.y !== 0 && rotation.x !== 90 && rotation.x !== 60 && rotation.x !== -85) {
        flag(player, "BadPackets", "F", "xRot",`${rotation.x},yRot=${rotation.y}`);
    }   
}