import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util";

const lastDeltaYMap = new Map();
const bufferMap = new Map();

/**
 * Checks for constant vertical movement.
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

    const buffer = bufferMap.get(player.id) || 0;
    const deltaY = player.getPosition().y - player.getLastPosition().y;
    
    if (Math.abs(deltaY) < 0.01) return;
    
    if (lastDeltaYMap.has(player.id)) {

        const acceleration = Math.abs(deltaY - lastDeltaYMap.get(player.id));

        if (acceleration === 0) {
            if (buffer >= 10) {
                flag(player, "Fly", "F", "constant accel, deltaY", deltaY, true);
            }
            bufferMap.set(player.id, buffer + 1);
        } else {
            bufferMap.set(player.id, 0);
        }
    }
    
    lastDeltaYMap.set(player.id, deltaY);
}