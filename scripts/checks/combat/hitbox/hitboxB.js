import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

/**
 * Helper function to calculate the angle between two vectors.
 * @param {*} vec1 
 * @param {*} vec2 
 * @returns 
 */
function vectorAngle(vec1, vec2) {

    const dot = vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z);
    const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z);

    return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

/**
 * Helper function to calculate the direction vector from yaw and pitch.
 * @param {*} yaw 
 * @param {*} pitch 
 * @returns 
 */
function getDirectionVector(yaw, pitch) {

    const yawRadians = yaw * (Math.PI / 180);
    const pitchRadians = pitch * (Math.PI / 180);

    return {
        x: -Math.sin(yawRadians) * Math.cos(pitchRadians),
        y: -Math.sin(pitchRadians),
        z: Math.cos(yawRadians) * Math.cos(pitchRadians)
    };
}

/**
 * Helper function to calculate the 3D distance between two points.
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} z1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} z2 
 * @returns 
 */
function distance3D(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

/**
 * Helper function to calculate the eye height of a player.
 * @param {*} player 
 * @returns 
 * @remarks //TODO: Once Mojang adds .isCrawling or something similar, account for it by 0.40625
 */
function getEyeHeight(player) {

    switch (true) {
        case player.isSneaking:
            return 1.28125;
        case player.isSwimming:
            return 0.40625;
        case player.isGliding:
            return 0.40625;
        default:
            return 1.625;
    }
}

/**
 * Determines if a player hit an entity while looking at it.
 * @param {*} player 
 * @param {*} entity 
 */
export function hitbox_b(player, entity) {

    if (!config.modules.hitboxB.enabled) return;

    const LOOK_THRESHOLD = config.modules.hitboxB.threshold; 
    const ENTITY_HEIGHT = config.modules.hitboxB.height;
    const MIN_DISTANCE = config.modules.hitboxB.distance;

    // Maintain a list of the entity's location history
    if (!entity.locationHistory) {
        entity.locationHistory = [];
    }
    entity.locationHistory.push(entity.location);
    if (entity.locationHistory.length > 10) { // Limit history size to 10
        entity.locationHistory.shift();
    }

    // Calculate angles for each location in the entity's history
    const angleList = [];
    const playerPos = player.location;
    const viewDirection = getDirectionVector(player.getRotation().y, player.getRotation().x);
    const eyeHeight = playerPos.y + getEyeHeight(player);

    for (const location of entity.locationHistory) {

        const deltaX = location.x - playerPos.x;
        const deltaZ = location.z - playerPos.z;

        // Check multiple points vertically within the entity's bounding box
        for (let deltaY = location.y; deltaY <= location.y + ENTITY_HEIGHT; deltaY += 0.5) {

            const adjustedDeltaY = deltaY - eyeHeight;

            if (distance3D(0, 0, 0, deltaX, adjustedDeltaY, deltaZ) > 2) {
                const angle = vectorAngle({ x: deltaX, y: adjustedDeltaY, z: deltaZ }, viewDirection);
                angleList.push(angle);
            }
        }
    }

    const distance = Math.sqrt(
        Math.pow(entity.location.x - player.location.x, 2) + 
        Math.pow(entity.location.y - player.location.y, 2) + 
        Math.pow(entity.location.z - player.location.z, 2)
    );

    // Check if any of the angles are within the threshold
    if (angleList.length > 0) {

        const minAngle = Math.min(...angleList);

        if (minAngle <= LOOK_THRESHOLD) {
            
            debug(player, `§aYou are looking at the entity you hit! Angle`, `§8${minAngle}, §aDistance: §8${distance}`, `hitbox`);

        } else {

            debug(player, `§cYou hit the entity, but you are not looking directly at it. Angle`, `§8${minAngle}, §cDistance: §8${distance}`, `hitbox`);

            if (distance > MIN_DISTANCE) {
                flag(player, "Hitbox", "B", "angle-diff", `${minAngle}, distance=${distance}`);
            }
        }
    }
}