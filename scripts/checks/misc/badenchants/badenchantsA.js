import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if an enchantment exceeds its maximum allowed level.
 * @param {Minecraft.Player} player - The player being checked.
 * @param {Object} enchantment - The enchantment to validate.
 * @param {number} slot - The inventory slot where the enchantment is located.
 * @returns {boolean} True if the enchantment level is too high; otherwise, false.
 */
export function badenchantsA(player, enchantment, slot) {

    if (!config.modules.badenchantsA.enabled) return false;
    
    const { type, level } = enchantment;
    const maxLevel = config.modules.badenchantsA.levelExclusions[type] ?? type.maxLevel;

    // Check if the enchantment level is above the allowed maximum.
    if (level > maxLevel) {
        flag(player, "BadEnchants", "A", "enchantment", `${type.id}, level=${level}, slot=${slot}`);
        return true;
    }

    return false;
}