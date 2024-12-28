import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util.js";

const flyDetectionCounter = new Map();

/**
 * Checks for no vertical movement.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * 
 * **Notes:**
 * - May produce false positives if the player has the fly ability in Education Edition (`ability <player> mayfly true`).
 * - False flags if the player is repeatedly teleported to the same y-level mid-air. (No API method yet to detect that)
 * - May produce false positives if the player is not completely logged in when joining.
 */
export function flyB(player) {

    if (!config.modules.flyB.enabled) return;

    // Exit early if the player is not in a state that warrants flight detection
    if (
        !aroundAir(player) ||
        !inAir(player) ||
        !player.isLoggedIn() ||
        player.isDead() ||
        player.isTridentHovering() ||
        player.isGliding ||
        player.isFlying ||
        player.isOnGround ||
        player.getEffect("slow_falling")
    ) return;

    const verticalVelocity = player.getVelocity().y;

    // Retrieve the current counter value or initialize it
    const counter = flyDetectionCounter.get(player.id) || 0;

    if (verticalVelocity === 0) {
        if (counter >= 8) {
            flag(player, "Fly", "B", "yVel", `${verticalVelocity}, horizontal: ${Math.hypot(player.getMoveDirection().x, player.getMoveDirection().z)}`);
        }
        flyDetectionCounter.set(player.id, counter + 1);
    } else {
        flyDetectionCounter.set(player.id, 0);
    }
}