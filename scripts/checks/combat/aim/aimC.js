import config from "../../../data/config.js";
import { flag, getScore, setScore } from "../../../util";

/**
 * @name aim_c
 * @param {player} player - The player to check
 * @remarks Checks for head snaps [Beta]
*/

const data = new Map();

export function aim_c(player) {

    if(config.modules.aimC.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        const rot = player.getRotation();

        if(data.has(player.name)) {

            const pitchData = data.get(player.name).pitch;
            const yawData = data.get(player.name).yaw;
            const bufferVal = getScore(player, "aim_c_buffer", 0);

            if(pitchData && yawData) {

                const deltaPitch = Math.abs(rot.x - pitchData.one);
                const deltaYaw = Math.abs(rot.y - yawData.one);

                const lastDeltaPitch = Math.abs(pitchData.one - pitchData.two);
                const lastDeltaYaw = Math.abs(yawData.one - yawData.two);
                
                const lastLastDeltaPitch = Math.abs(pitchData.two - pitchData.three);
                const lastLastDeltaYaw = Math.abs(yawData.two - yawData.three);

                if(
                    deltaYaw < 1.5 &&
                    lastDeltaYaw > 50 &&
                    lastLastDeltaYaw < 1.5 ||
                    deltaPitch < 1.5 &&
                    lastDeltaPitch > 50 &&
                    lastLastDeltaPitch < 1.5 && 
                    Math.abs(deltaPitch) > 60
                ) {
                    setScore(player, "aim_c_buffer", bufferVal + 1);
                }

                if(getScore(player, "aim_c_buffer", 0) > config.modules.aimC.buffer) {
                    flag(player, "Aim", "C", "Accel", `${deltaYaw},${deltaPitch}`);
                    setScore(player, "aim_c_buffer", 0);
                }
            }
        }

        data.set(player.name, {
            pitch: {
                one: rot.x,
                two: data.get(player.name)?.pitch?.one,
                three: data.get(player.name)?.pitch?.two,
                four: data.get(player.name)?.pitch?.three
            },
            yaw: {
                one: rot.y,
                two: data.get(player.name)?.yaw?.one,
                three: data.get(player.name)?.yaw?.two,
                four: data.get(player.name)?.yaw?.three
            }
        });
    }
}