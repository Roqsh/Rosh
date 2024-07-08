import config from "../../../data/config.js";
import { flag } from "../../../util";
import { EntityEquippableComponent, EquipmentSlot, ItemDurabilityComponent } from "@minecraft/server";
import { MinecraftItemTypes } from "../../../data/index.js";

/**
 * Checks for sending invalid glide "packets".
 * @name badpackets_j
 * @param {player} player - The player to check
 * @remarks Cheats used to send glide packets without having the needed permissions (Wearing an elytra),
 * resulting in a full movement disabler for BDS predictions making nearly all Rosh movement checks not functional.
*/
export function badpackets_j(player) {

    if (!config.modules.badpacketsJ.enabled) return;

    if (player.isGliding) {

        const elytra = player.getComponent(EntityEquippableComponent.componentId)?.getEquipment(EquipmentSlot.Chest);
		const durability = elytra?.getComponent(ItemDurabilityComponent.componentId);

        if (
            elytra?.typeId != MinecraftItemTypes.Elytra || 
            elytra?.typeId == MinecraftItemTypes.Elytra && 
            durability.maxDurability - durability.damage <= 0
        ) {
			flag(player, "BadPackets", "J", "invalid", "glide");
		}
    }
}