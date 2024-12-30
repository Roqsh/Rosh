import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util";

const lastDeltaYMap = new Map();
const lastDeltaXZMap = new Map();
const bufferMap = new Map();

/**
 * Checks for constant vertical or horizontal movement.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * 
 * **Notes:**
 *  - May produce false positives upon teleportation. (No API method yet to detect that)
 */
export function flyF(player) {

    if (!config.modules.flyF.enabled) return;

    if (
        !aroundAir(player) ||
        !inAir(player) ||
        !player.isLoggedIn() ||
        player.isDead() ||
        player.isInWeb() ||
        player.isSlimeBouncing() ||
        player.isTridentHovering() ||
        player.isRiding() ||
        player.getEffect("levitation") ||
        player.getEffect("jump_boost") ||
        player.getEffect("slow_falling") ||
        player.isOnGround ||
        player.isGliding ||
        player.isFlying ||
        player.isClimbing ||
        player.isOnShulker ||
        player.isOnStairs
    ) return;

    const currentPos = player.getPosition();
    const lastPos = player.getLastPosition();

    const deltas = {
        Y: currentPos.y - lastPos.y,
        XZ: Math.hypot(currentPos.x - lastPos.x, currentPos.z - lastPos.z),
    };

    for (const [axis, delta] of Object.entries(deltas)) {
        if (Math.abs(delta) < 0.01) continue;

        const lastDeltaMap = axis === "Y" ? lastDeltaYMap : lastDeltaXZMap;
        const bufferKey = `${player.id}_${axis}`;
        const buffer = bufferMap.get(bufferKey) || 0;

        if (lastDeltaMap.has(player.id)) {
            const accel = Math.abs(delta - lastDeltaMap.get(player.id));
            if (accel === 0) {
                if (buffer >= 5) {
                    flag(player, "Fly", "F", `constant accel, delta${axis}`, delta, true);
                }
                bufferMap.set(bufferKey, buffer + 1);
            } else {
                bufferMap.set(bufferKey, 0);
            }
        }

        lastDeltaMap.set(player.id, delta);
    }
}