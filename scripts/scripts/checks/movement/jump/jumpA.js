import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * @name jump_a
 * @param {player} player - The player to check
 * @remarks Checks for jumping too high [Beta]
*/

const lastHeight = new Map();

export function jump_a(player) {
    
    if(config.modules.invalidjumpA.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        const height = player.fallDistance;

        if(player.isJumping && player.hasTag("jump") && !player.isOnGround && !player.hasTag("trident") && !player.getEffect("jump_boost") && !player.hasTag("slime") && !player.hasTag("damaged")) {

            if(lastHeight.has(player.name) && height < lastHeight.get(player.name)?.l && height >= config.modules.invalidjumpA.height) {
                flag(player, "InvalidJump", "A", "height", height);
            }

            lastHeight.set(player.name, {l: height});
        }
    }
}