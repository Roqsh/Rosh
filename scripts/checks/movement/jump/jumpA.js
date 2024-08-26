import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

const lastHeight = new Map();

/**
 * @name jump_a
 * @param {Minecraft.Player} player - The player to check
 * @remarks Checks for jumping too high [Beta]
 */
export function jump_a(player) {
    
    if(config.modules.invalidjumpA.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        const height = player.fallDistance;

        if(player.isJumping && !player.isOnGround && !player.isHoldingTrident && !player.getEffect("jump_boost") && !player.isOnSlime && !player.hasTag("damaged")) {

            if(lastHeight.has(player.name) && height < lastHeight.get(player.name)?.l && height >= config.modules.invalidjumpA.height) {
                flag(player, "InvalidJump", "A", "height", height);
            }

            lastHeight.set(player.name, {l: height});
        }
    }
}