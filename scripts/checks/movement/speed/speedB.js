import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

const lastVelocity = new Map();

/**
 * Checks for having rounded velocities.
 * @name speed_b
 * @param {player} player - The player to check
 * @remarks velocity.y is excluded due to false flags
 */
export function speed_b(player) {

    if (config.modules.speedB.enabled) {

        const speed = getSpeed(player);
        const velocity = player.getVelocity();
 
        if (speed > 0.1) {

            if (lastVelocity.has(player.name)) {

                const lastVel = lastVelocity.get(player.name);

                const velocityDiff = {
                    x: Math.abs(velocity.x - lastVel.x),
                    z: Math.abs(velocity.z - lastVel.z)
                };

                if (
                    velocityDiff["x"] === 0 ||  
                    velocityDiff["z"] === 0
                ) return;

                if (
                    Number.isInteger(velocityDiff["x"]) ||  
                    Number.isInteger(velocityDiff["z"])
                ) {
                    flag(player, "Speed", "B", "velocityDiff", `X:${velocityDiff["x"]}, Z:${velocityDiff["z"]}`);
                }

            }

            lastVelocity.set(player.name, {
                x: velocity.x,
                z: velocity.z
            });
        }
    }
}