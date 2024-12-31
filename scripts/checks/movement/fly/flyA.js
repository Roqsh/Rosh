import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir, debug } from "../../../util";

/**
 * Checks for excessive vertical movement.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * **Notes:**
 * - May produce false positives if the player has the fly ability in Education Edition (`ability <player> mayfly true`)
 * - May produce false positives if the player is `teleported upwards` (No API method yet to detect that)
 * - May produce false positives if you are dragged upwards to an entity when `riding` it
 * - False flags upon huge knockback (TnT, wind charges...)
 */
export function flyA(player) {

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
        !player.getEffect("jump_boost") &&
        !player.hasTag("damaged")
    ) {

        const isSlimeBouncing = player.isSlimeBouncingFlyA();

        const fallDistance = player.getLastAvailableFallDistance();
        const upwardMotion = player.getUpwardMotion();

        const maxBounceHeight = fallDistance * 0.7; // 2/3 would be more accurate, but we need a buffer to avoid false positives

        if (maxBounceHeight < 0.1) return;

        if (isSlimeBouncing && upwardMotion > maxBounceHeight) {
            flag(player, "Fly", "A", "upward Motion", `${upwardMotion.toFixed(4)}/${maxBounceHeight.toFixed(4)}, exceeding=${Math.abs(maxBounceHeight - upwardMotion).toFixed(4)}, bounce-back percentage=${((upwardMotion / maxBounceHeight) * 100).toFixed(1)}`);
        }

        if (
            !player.isRiding() &&
            !player.isSlimeBouncing() &&
            !player.isInWater &&
            !player.isClimbing &&
            player.ticksSinceFlight > 20 &&
            player.ticksSinceGlide > 20
        ) {
            const groundDistance = player.getPosition().y - player.lastGoodPosition.y;
            const goingUpwards = player.getPosition().y > player.getLastPosition().y

            if (!player.isJumping && player.ticksSinceJump > 30 && groundDistance > 0 && goingUpwards) {
                flag(player, "Fly", "A", "ground Distance", `${groundDistance.toFixed(4)} (nojump), deltaY=${player.getMoveDirection().y.toFixed(4)}`);

            } else if (groundDistance > 1.4 && goingUpwards) {
                flag(player, "Fly", "A", "ground Distance", `${groundDistance.toFixed(4)} (jump), deltaY=${player.getMoveDirection().y.toFixed(4)}`);
            }
        }
    }
}