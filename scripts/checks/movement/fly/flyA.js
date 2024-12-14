import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir, debug } from "../../../util";

/**
 * Checks for excessive vertical movement.
 * @param {Minecraft.Player} player - The player to check.
 * 
 * **Notes:**
 * - May produce false positives if the player has the fly ability in Education Edition (`ability <player> mayfly true`)
 * - May produce false positives if the player is `teleported upwards`
 * - May produce false positives if you are dragged upwards to an entity when `riding` it
 */
export function fly_a(player) {

    if (!config.modules.flyA.enabled) return;

    // Check if the player is in air and exempt certain situations
    if (
        aroundAir(player) &&
        inAir(player) &&
        player.isLoggedIn() &&
        !player.isDead() &&
        !player.isTridentHovering() &&
        !player.isGliding &&
        !player.isFlying &&
        !player.getEffect("levitation") &&
        !player.hasTag("damaged")
    ) {

        const isSlimeBouncing = player.isSlimeBouncingFlyA();

        const fallDistance = player.getLastAvailableFallDistance();
        const upwardMotion = player.getUpwardMotion();

        const maxBounceHeight = fallDistance * 0.7;

        if (maxBounceHeight < 0.1) return;

        if (isSlimeBouncing && upwardMotion > maxBounceHeight) {
            flag(player, "Fly", "A", "upward Motion", `${upwardMotion.toFixed(4)}/${maxBounceHeight.toFixed(4)}, exceeding=${Math.abs(maxBounceHeight - upwardMotion).toFixed(4)}, bounce-back percentage=${((upwardMotion / maxBounceHeight) * 100).toFixed(1)}`);
        }
    }
}