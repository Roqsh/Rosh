import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util";

const lastDeltaMap = new Map();

/**
 * Checks for switching directions mid-air.
 * @param {Minecraft.Player} player - The player to check.
 */
export function motionA(player) {

    if (!config.modules.motionA.enabled) return;

    if (
        !aroundAir(player) ||
        !inAir(player) ||
        player.isOnGround ||
        player.isGliding ||
        player.isFlying ||
        !player.isLoggedIn() ||
        player.isDead() ||
        player.isTridentHovering() ||
        player.isRiding() ||
        player.getEffect("levitation") ||
        player.getEffect("jump_boost") ||
        player.getEffect("slow_falling")
    ) {
        if (lastDeltaMap.has(player.id)) lastDeltaMap.delete(player.id);
        return;
    }

    const deltaX = player.getPosition().x - player.getLastPosition().x;
    const deltaZ = player.getPosition().z - player.getLastPosition().z;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaZ = Math.abs(deltaZ);

    if (lastDeltaMap.has(player.id)) {

        const lastDeltaX = lastDeltaMap.get(player.id).x;
        const lastDeltaZ = lastDeltaMap.get(player.id).z;

        const absLastDeltaX = Math.abs(lastDeltaX);
        const absLastDeltaZ = Math.abs(lastDeltaZ);

        const accelX = absDeltaX - absLastDeltaX;
        const accelZ = absDeltaZ - absLastDeltaZ;

        const xSwitched = (deltaX > 0 && lastDeltaX < 0) || (deltaX < 0 && lastDeltaX > 0) && Math.abs(accelX) > 0.1;
        const zSwitched = (deltaZ > 0 && lastDeltaZ < 0) || (deltaZ < 0 && lastDeltaZ > 0) && Math.abs(accelZ) > 0.1;

        if (xSwitched) {
            flag(player, "Motion", "A", `accelX=${accelX}, deltaX`, deltaX);

        } else if (zSwitched) {
            flag(player, "Motion", "A", `accelZ=${accelZ}, deltaZ`, deltaZ);
        }
    }

    lastDeltaMap.set(player.id, { x: deltaX, z: deltaZ });
}