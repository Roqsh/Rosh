import config from "../../../data/config.js";
import { flag, getScore, setScore } from "../../../util";

const motion_c_map = new Map();

/**
 * Checks for not moving when having velocity
 * @name motion_c
 * @param {player} player - The player to check
 * @remarks Not working atm
 */
export function motion_c(player) {

    if(!config.modules.motionC.enabled || player.isOnGround || getScore(player, "tick_counter2", 0) <= 5) return;
    
    const motionData = motion_c_map.get(player.name);
    const currentPos = {x: player.location.x, y: player.location.y, z: player.location.z};
    const velocity = player.getVelocity();

    if(motionData && motionData.pos.x === currentPos.x && motionData.pos.y === currentPos.y && motionData.pos.z === currentPos.z && motionData.velocity.x !== 0 && velocity.x !== 0 && velocity.z !== 0 && motionData.velocity.z !== 0 && velocity.y === 0) {

        let minVelocity = config.modules.motionC.min_velocity;

        if(player.hasTag("placing")) {
            minVelocity += 3;
        }

        if(player.hasTag("gliding")) {
            minVelocity += 2;
        }

        if(player.hasTag("strict")) {
            minVelocity -= 1;
        }

        if(player.hasTag("swimming")) {
            return;
        }

        const hVelocity =  Math.abs(player.getVelocity().x - player.getVelocity().z);

        if(hVelocity > minVelocity) {

            setScore(player, "motion_c_data", getScore(player, "motion_c_data", 0) + 1);

            if(getScore(player, "motion_c_data", 0) > 5) {
                flag(player, "Motion", "C", "velocity", `X ${velocity.x} Y ${velocity.y} Z ${velocity.z}`, true);
            }
        }
    }

    motion_c_map.set(player.name, {velocity, pos: currentPos});
}