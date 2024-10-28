import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if an enchantment is not compatible with the item it is applied to.
 * @param {Minecraft.Player} player - The player being checked.
 * @param {Object} enchantment - The enchantment to validate.
 * @param {Object} item2Enchants - The enchantable component of the item being checked.
 * @param {number} slot - The inventory slot where the enchantment is located.
 * @returns {boolean} True if the enchantment is incompatible with the item; otherwise, false.
 */
export function badenchantsC(player, enchantment, item2Enchants, slot) {

    if (!config.modules.badenchantsC.enabled) return false;

    const { type, level } = enchantment;

    // Check if the item can legally have the enchantment.
    if (!item2Enchants.canAddEnchantment({ type, level: 1 })) {
        flag(player, "BadEnchants", "C", "enchantment", `${type.id}, level=${level}, slot=${slot}`);
        return true;
    }

    // Optional: add a level-1 version of the enchantment for validation against multiple protections.
    if (config.modules.badenchantsC.multi_protection) {
        item2Enchants.addEnchantment({ type, level: 1 });
    }

    return false;
}