import * as Minecraft from "@minecraft/server";
import { EntityEquippableComponent, EquipmentSlot, ItemDurabilityComponent } from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for invalid gliding. (Without a proper elytra)
 * @param {Minecraft.Player} player - The player to check.
 */
export function badpacketsJ(player) {

    if (!config.modules.badpacketsJ.enabled || !player.isGliding) return;

    const chestEquipment = player.getComponent(EntityEquippableComponent.componentId)?.getEquipment(EquipmentSlot.Chest);
    const durability = chestEquipment?.getComponent(ItemDurabilityComponent.componentId);
    const remaining = durability?.maxDurability - durability?.damage;
    
    if (chestEquipment?.typeId !== "minecraft:elytra") {
        flag(player, "BadPackets", "J", "invalid glide, chest-equipment", `${chestEquipment ? chestEquipment.typeId : "none"}`);
    }

    if (chestEquipment?.typeId === "minecraft:elytra" && remaining <= 0) {
        flag(player, "BadPackets", "J", "invalid glide, durability", `${remaining}/${durability.maxDurability}`);
    }
}