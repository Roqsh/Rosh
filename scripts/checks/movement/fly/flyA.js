import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir, debug } from "../../../util";

/**
 * Checks for excessive vertical movement while in air.
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
        !player.isSlimeBouncing() && // Todo: Predict maximum allowed bounce
        !player.isTridentHovering() &&
        !player.isGliding &&
        !player.isFlying &&
        !player.getEffect("levitation")
    ) {

        const position = player.getPosition();
        const lastPosition = player.getLastPosition();

        const deltaY = position.y - lastPosition.y;

        // Get the maximum vertical change allowed
        let maxVerticalChange = 0.42;

        const jumpBoost = player.getEffect("jump_boost");

        if (jumpBoost) {
            maxVerticalChange = (jumpBoost.amplifier * (0.5 * 0.42)) + 0.42;
        }

        if (player.hasTag("damaged")) {
            maxVerticalChange += 0.37;
        }

        // Check if the player's vertical delta exceeds the maximum allowed
        if (deltaY > maxVerticalChange) {
            flag(player, "Fly", "A", "yPos-delta", deltaY, true);
        }
    }
}