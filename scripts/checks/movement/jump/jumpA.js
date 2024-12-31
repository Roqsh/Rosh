import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util";

const lastDeltaYMap = new Map();
const lastAccelerationMap = new Map();

/**
 * Checks for jumping while in the air.
 * @param {Minecraft.Player} player - The player to check.
 */
export function jumpA(player) {

    if (!config.modules.invalidjumpA.enabled) return;

    if (
        !aroundAir(player) ||
        !inAir(player) ||
        !player.isLoggedIn() ||
        player.isDead() ||
        player.isSlimeBouncing() ||
        player.isTridentHovering() ||
        player.isRiding() ||
        player.getEffect("levitation") ||
        player.getEffect("jump_boost") ||
        player.getEffect("slow_falling") ||
        player.hasTag("damaged") ||
        player.isOnGround ||
        player.isGliding ||
        player.isFlying ||
        player.ticksSinceFlight < 20 ||
        player.ticksSinceGlide < 20
    ) {
        if (lastDeltaYMap.has(player.id)) lastDeltaYMap.delete(player.id);
        if (lastAccelerationMap.has(player.id)) lastAccelerationMap.delete(player.id);
        return;
    }

    const deltaY = player.getPosition().y - player.getLastPosition().y;

    if (Math.abs(deltaY) < 0.01) return;

    if (lastDeltaYMap.has(player.id)) {

        const acceleration = deltaY - lastDeltaYMap.get(player.id);

        if (lastAccelerationMap.has(player.id)) {
            
            const lastAcceleration = lastAccelerationMap.get(player.id);

            if (
                acceleration > 0 &&
                lastAcceleration <= 0 &&
                deltaY > 0
            ) {
                flag(player, "InvalidJump", "A", "air-jumped from", `${lastAcceleration.toFixed(4)} to ${acceleration.toFixed(4)}, deltaY: ${deltaY.toFixed(4)}`);
            }
        }

        lastAccelerationMap.set(player.id, acceleration);
    }

    lastDeltaYMap.set(player.id, deltaY);
}