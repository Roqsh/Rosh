import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

// TODO: Implement buffer system

/**
 * Checks for attacking with an integer x/y rotation.
 * @param {Minecraft.Player} player - The player to check.
 */
export function killauraA(player) {
    
    if (!config.modules.killauraA.enabled) return;

    // Get the player's current rotation.
    const rotation = player.getRotation();

    // Check if the player is not riding and has a non-zero x-axis rotation.
    if (!player.isRiding() && rotation.x !== 0) {

        // If either the x or y rotation is an integer, flag for potential Killaura behavior.
        if (Number.isInteger(rotation.x) || Number.isInteger(rotation.y)) {
            flag(player, "Killaura", "A", "xRot", `x=${rotation.x}, y=${rotation.y}`);
        }
    }
}