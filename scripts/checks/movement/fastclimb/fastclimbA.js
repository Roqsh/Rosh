import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastDeltaYMap = new Map();

/**
 * Checks for climbing too fast.
 * @param {Minecraft.Player} player - The player to check. 
 */
export function fastclimbA(player) {

    if (!config.modules.fastclimbA.enabled || !player.isClimbing) return;

    if (
        player.isFlying ||
        player.ticksSinceFlight < 8 ||
        player.hasTag("damaged") // TODO: Account for wind charges etc.
    ) {
        if (lastDeltaYMap.has(player.id)) lastDeltaYMap.delete(player.id);
        return;
    }

    const deltaY = player.getPosition().y - player.getLastPosition().y;

    if (lastDeltaYMap.has(player.id)) {

        const lastDeltaY = lastDeltaYMap.get(player.id);
        const sameDeltaY = lastDeltaY === deltaY;

        if (Math.abs(deltaY) > 0.2 && sameDeltaY) {
            flag(player, "FastClimb", "A", "deltaY", deltaY);
        }
    }

    lastDeltaYMap.set(player.id, deltaY);
}