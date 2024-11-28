import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";
import { Statistics } from "../../../utils/Statistics.js";

const buffer = new Map(); // Store player buffers here

/**
 * Checks for attacking with an integer x/y rotation.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Player | Minecraft.Entity} entity - The attacked entity.
 */
export function killauraA(player, entity) {
    
    if (!config.modules.killauraA.enabled) return;

    const rotation = player.getRotation();

    // If the target is a player, get their name.
    const targetName = entity.isPlayer() ? `, target=${entity.name}` : `, target=${entity.typeId.replace("minecraft:", "")}`;

    if (!player.isRiding()) {

        // If either the x or y rotation is an integer, increment buffer
        if (Statistics.isNearlyInteger(rotation.x) || Statistics.isNearlyInteger(rotation.y)) {

            // Initialize buffer count for the player if not set
            if (!buffer.has(player.id)) {
                buffer.set(player.id, 0);
            }

            // Increment the player's buffer
            buffer.set(player.id, buffer.get(player.id) + 1);

            // If buffer count reaches threshold, flag and reset buffer
            if (buffer.get(player.id) >= 3) {
                flag(player, "Killaura", "A", "xRot", `${rotation.x}, yRot=${rotation.y}${targetName}`);
                buffer.set(player.id, 0);
            }
        }
    }
}