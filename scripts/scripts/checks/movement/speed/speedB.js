import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

/**
 * @name speed_b
 * @param {player} player - The player to check
 * @remarks Checks for having sus velocities
*/

export function speed_b(player) {

    const playerSpeed = getSpeed(player);
    const playerVelocity = player.getVelocity();

    if(config.modules.speedB.enabled) {

        if(playerSpeed > 0.2 && !player.hasTag("damaged") && !player.hasTag("ice") && !player.hasTag("slime") && !player.isFlying && !player.hasTag("spec") && !player.hasTag("elytra")) {

            const yV = Math.abs(playerVelocity.y).toFixed(4);
            const prediction = yV === "0.1000" || yV === "0.6000" || yV === "0.8000" || yV === "0.9000" || yV === "0.0830" || yV === "0.2280" || yV === "0.3200" || yV === "0.2302" || yV === "0.0428" || yV === "0.1212" || yV === "0.0428" || yV === "1.1661" || yV === "1.0244" || yV === "0.3331";
            
            if(prediction) {
                flag(player, "Speed", "B", "yVelocity", playerVelocity.y, true);
            }
        }
    }
}