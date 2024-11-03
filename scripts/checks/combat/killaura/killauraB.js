import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getScore, debug } from "../../../util";

/**
 * Checks for invalid attacks.
 * @param {Minecraft.Player} player - The player being monitored.
 * @param {Minecraft.Entity} entity - The entity being attacked by the player.
 */
export function killauraB(player, entity) {

    if (!config.modules.killauraB.enabled) return;

    // If the target is a player, get their name.
    const targetName = entity.isPlayer() ? `, target=${entity.name}` : `, target=${entity.typeId.replace("minecraft:", "")}`;

    // Get the player's inventory container and the currently selected item
    const selectedItem = player.getItemInHand();
    const ticks = getScore(player, "right");

    // Flag the player if they are using an item while attacking
    if (player.hasTag("right")) {
        flag(player, "Killaura", "B", "used item", `${selectedItem.typeId}, ticks=${ticks}${targetName}`);
    }

    // Get the type ID of the attacked entity
    const entityId = entity.typeId;

    // Log the entity type for debugging purposes
    debug(player, "Entity", entityId, "id");

    // Define a set of invalid entity types that should not be attacked
    const invalidEntities = new Set([
        "minecraft:item",
        "minecraft:xp_orb",
        "minecraft:xp_bottle",
        "minecraft:splash_potion",
        "minecraft:lingering_potion",
        "minecraft:snowball",
        "minecraft:egg",
        "minecraft:arrow",
        "minecraft:wind_charge_projectile",
        "minecraft:area_effect_cloud",
        "minecraft:ender_pearl",
        "minecraft:eye_of_ender_signal",
        "minecraft:fireworks_rocket",
        "minecraft:tnt",
        "minecraft:falling_block",
        "minecraft:fishing_hook"
    ]);

    // Flag the player if they attacked an invalid entity
    if (invalidEntities.has(entityId)) {
        flag(player, "Killaura", "B", "invalid-entity", `${entityId}`);
    }

    if (player.isSleeping) {
        flag(player, "Killaura", "B", "sleeping", `true${targetName}`);
    }

    if (player.isDead()) {
        flag(player, "Killaura", "B", "dead", `true${targetName}`);
    }
}