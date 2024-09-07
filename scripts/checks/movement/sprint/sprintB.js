import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for sprinting while having the blindness effect.
 * @param {Minecraft.Player} player - The player to check.
 */
export function sprint_b(player) {
    
    if (!config.modules.invalidsprintB.enabled) return;

    const blindnessEffect = player.getEffect("blindness");

    if (blindnessEffect && player.isSprinting) {
        const amplifier = blindnessEffect.amplifier;
        const durationInSeconds = blindnessEffect.duration / 20;

        flag(player, "InvalidSprint", "B", "blindness", `${durationInSeconds.toFixed(1)} seconds, level=${amplifier + 1}`, true);
    }
}