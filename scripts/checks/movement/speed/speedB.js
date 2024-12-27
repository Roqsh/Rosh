// Probably removed/replaced soon

import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util";

const lastVelocity = new Map();

/**
 * Checks for having rounded velocities.
 * @param {Minecraft.Player} player - The player to check
 * @remarks
 * velocityDiff["x"] === 1 and velocityDiff["z"] === 1 are excluded due
 * to boats setting you 1 block to the side when leaving.
 */
export function speed_b(player) {

    if (config.modules.speedB.enabled && !player.isSlimeBouncing()) {

        const speed = getSpeed(player);
        const velocity = player.getVelocity();
 
        if (speed > 0.1) {

            const velocityToFixed = Math.abs(velocity.y).toFixed(4);

            if (
                velocityToFixed !== "0.0000" &&
                velocityToFixed !== "0.2000" &&
                velocityToFixed % 0.1 === 0
            ) {
                flag(player, "Speed", "B", "velocityToFixed", velocityToFixed);
            }

            if (lastVelocity.has(player.name)) {

                const lastVel = lastVelocity.get(player.name);

                const velocityDiff = {
                    x: Math.abs(velocity.x - lastVel.x),
                    z: Math.abs(velocity.z - lastVel.z)
                };

                if (
                    velocityDiff["x"] === 0 ||
                    velocityDiff["x"] === 1 ||
                    velocityDiff["z"] === 0 ||
                    velocityDiff["z"] === 1
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