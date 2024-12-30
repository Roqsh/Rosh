import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for invalid flying. (Without proper permission)
 * @param {Minecraft.Player} player - The player to check.
 */
export function badpacketsH(player) {
    
    if (!config.modules.badpacketsH.enabled || !player.isFlying) return;
    
    if (player.getGameMode() === "spectator" || player.getGameMode() === "creative") return;
    
    /**
     * When the mayfly ability is given via Rosh, we tag them with `flying´ to prevent false positives here.
     * But because this ability can also be given by anyone else, this is not the best solution as it could
     * still potentially false flag.
     */ 
    if (!player.isOp() && !player.hasTag("flying")) {
        flag(player, "BadPackets", "H", "invalid flight, operator", "false");
        player.runCommandAsync(`ability "${player.name}" mayfly false`);
    }
}