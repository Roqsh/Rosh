import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util.js";

const lastUpdateTime = new Map();
const lastPos = new Map();

/**
 * Checks for discrepancies between predicted and actual motion.
 * @name motion_d
 * @param {player} player - The player to check
 */
export function motion_d(player) {

    if (!config.modules.motionD.enabled || player.hasTag("riding")) return;

    const playerVelocity = player.getVelocity();
    const playerSpeed = getSpeed(player);
    const now = Date.now();
    const playerName = player.name;

    const lastUpdate = lastUpdateTime.get(playerName);
    const lastPosition = lastPos.get(playerName);

    if (lastUpdate && !player.hasTag("stairs") && !player.isFlying) {

        let maxValue = 45;

        const timeElapsed = now - lastUpdate;
        
        if (lastPosition) {
            const predictedPosition = {
                x: lastPosition.x + playerVelocity.x * timeElapsed / 1000.0,
                y: lastPosition.y + playerVelocity.y * timeElapsed / 1000.0,
                z: lastPosition.z + playerVelocity.z * timeElapsed / 1000.0
            };

            const actualPosition = player.location;

            if (player.hasTag("damaged") && !player.hasTag("fall_damage")) {
                maxValue += 50;
            }

            if (player.isJumping) {
                maxValue += 50;
            }

            const distanceSquared = (predictedPosition.x - actualPosition.x) ** 2 + 
                                    (predictedPosition.y - actualPosition.y) ** 2 + 
                                    (predictedPosition.z - actualPosition.z) ** 2;

            const maxDistanceSquared = (maxValue * timeElapsed / 1000.0) ** 2;

            if (
                playerSpeed !== 0 && 
                !player.getEffect("speed") &&
                !player.hasTag("placing") && 
                !player.hasTag("slime")
            ) {
                if (distanceSquared > maxDistanceSquared) {
                    flag(player, "Motion", "D", "prediction-Diff", Math.sqrt(distanceSquared), true);
                }
            }
        }
    }

    lastUpdateTime.set(playerName, now);
    lastPos.set(playerName, {
        x: player.location.x, 
        y: player.location.y, 
        z: player.location.z
    });
}