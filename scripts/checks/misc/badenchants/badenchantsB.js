import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if an enchantment has a negative or zero level, which is invalid.
 * @param {Minecraft.Player} player - The player being checked.
 * @param {Object} enchantment - The enchantment to validate.
 * @param {number} slot - The inventory slot where the enchantment is located.
 * @returns {boolean} True if the enchantment level is invalid; otherwise, false.
 */
export function badenchantsB(player, enchantment, slot) {

    if (!config.modules.badenchantsB.enabled) return false;
    
    const { type, level } = enchantment;

    // Check if the enchantment level is zero or negative.
    if (level <= 0) {
        flag(player, "BadEnchants", "B", "enchantment", `${type.id}, level=${level}, slot=${slot}`);
        return true;
    }

    return false;
}