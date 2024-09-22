import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir, debug } from "../../../util";

const lastDeltaY = new Map();
const bufferCounter = new Map();

/**
 * Predicts the change in a player's vertical velocity.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks **Note:**
 *  - May produce false positives upon teleportation. (No API method yet to detect that)
 */
export function fly_e(player) {

    const preset = config.preset?.toLowerCase();
    if (preset === "stable") return;

    if (!config.modules.flyE.enabled) return;

    if (
        !aroundAir(player) ||
        !inAir(player) ||
        !player.isLoggedIn() ||
        player.isTridentHovering() ||
        player.isDead() ||
        player.isGliding ||
        player.isFlying ||
        player.isOnGround ||
        player.getEffect("slow_falling") ||
        player.hasTag("damaged")
    ) return;

    // Retrieve the current buffer value or initialize it
    const buffer = bufferCounter.get(player.id) || 0;

    const currentYVelocity = player.getVelocity().y;
    const previousYVelocity = player.getLastVelocity().y;

    const deltaY = Math.abs(currentYVelocity - previousYVelocity);

    if (deltaY === 0) return;

    if (lastDeltaY.has(player.id)) {

        // Predict the change in vertical velocity based on the previous change
        const prediction = lastDeltaY.get(player.id) * 0.9800000190734863;

        // Calculate the difference between the prediction and the actual change
        const delta = Math.abs(prediction - deltaY);

        debug(player, "\nPrediction", `${prediction}\n§jActual: §8${deltaY}\n§jDelta: §8${delta}`, "prediction");

        if (delta > 0.5) {
            // If the actual change is significantly different from the prediction, the player is flagged
            if (buffer >= config.modules.flyE.threshold) {
                flag(player, "Fly", "E", "prediction", `${prediction}, actual=${deltaY}, delta=${delta}`, true);
                bufferCounter.set(player.id, 0);
            }  

            // Increment the buffer counter
            bufferCounter.set(player.id, buffer + 1);
        }
    }

    // Store the current change in vertical velocity for the next tick
    lastDeltaY.set(player.id, deltaY);
}