import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for sprinting while having the blindness effect.
 * @param {Minecraft.Player} player - The player to check.
 */
export function sprint_b(player) {
    
    if (!config.modules.invalidsprintB.enabled || !player.isSprinting) return;

    // Get the blindness effect applied to the player
    const blindnessEffect = player.getEffect("blindness");

    // If the player has the blindness effect, proceed to flag them
    if (blindnessEffect) {
        // Retrieve the effect's amplifier (level) and duration in seconds
        const amplifier = blindnessEffect.amplifier;
        const durationInSeconds = blindnessEffect.duration / 20;

        // Flag the player for invalid sprinting due to the blindness effect
        flag(player, "InvalidSprint", "B", "blindness", `${durationInSeconds.toFixed(1)} seconds, level=${amplifier + 1}`, true);
    }
}