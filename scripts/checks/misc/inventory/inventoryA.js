import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, debug } from "../../../util";

/**
 * Checks for a cursor item while sneaking or sprinting.
 * @param {Minecraft.Player} player - The player to check.
 */
export function inventoryA(player) {

    if (!config.modules.inventoryA.enabled) return;

    const currentCursorItem = player.getItemInCursor();
    const lastCursorItem = player.getLastItemInCursor();

    // Flag if the player is sneaking or sprinting while having a item in their cursor
    if (currentCursorItem && lastCursorItem && (player.isSneaking || player.isSprinting)) {
        flag(player, "Inventory", "A", "cursor item", `${currentCursorItem.typeId}`);
    }
}