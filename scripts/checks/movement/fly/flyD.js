import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util";

// Tracks how long a player is in the air
const isInAirCounter = new Map();

/**
 * Checks for not falling after being in the air for too long.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * 
 * **Notes:**
 *  - May produce false positives upon teleportation. (No API method yet to detect that)
 */
export function flyD(player) {

    if (!config.modules.flyD.enabled) return;

    // Exit early if the player is not in a state that warrants flight detection
    if (player.isFalling) {
        isInAirCounter.set(player.id, 0);
        return;
    }    

    // Retrieve the current counter value or initialize it
    const counter = isInAirCounter.get(player.id) || 0;

    if (
        aroundAir(player) &&
        inAir(player) &&
        player.isLoggedIn() &&
        !player.isDead() &&
        !player.isInWeb() &&
        !player.isRiding() &&
        !player.isSlimeBouncing() &&
        !player.isTridentHovering() &&
        !player.isGliding &&
        !player.isFlying &&
        !player.isOnGround &&
        !player.isJumping &&
        !player.getEffect("levitation") &&
        !player.getEffect("jump_boost") &&
        !player.getEffect("slow_falling") &&
        !player.hasTag("damaged") &&
        player.getGameMode() !== "creative"
    ) {
        isInAirCounter.set(player.id, counter + 1);
    } else {
        isInAirCounter.set(player.id, 0);
    }

    // Flag if the player hasn't started to fall after being in the air for too long
    if (!player.isFalling && counter >= 10) {
        flag(player, "Fly", "D", "not falling", ` ${counter} ticks`);
    }
}