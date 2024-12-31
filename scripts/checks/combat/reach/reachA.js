import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

/**
 * Checks for exceeding the maximum reach when attacking.
 * @param {Minecraft.Player} player - The player to check.
 * @param {Minecraft.Player | Minecraft.Entity} entity - The hit entity.
 */
export function reachA(player, entity) {

    if (!config.modules.reachA.enabled || config.preset?.toLowerCase() === "stable") return;

    const DISTANCE = player.getGameMode() === "creative" ? 6 : 3.5;

    const targetName = entity.isPlayer() ? `, target=${entity.name}` : `, target=${entity.typeId.replace("minecraft:", "")}`;

    if (getSpeed(player) !== 0) {
        const rawDistance = Math.hypot(entity.location.x - player.location.x, entity.location.z - player.location.z);

         // Flag the player if the raw distance is greater than what is allowed
        if (rawDistance > 7) {
            flag(player, "Reach", "A", "raw-distance", `${rawDistance}${targetName}`);
        }

        return; // We only want to run the raycast check when the player isnt moving, so the detection is stable
    }

    if (player.isMobile()) return;
    
    let debugMessage = "§cNo entity was hit by the raycast!";

    // Define the settings to use when raycasting
    const raycastOptions = {
        ignoreBlockCollision: false,
        includeLiquidBlocks: false,
        includePassableBlocks: false,
        maxDistance: 10,
    };

    // Perform the raycast and get the entities it hits
    const raycastResult = player.getEntitiesFromViewDirection(raycastOptions);

    // An entity was hit by the raycast
    if (raycastResult.length > 0) {

        const playerVelocity = player.getVelocity();
        const entityVelocity = entity.getVelocity();

        for (const Entity of raycastResult) {

            const entityString = JSON.stringify(Entity);
            const parsedEntity = JSON.parse(entityString);

            // Extract distance, typeId, and id from target if they exist
            const raycastDistance = parsedEntity?.distance ?? "undefined";
            const typeId = parsedEntity?.entity?.typeId ?? "undefined";
            const id = parsedEntity?.entity?.id ?? "undefined";

            debugMessage = `§aEntity: §8${typeId}§a, Distance: §8${raycastDistance}\n`;

            // Flag the player if the raycast distance is greater than what is allowed
            if (entity.typeId === typeId && entity.id === id && raycastDistance > DISTANCE) {
                flag(player, "Reach", "A", "raycast-distance", `${raycastDistance}${targetName}`);
            }
        }
        
        if (player.hasTag("reachdebug")) player.sendMessage(debugMessage.trim());
    }
}