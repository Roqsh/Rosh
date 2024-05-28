import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

const lastVelocity = new Map();

/**
 * @name speed_b
 * @param {player} player - The player to check
 * @remarks Checks for having rounded velocities
 */
export function speed_b(player) {

    const speed = getSpeed(player);
    const velocity = player.getVelocity();

    if (config.modules.speedB.enabled) {
 
        if (speed > 0.2) {

            const yVelocity = Math.abs(velocity.y);
            
            if (yVelocity !== 0) {

                const rounded = Number.isInteger(yVelocity);

                if (rounded) {
                    flag(player, "Speed", "B", "yVelocity", velocity.y, true);
                }
            }

            if (lastVelocity.has(player.name)) {

                const lastVel = lastVelocity.get(player.name);

                const velocityDiff = {
                    x: Math.abs(velocity.x - lastVel.x),
                    y: Math.abs(velocity.y - lastVel.y),
                    z: Math.abs(velocity.z - lastVel.z)
                };

                if (
                    velocityDiff["x"] === 0 || 
                    velocityDiff["y"] === 0 || 
                    velocityDiff["z"] === 0
                ) return;

                if (
                    Number.isInteger(velocityDiff["x"]) || 
                    Number.isInteger(velocityDiff["y"]) || 
                    Number.isInteger(velocityDiff["z"])
                ) {
                    flag(player, "Speed", "B", "velocityDiff", `${velocityDiff["x"]},${velocityDiff["y"]},${velocityDiff["z"]}`, false);
                }

            }

            lastVelocity.set(player.name, {
                x: velocity.x,
                y: velocity.y,
                z: velocity.z
            });
        }
    }
}