import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for flying without permission.
 * @name badpackets_h
 * @param {player} player - The player to check
 */
export function badpackets_h(player) {

    if (!config.modules.badpacketsH.enabled) return;

    if (player.getGameMode() === "spectator" || player.getGameMode() === "creative") return;
        
    if (player.isFlying && !player.isOp()) {
        flag(player, "BadPackets", "H", "isFlying", "true", true);
        player.runCommandAsync(`ability "${player.name}" mayfly false`);
    }
}