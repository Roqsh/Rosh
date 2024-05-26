import config from "../../../data/config.js";
import { flag } from "../../../util";
import { EntityEquippableComponent, EquipmentSlot, ItemDurabilityComponent } from "@minecraft/server";
import { MinecraftItemTypes } from "../../../data/index.js";

/**
 * @name badpackets_j
 * @param {player} player - The player to check
 * @remarks Checks for sending invalid glide "packets"
*/

export function badpackets_j(player) {

    if(config.modules.badpacketsJ.enabled) {

        if(player.isGliding) {

            const elytra = player.getComponent(EntityEquippableComponent.componentId)?.getEquipment(EquipmentSlot.Chest);
			const durability = elytra?.getComponent(ItemDurabilityComponent.componentId);

            if(elytra?.typeId != MinecraftItemTypes.Elytra || (elytra?.typeId == MinecraftItemTypes.Elytra && durability.maxDurability - durability.damage <= 1)) {
				flag(player, "BadPackets", "J", "invalid", "glide");
			}

        }
    }
}