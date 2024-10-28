import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore, aroundAir, debug } from "../../../util";

/**
 * Checks for ground spoof.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * **Note:**
 * - False flags when jumping with a horse.
 */
export function fly_c(player) {
  
    if (!config.modules.flyC.enabled) return;

    if (aroundAir(player) && player.isLoggedIn() && !player.isGliding && !player.isDead()) {

        const posDiff = Math.abs(player.location.x - player.getLastPosition().x) + Math.abs(player.location.z - player.getLastPosition().z);

        debug(player, "Position difference", `${posDiff}, Ground: ${player.isOnGround ? "§aTrue" : "§cFalse"}`, "pos");

        if (player.isOnGround && posDiff < 8 && !player.isJumping && !player.hasTag("damaged")) {
            flag(player, "Fly", "C", "onGround", "spoofed");
        }
    }
}