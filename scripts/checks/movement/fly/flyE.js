import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir, debug } from "../../../util";

const lastDeltaY = new Map();
const bufferCounter = new Map();

/**
 * Predicts the change in a player's vertical movement.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * 
 * **Notes:**
 *  - May produce false positives upon teleportation. (No API method yet to detect that)
 */
export function flyE(player) {

    if (!config.modules.flyE.enabled || config.preset?.toLowerCase() === "stable") return;

    if (
        !aroundAir(player) ||
        !inAir(player) ||
        !player.isLoggedIn() ||
        player.isTridentHovering() ||
        player.isSlimeBouncing() ||
        player.isDead() ||
        player.isGliding ||
        player.isFlying ||
        player.isOnGround ||
        player.getEffect("levitation") ||
        player.getEffect("jump_boost") ||
        player.getEffect("slow_falling") ||
        player.hasTag("damaged")
    ) return;

    const buffer = bufferCounter.get(player.id) || 0; // Retrieve buffer or initialize

    const currentPosition = player.getPosition();
    const previousPosition = player.getLastPosition();

    const deltaY = Math.abs(currentPosition.y - previousPosition.y);

    if (lastDeltaY.has(player.id)) {

        // Predict the change in vertical movement based on the previous change
        const prediction = (lastDeltaY.get(player.id) - 0.08) * 0.98;

        // Calculate the difference between the prediction and the actual change
        const delta = Math.abs(prediction - deltaY);

        debug(player, "\nPredicted deltaY-position", `${prediction}\n§jReceived: §8${deltaY}\n§jDelta: §8${delta}`, "prediction");

        // If the actual change is significantly different from the prediction, the player is flagged
        if (delta > 0.01) {
            
            if (buffer >= 2) {
                flag(player, "Fly", "E", "predicted", `${prediction}, received=${deltaY}, delta=${delta}`, true);
                bufferCounter.set(player.id, 0);
            }  

            bufferCounter.set(player.id, buffer + 1); // Increment
        }
    }

    // Store the current change in vertical movement for the next tick
    lastDeltaY.set(player.id, deltaY);
}