import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util.js";

const flyDetectionCounter = new Map();

/**
 * Checks for no vertical movement.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks 
 * - May produce false positives if the player has the fly ability in Education Edition (`ability <player> mayfly true`).
 * - May produce false positives if the player is repeatedly teleported to the same y-level mid-air.
 */
export function fly_b(player) {

    if (!config.modules.flyB.enabled) return;

    // Exit early if the player is not in a state that warrants flight detection
    if (
        !aroundAir(player) ||
        !inAir(player) ||
        player.isDead() ||
        player.isGliding ||
        player.isFlying ||
        player.isOnGround
    ) return;

    const verticalVelocity = player.getVelocity().y;

    // Retrieve the current counter value or initialize it
    const counter = flyDetectionCounter.get(player) || 0;

    if (verticalVelocity === 0) {
        if (counter >= config.modules.flyB.threshold) {
            flag(player, "Fly", "B", "yVel", verticalVelocity);
        }
        flyDetectionCounter.set(player, counter + 1);
    } else {
        flyDetectionCounter.set(player, 0);
    }
}