import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, aroundAir } from "../../../util";

const lastDeltaYVelocity = new Map();

/**
 * Checks for jumping while in the air.
 * @param {Minecraft.Player} player - The player to check.
 */
export function jump_a(player) {

    if (!config.modules.invalidjumpA.enabled) return;

    const currentYVelocity = player.getVelocity().y;
    const previousYVelocity = player.getLastVelocity().y;

    // Calculate the delta to detect positive or negative changes in velocity
    const deltaYVelocity = previousYVelocity - currentYVelocity;

    if (lastDeltaYVelocity.has(player.id)) {
        
        if (
            aroundAir(player) &&
            !player.isDead() &&
            !player.isSlimeBouncing() &&
            !player.hasTag("damaged") &&
            !player.isOnGround &&
            !player.isGliding &&
            !player.isFlying &&
            player.isJumping &&
            lastDeltaYVelocity.get(player.id) < 0 &&
            deltaYVelocity > 0
        ) {
            // The player's velocity changed from negative (falling) to positive (rising) mid air, flag
            flag(player, "InvalidJump", "A", "air-jumped from", ` ${lastDeltaYVelocity.get(player.id)} to ${deltaYVelocity}`, true);
        }
    }

    lastDeltaYVelocity.set(player.id, deltaYVelocity);
}