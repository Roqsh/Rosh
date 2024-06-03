import config from "../../../data/config";
import { flag } from "../../../util";

const data = new Map();

/**
 * Checks for invalid speed changes.
 * @name motion_e
 * @param {player} player - The player to check
 */
export function motion_e(player) {

    if (config.modules.motionE.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if (
            player.hasTag("trident") ||  
            player.hasTag("placing") ||
            player.hasTag("damaged") ||
            player.hasTag("elytra") ||
            player.hasTag("slime") ||
            player.isJumping || 
            player.isGliding
        ) return;

        if (data.has(player.name)) {

            const currentY = player.getVelocity().y;
            
            const dY1 = data.get(player.name)?.one;
            const dY2 = data.get(player.name)?.two;
            const dY3 = data.get(player.name)?.three;

            if (currentY !== 0 && dY1 !== 0 && dY2 !== 0 && dY3 !== 0) {

                const diff1 = Math.abs(currentY - dY1);
                const diff2 = Math.abs(currentY - dY2);

                const invalid = (
                    currentY < dY1 &&
                    dY2 < dY1 &&
                    diff1 > 0.2 &&
                    diff2 < 0.05
                );

                if(invalid) {
                    flag(player, "Motion", "E", "yVelocity", currentY, true);
                }
            }
        }
    }

    data.set(player.name, {
        one: player.getVelocity().y,
        two: data.get(player.name)?.one || 0,
        three: data.get(player.name)?.two || 0
    });
}