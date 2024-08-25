import config from "../../../data/config.js";
import { flag, aroundAir } from "../../../util";

/**
 * Checks for going up more than whats possible in vanilla.
 * @name fly_a
 * @param {player} player - The player to check
 * @remarks Some scenarios are not handled yet (crystals, tnt, etc.)
 */
export function fly_a(player) {

    if (config.modules.flyA.enabled) {

        const velocity = player.getVelocity();
        
        if (aroundAir(player) && !player.isGliding) {
            
            let max_v_up = 0.62;

            if (player.isJumping) max_v_up = 0.8;
            if (player.getEffect("jump_boost")) max_v_up += player.getEffect("jump_boost").amplifier * 1.5 + 0.1;
            if (player.hasTag("placing")) max_v_up += 6;
            if (player.hasTag("damaged")) max_v_up += 4;
            if (player.hasTag("elytra")) max_v_up += 20;

            if (velocity.y > max_v_up) flag(player, "Fly", "A", "yVelocity", `${velocity.y},maxup=${max_v_up}`);
        }  
    }
}