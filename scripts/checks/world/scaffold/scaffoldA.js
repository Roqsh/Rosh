import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

const scaffold_a_map = new Map();

function diagonal(newBlock, player, oldBlock) {

    const newDistance = calculateDistance(player.location, newBlock);
    const oldDistance = calculateDistance(player.location, oldBlock);

    return (
        Math.abs(newBlock.x - oldBlock.x) === 1 &&
        Math.abs(newBlock.z - oldBlock.z) === 1 &&
        newBlock.y === oldBlock.y &&
        newBlock.y < player.location.y &&
        newDistance > oldDistance
    );
}

function air(player, one, two, three) {
    
    const airone =  { x: one.x, y: one.y - 1, z: one.z };
    const airtwo = { x: two.x, y: two.y - 1, z: two.z };
    const airthree = { x: three.x, y: three.y - 1, z: three.z };
    
    return (
        player.dimension.getBlock(airone).typeId === "minecraft:air" &&
        player.dimension.getBlock(airtwo).typeId === "minecraft:air" &&
        player.dimension.getBlock(airthree).typeId === "minecraft:air"
    );
}

function is_decrease(origin, point1, point2, point3) {

    const distance1 = calculateDistance(origin, point1);
    const distance2 = calculateDistance(origin, point2);
    const distance3 = calculateDistance(origin, point3);
    const isOneThreeDistanceEqual = calculateDistance(point1, point3) === 1;

    return (
        isOneThreeDistanceEqual &&
        distance1 > distance2 &&
        distance1 > distance3 &&
        distance2 > distance3
    );
}

function calculateDistance(origin, point) {

    const distanceX = point.x - origin.x;
    const distanceZ = point.z - origin.z;

    return Math.hypot(distanceX, distanceZ);
}

function shouldFlagForYaw(pitch_values, yaw_values) {

    const isPitchChange = Math.abs(pitch_values.new - pitch_values.mid) > 0.05 && Math.abs(pitch_values.mid - pitch_values.old) > 0.05;
    const isYawSame = Math.abs(yaw_values.new - yaw_values.mid) === 0 && Math.abs(yaw_values.mid - yaw_values.old) === 0;

    return isPitchChange && isYawSame;
}

function shouldFlagForDiagonal(pitch_values, yaw_values) {

    const isPitchEqual = Math.abs(pitch_values.new - pitch_values.mid) === 0 && Math.abs(pitch_values.new - pitch_values.old) === 0;
    const isYawEqual = Math.abs(yaw_values.new - yaw_values.mid) === 0 && Math.abs(yaw_values.new - yaw_values.old) === 0;
    const isDiagonalConditionMet = isPitchEqual && isYawEqual

    return isDiagonalConditionMet;
}

/**
 * Checks for diagonal scaffolds. [Beta]
 * @name scaffold_a
 * @param {player} player - The player to check
 * @param {block} block - The placed block
 * @remarks FIXME: Placing on ground false flags the no-rot and distance check  TODO: Add check if diag is in air (below done, sides need to be done, hard to implement
 * as you need to figure out when x and z are covered by the diag block and when they are air), add backwards compatibility, etc...
*/
export function scaffold_a(player, block) {

    const preset = config.preset?.toLowerCase();
    if (preset === "stable") return;

    const rotation = player.getRotation();
    const playerData = scaffold_a_map.get(player.name);

    if (config.modules.scaffoldA.enabled && playerData) {

        const place_location = { x: block.location.x, y: block.location.y, z: block.location.z };

        const last_place_location = playerData.a;
        const old_place_location = playerData.b;

        const pitch_values = playerData.pitch;
        const yaw_values = playerData.yaw;
        
        const distance = calculateDistance(player.location, block.location);

        if (last_place_location && old_place_location && pitch_values) {

            const xDist = Math.abs(place_location.x) - Math.abs(last_place_location.x);
            const zDist = Math.abs(place_location.z) - Math.abs(last_place_location.z);

            const isSameX = xDist === 0 && Math.abs(place_location.x) === Math.abs(old_place_location.x);
            const isSameZ = zDist === 0 && Math.abs(place_location.z) === Math.abs(old_place_location.z);

            if (isSameX || isSameZ) {

                if (shouldFlagForYaw(pitch_values, yaw_values, player)) {
                    flag(player, "Scaffold", "A", "yaw", rotation.y);
                }
            }

            if (
                diagonal(place_location, player, old_place_location) && 
                air(player, place_location, last_place_location, old_place_location)
            ) {

                if (shouldFlagForDiagonal(pitch_values, yaw_values)) {
                    flag(player, "Scaffold", "A", "rotDiff", `0, distance=${distance}`);
                }

                const diff_1 = Math.abs(yaw_values.mid - yaw_values.new);
                const diff_2 = Math.abs(yaw_values.new - rotation.y);

                if (distance > 2.5 && !is_decrease(player, place_location, last_place_location, old_place_location)) {
                    flag(player, "Scaffold", "A", "distance", distance);
                }

                if (diff_2 < 10 && diff_1 < 10 && !is_decrease(player, place_location, last_place_location, old_place_location) && diff_1 > 0.5 && diff_2 > 0.5 && !config.modules.scaffoldA.nofalse && getSpeed(player) > 0.1) {
                    flag(player, "Scaffold", "A", "yaw-diff", (diff_1 + diff_2) / 2);
                }

                if (getSpeed(player) > 1) {
                    flag(player, "Scaffold", "A", "speed", getSpeed(player));
                }

                if (!player.hasTag("itemUse") && distance > 2 && getSpeed(player) > 0.15) {
                    flag(player, "Scaffold", "A", "itemUse", "false");
                }
            }
        }
    }

    scaffold_a_map.set(player.name, {
        a: {
            x: block.location.x, 
            y: block.location.y, 
            z: block.location.z 
        },
        b: playerData?.a,
        pitch: {
            new: rotation.x,
            mid: playerData?.pitch?.new || 0,
            old: playerData?.pitch?.mid || 0
        },
        yaw: {
            new: rotation.y,
            mid: playerData?.yaw?.new || 0,
            old: playerData?.yaw?.mid || 0
        }
    });
}