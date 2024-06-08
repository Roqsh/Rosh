import config from "../../../data/config.js";
import { flag, getSpeed } from "../../../util.js";

const lastUpdateTime = new Map();
const lastpos = new Map();

/**
 * Checks for not going to the predicted direction.
 * @name motion_d
 * @param {player} player - The player to check
 */
export function motion_d(player) {

    if (!config.modules.motionD.enabled || player.hasTag("riding")) return;

    const playerVelocity = player.getVelocity();
    const playerSpeed = getSpeed(player);
    const now = Date.now();

    if (lastUpdateTime.get(player.name) && !player.hasTag("stairs") && !player.isFlying) {

        let max_value = 45;

        const timeElapsed = now - lastUpdateTime.get(player.name);
        const lastPos = lastpos.get(player.name);

        const predictedX = lastPos.x + playerVelocity.x * timeElapsed / 1000.0;
        const predictedY = lastPos.y + playerVelocity.y * timeElapsed / 1000.0;
        const predictedZ = lastPos.z + playerVelocity.z * timeElapsed / 1000.0;

        const actualX = player.location.x;
        const actualY = player.location.y;
        const actualZ = player.location.z;

        if ((player.hasTag("damaged") && !player.hasTag("fall_damage"))) {
            max_value += 50;
        }

        if (player.isJumping) {
            max_value += 50;
        }

        const distance = Math.sqrt((predictedX - actualX) ** 2 + (predictedY - actualY) ** 2 + (predictedZ - actualZ) ** 2);

        if(playerSpeed !== 0 && (Math.abs(lastPos.x - actualX) + Math.abs(lastPos.z - actualZ)) / 2 < 5 && !player.hasTag("placing") && !player.hasTag("slime") && player.fallDistance < 3 && !player.getEffect("speed")) {
        
            if (distance > max_value * timeElapsed / 1000.0) {
                flag(player, "Motion", "D", "prediction-Diff", distance, true);
            }
        }
    }

    lastUpdateTime.set(player.name, Date.now());
    lastpos.set(player.name, {
        x: player.location.x, 
        y: player.location.y, 
        z: player.location.z
    });
}