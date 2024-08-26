import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for not looking at the attacked entity
 * @name killaura_d
 * @param {Minecraft.Player} player - The player to check
 * @param {entity} entity - The attacked entity
 */
export function killaura_d(player, entity) {

    if (config.modules.killauraD.enabled) {
        
        const rotation = player.getRotation()
        const distance = Math.sqrt(
            Math.pow(entity.location.x - player.location.x, 2) + 
            Math.pow(entity.location.z - player.location.z, 2)
        );

        if (Math.abs(rotation.x) > 79 && distance > 2.25) {

            if (!player.isHoldingTrident && !player.hasTag("bow")) {
                flag(player, "Killaura", "D", "xRot", `${rotation.x},distance=${distance}`);
            }
        }
    }
}