import { Player } from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore } from "../../../util";

/**
 * Checks for sprinting while using an item.
 * @param {Player} player - The player to check.
 */
export function sprintC(player) {

    if (!config.modules.invalidsprintC.enabled || !player.isSprinting || !player.hasTag("right")) return;

    // Get the player's inventory container and the currently selected item
    const selectedItem = player.getItemInHand();
    const ticks = getScore(player, "right", 0);

    // Flag the player if they are using an item while sprinting
    if (ticks > 5 && ticks < 30) {
        flag(player, "InvalidSprint", "C", "used item", `${selectedItem.typeId.replace("minecraft:", "")}, ticks=${ticks}`, true);
    }
}