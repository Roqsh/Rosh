import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a player's selected slot is vanilla reachable.
 * @name badpackets_b
 * @param {player} player - The player to check
 * @remarks The handler for a player's hotbar packet runs the function
 * PlayerInventory::selectSlot, which already checks for invalid slots.
 * (Therefore, there is no need for this to be enabled unless Mojang 
 * unexpectedly changes something.)
 */
export function badpackets_b(player) {

    if (!config.modules.badpacketsB.enabled) return;

    const slot = player.selectedSlotIndex;

    if (
        slot < 0 || 
        slot > 8
    ) {
        flag(player, "BadPackets", "B", "slot", `${slot}`);
        player.selectedSlotIndex = slot < 0 ? 0 : 8;
    }
}