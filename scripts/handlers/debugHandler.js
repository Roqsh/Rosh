import * as Minecraft from "@minecraft/server";
import config from "../data/config.js";
import { getScore, getSpeed, debug } from "../util.js";

/**
 * Handles debbuging certain information.
 * @param {Minecraft.Player} player - The player to send the debug information to.
 * @param {number} tps - The current server TPS.
 */
export function debugHandler(player, tps) {
    
    const velocity = player.getVelocity();
    const themecolor = config.themecolor;
    const tick = getScore(player, "currentTick", 0);

    /** Dev testing stuff */
    //player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §8Slime Bouncing: ${player.isSlimeBouncing() ? `§j(§8${player.getUpwardMotion() < player.getLastAvailableFallDistance() ? "§a" : "§c"}${player.getUpwardMotion().toFixed(4)}§j/§a${(player.getLastAvailableFallDistance() * 0.7).toFixed(4)}§j)` : "§cFalse"}`);
    //player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §8Trident Hovering: ${player.isTridentHovering() ? "§aTrue" : "§cFalse"}`);
    //if (player.getLastVelocity().y !== 0) player.sendMessage(`${themecolor}Debug §j> §8Y-Velocity: ${player.getVelocity().y < 0 ? "§c" : "§a"}${player.getVelocity().y}`);
    //if (player.getLastFallDistance() !== 0) player.sendMessage(`${themecolor}Debug §j> §8SFall Distance: ${player.getFallDistance()}`);
    
    // Speed, ticks, and y-velocity debug
    debug(player, "Speed", getSpeed(player), "speed");
    debug(player, "Ticks", `${tick <= 20 ? `§a` : `§c`}${tick}`, "ticks");
    debug(player, "YVelocity", velocity.y, "devvelocity");
    
    // TPS debug
    if (player.hasTag("tps")) {
        player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> Tps: §8${tps}`);
    }
    
    // Block raycast debug
    if (player.hasTag("devblockray")) {
        const blockOptions = {
            maxDistance: 8,
            includePassableBlocks: true
        };
        const blockResult = player.getBlockFromViewDirection(blockOptions);
        
        if (blockResult) {
            player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §aBlock: §8${blockResult.block.typeId}§a/§8${blockResult.block.location.x}, ${blockResult.block.location.y}, ${blockResult.block.location.z} §aFace: §8${blockResult.face}§a/§8${blockResult.faceLocation.x}, ${blockResult.faceLocation.y}, ${blockResult.faceLocation.z}`);
        } else {
            player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §cNo block was hit by the raycast!`);
        }
    }
    
    // Health debug
    if (player.hasTag("health")) {
        const health = player.getComponent("health");
        player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §8Health: ${health.currentValue < health.effectiveMax ? "§c" : "§a"}${health.currentValue}§8/§a${health.effectiveMax}`);
    }
}