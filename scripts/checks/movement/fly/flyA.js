import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir, debug } from "../../../util";

/**
 * Checks for excessive vertical movement while in air.
 * @param {Minecraft.Player} player - The player to check.
 */
export function fly_a(player) {

    if (!config.modules.flyA.enabled) return;

    const velocity = player.getVelocity();

    // Check if the player is in air and exempt certain situations
    if (
        aroundAir(player) &&
        inAir(player) &&
        player.isLoggedIn() &&
        !player.isDead() &&
        !player.isSlimeBouncing() &&
        !player.isTridentHovering() &&
        !player.isGliding &&
        !player.isFlying
    ) {

        // Get the maximum vertical change allowed
        let maxVerticalChange = 0.42000008;

        // Check if the player has a jump boost effect
        const jumpBoost = player.getEffect("jump_boost");
        if (jumpBoost) {

            // Calculate the maximum vertical change allowed with the jump boost effect
            maxVerticalChange = (jumpBoost.amplifier * (0.5 * 0.42000008)) + 0.42000008;
        }

        if (player.hasTag("damaged")) {
            maxVerticalChange += 0.37;
        }

        // Check if the player's vertical velocity exceeds the maximum allowed
        if (velocity.y > maxVerticalChange) {

            // Flag the player for excessive vertical movement
            flag(player, "Fly", "A", "yVel", `${velocity.y}, max=${maxVerticalChange}`, true);
        }
    }
}
