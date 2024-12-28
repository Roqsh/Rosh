import * as Minecraft from "@minecraft/server";

/**
 * Manages player properties that can be accessed via the `getLast` methods
 * to obtain data from the previous tick. (Runs after the main code)
 * @param {Minecraft.Player} player - The player which is being managed.
 */
export function manageLastTick(player) {

    // Update the player's last held items
    player.setLastItemInHand(player.getItemInHand());
    player.setLastItemInCursor(player.getItemInCursor());

    // Update the player's last position and velocity
    player.setLastPosition(player.getPosition());
    player.setLastVelocity(player.getVelocity());

    // Update the player's last rotations
    player.setLastYaw(player.getYaw());
    player.setLastPitch(player.getPitch());
    player.setLastDeltaYaw(player.getDeltaYaw());
    player.setLastDeltaPitch(player.getDeltaPitch());

    // Update the player's last fall distance
    player.setLastFallDistance(player.getFallDistance());

    const blockUnderPlayer = player.dimension.getBlock({
        x: player.location.x, 
        y: player.location.y - 1, 
        z: player.location.z
    }).typeId;

    // Handling for .isSlimeBouncing()
    if (player.isFalling || (blockUnderPlayer !== "minecraft:slime" && blockUnderPlayer !== "minecraft:air")) {
        player.touchedSlimeBlock = false;
    }

    // Handling for .isTridentHovering()
    if (player.isFalling && !player.isHoldingRiptideTrident) {
        player.usedRiptideTrident = false;
    }
}