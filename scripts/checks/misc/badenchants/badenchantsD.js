import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for duplicate enchantments within an item, which is not allowed.
 * @param {Minecraft.Player} player - The player being checked.
 * @param {Object} enchantment - The enchantment to validate.
 * @param {Array<string>} enchantments - A list of existing enchantments in the item to check for duplicates.
 * @param {number} slot - The inventory slot where the enchantment is located.
 * @returns {boolean} True if the enchantment is a duplicate; otherwise, false.
 */
export function badenchantsD(player, enchantment, enchantments, slot) {

    if (!config.modules.badenchantsD.enabled) return false;
    
    const typeId = enchantment.type.id;

    // Check if this enchantment type is already present on the item.
    if (enchantments.includes(typeId)) {
        flag(player, "BadEnchants", "D", "enchantments", `${enchantments.join(", ")}, slot=${slot}`);
        return true;
    }

    // Track this enchantment type to detect duplicates later.
    enchantments.push(typeId);

    return false;
}