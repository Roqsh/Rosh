import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore, aroundAir, debug } from "../../../util";

const lastPosition = new Map();

/**
 * Checks for ground spoof
 * @param {Minecraft.Player} player - The player to check.
 */
export function fly_c(player) {
  
    if (!config.modules.flyC.enabled) return;

    if (aroundAir(player) && getScore(player, "tick_counter2", 0) > 8 && lastPosition.has(player.name) && !player.isGliding) {

        const posDiff = Math.abs(player.location.x - lastPosition.get(player.name).x) + Math.abs(player.location.z - lastPosition.get(player.name).z);

        debug(player, "Position difference", `${posDiff}, Ground: ${player.isOnGround ? "§aTrue" : "§cFalse"}`, "pos");

        if (player.isOnGround && posDiff < 8 && !player.isJumping && !player.hasTag("damaged")) {
            flag(player, "Fly", "C", "onGround", "spoofed");
        }
    }

    lastPosition.set(player.name, {
        x: player.location.x,
        z: player.location.z
    });
}