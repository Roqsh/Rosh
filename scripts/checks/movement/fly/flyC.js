import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore, aroundAir, inAir, debug } from "../../../util";

/**
 * Checks for ground spoof.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * 
 * **Notes:**
 * - False flags upon teleportation. (No API method yet to detect that)
 */
export function flyC(player) {
  
    if (!config.modules.flyC.enabled) return;

    if (
        aroundAir(player) && 
        inAir(player) &&
        player.isLoggedIn() &&  
        !player.isDead() &&
        player.getRiddenEntity()?.typeId !== "minecraft:horse" &&
        !player.getEffect("slow_falling") &&
        !player.getEffect("levitation")
    ) {

        const posDiff = Math.abs(player.location.x - player.getLastPosition().x) + Math.abs(player.location.z - player.getLastPosition().z);

        debug(player, "Position difference", `${posDiff}, Ground: ${player.isOnGround ? "§aTrue" : "§cFalse"}`, "pos");

        if (player.isOnGround && posDiff < 8 && !player.isJumping && !player.hasTag("damaged")) {
            flag(player, "Fly", "C", "onGround", "spoofed");
        }
    }
}