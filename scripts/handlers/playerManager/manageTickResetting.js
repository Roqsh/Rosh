import * as Minecraft from "@minecraft/server";
import { getScore, setScore } from "../../util.js";

/**
 * Manages player properties that need to be reset. (Runs after the main code)
 * @param {Minecraft.Player} player - The player which is being managed.
 */
export function manageTickResetting(player) {

    // Update the player's last block under their feet
    player.isOnIce = false;
    player.isOnSnow = false;
    player.isOnStairs = false;
    player.isOnShulker = false;
    player.isOnSoulSand = false;

    // Remove tags every tick
    player.removeTag("attacking");
    player.removeTag("breaking");
    player.removeTag("placing");
    player.removeTag("itemUse");
    
    // Remove player properties every 20th tick (every second)
    if (getScore(player, "currentTick") >= 20) {
        player.lastTime = Date.now();
        player.clicks = 0;
        player.removeTag("damaged");
        player.removeTag("fall_damage");
        player.removeTag("ender_pearl");
        player.removeTag("bow");
        setScore(player, "packets", 0);

        setScore(player, "currentTick", 0); // Reset for new counting
    }
}