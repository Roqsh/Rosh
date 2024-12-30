import * as Minecraft from "@minecraft/server";
import data from "../../data/data.js";
import config from "../../data/config.js";
import { getScore, setScore, calculateFallDistance, calculateUpwardMotion } from "../../util.js";

/**
 * Manages general player properties for this current tick. (Runs before the main code)
 * @param {Minecraft.Player} player - The player which is being managed.
 */
export function manageCurrentTick(player) {
    
    // FallDistance and UpwardMotion handling
    const fallDistance = calculateFallDistance(player);
    const upwardMotion = calculateUpwardMotion(player);

    player.setFallDistance(fallDistance);
    player.setUpwardMotion(upwardMotion);
    
    if (fallDistance !== 0) {
        player.setLastAvailableFallDistance(fallDistance); // Used for Fly/A
    }
    
    // Normal Trident and Riptide Trident handling
    if (player.getItemInHand()?.typeId === "minecraft:trident") {
        player.isHoldingTrident = true;
        const itemEnchants = player.getItemInHand().getComponent("enchantable")?.getEnchantments() ?? [];

        for (const enchantment of itemEnchants) {
            if (enchantment.type.id === "riptide") {
                player.isHoldingRiptideTrident = true;
            }
        }

    } else {
        player.isHoldingTrident = false;
        player.isHoldingRiptideTrident = false;
    }
    
    // Rosh strict mode handling
    if ((getScore(player, "kickvl", 0) > config.kicksBeforeBan / 2) || data.warnings[player.id] === 2) { // TODO: Integrate if a player has been reported twice
        if (!player.hasTag("strict")) {
            player.addTag("strict");
        }
    }

    // Timing stuff
    player.ticksSinceFlight ??= 0;
    player.ticksSinceGlide ??= 0;
    player.ticksSinceJump ??= 0;

    if (player.isFlying) {
        player.ticksSinceFlight = 0;
    } else {
        player.ticksSinceFlight++;
    }

    if (player.isGliding) {
        player.ticksSinceGlide = 0;
    } else {
        player.ticksSinceGlide++;
    }

    if (player.isJumping) {
        player.ticksSinceJump = 0;
    } else {
        player.ticksSinceJump++;
    }

    // Other
    player.runCommand(`tag @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] add ender_pearl`);
    player.runCommand(`tag @a[hasitem={item=bow,location=slot.weapon.mainhand}] add bow`);
    player.runCommand(`scoreboard players add @a[tag=right,scores={right=..1000}] right 1`);
    setScore(player, "currentTick", getScore(player, "currentTick", 0) + 1);
}