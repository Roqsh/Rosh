import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for exceeding the maximum reach when attacking.
 * @name reach_a
 * @param {player} player - The player to check.
 * @param {entity} entity - The hit entity.
 */
export function reach_a(player, entity) {

    const preset = config.preset?.toLowerCase();

    if (!config.modules.reachA.enabled || preset === "stable") return;

    const DISTANCE = player.getGameMode() === "creative" ? 6 : 3;

    // Define the settings to use when raycasting
    const raycastOptions = {
        ignoreBlockCollision: false,
        includeLiquidBlocks: false,
        includePassableBlocks: false,
        maxDistance: 10,
    };

    // Perform the raycast and get the entities it hits
    const raycastResult = player.getEntitiesFromViewDirection(raycastOptions);

    // If an entity was hit by the raycast, check the distance and flag if necessary
    if (raycastResult.length > 0) {
        
        let message = "";

        // Get player's and entity's velocity
        const playerVelocity = player.getVelocity();
        const entityVelocity = entity.getVelocity();

        for (const Entity of raycastResult) {

            let entityString = JSON.stringify(Entity);
            let parsedEntity = JSON.parse(entityString);

            // Extract distance, typeId, and id if they exist
            let distance = parsedEntity?.distance ?? "undefined";
            let typeId = parsedEntity?.entity?.typeId ?? "undefined";
            let id = parsedEntity?.entity?.id ?? "undefined";

            // Calculate the adjusted distance based on velocities
            const adjustedDistance = distance - Math.sqrt(
                Math.pow(playerVelocity.x - entityVelocity.x, 2) +
                Math.pow(playerVelocity.y - entityVelocity.y, 2) +
                Math.pow(playerVelocity.z - entityVelocity.z, 2)
            );

            message += `§aEntity: §8${typeId}§a, Distance: §8${distance}, Adjusted Distance: §8${adjustedDistance}\n`;

            if (
                entity.typeId === typeId &&
                entity.id === id &&
                adjustedDistance > DISTANCE
            ) {
                flag(player, "Reach", "A", "distance", `${adjustedDistance},player=${entity.nameTag},entity=${typeId}`);
            }
        }

        // Debug the information
        if (player.hasTag("deventityray")) player.sendMessage(message.trim());
    } else {
        if (player.hasTag("deventityray")) player.sendMessage("§cNo entity was hit by the raycast!");
    }
}