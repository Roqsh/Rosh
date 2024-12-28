// TODO: Recode... (Account for all possibilities and effects and dont just return)

import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

/**
 * Checks for moving too fast.
 * @param {Minecraft.Player} player - The player to check.
 */
export function speed_a(player) {
    
    if (!config.modules.speedA.enabled) return;
    
    if (
        player.isFlying || 
        player.isGliding ||
        player.isOnIce ||
        player.ticksSinceFlight < 20 ||
        player.ticksSinceGlide < 20 ||
        player.hasTag("attacking") ||
        player.hasTag("damaged") ||
        player.isSlimeBouncing() ||
        player.isTridentHovering()
    ) return;

    const playerSpeed = getSpeed(player);
    
    if (player.getEffect("speed")) {
        
        const maxSpeed = config.modules.speedA.speed;
        const speedEffectValue = player.getEffect("speed").amplifier;
        
        let modifiedSpeed = maxSpeed; 
        
        for (let i = 0; i < speedEffectValue; i++) {
            modifiedSpeed += 0.3; 
        }
        
        if (player.isRiding()) {
            modifiedSpeed += 0.9;
        }
        
        if (playerSpeed > modifiedSpeed) {
            flag(player, "Speed", "A", "speed", playerSpeed, true);
        }
    
    } else {
        
        let maxSpeed2 = config.modules.speedA.speed;
        
        if (player.isRiding()) {
            maxSpeed2 += 0.9;
        }
        
        if (playerSpeed > maxSpeed2) {
            flag(player, "Speed", "A", "speed", playerSpeed, true);
        }
    }
}