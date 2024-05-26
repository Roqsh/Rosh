import config from "../../../data/config.js";
import { flag, aroundAir, inAir } from "../../../util";

/**
 * @name jump_b
 * @param {player} player - The player to check
 * @remarks Checks for jumping in air [Beta]
*/

const lastH = new Map();

export function jump_b(player) {
    
    if(config.modules.invalidjumpB.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(inAir(player) === true && aroundAir(player) === true && player.isJumping && player.hasTag("jump") && !player.isOnGround && !player.hasTag("trident") && !player.getEffect("jump_boost") && !player.hasTag("slime") && !player.hasTag("damaged")) {

            const height = player.fallDistance;

            if(lastH.has(player.name) && height > lastH.get(player.name)?.h && height > config.modules.invalidjumpB.minheightDiff) {
                flag(player, "InvalidJump", "B", "airjump", `true,height=${height}`);
            }

            lastH.set(player.name, {h: height});
        }
    }
}