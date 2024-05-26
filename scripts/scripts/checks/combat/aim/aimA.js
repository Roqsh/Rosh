import config from "../../../data/config.js";
import { flag, getScore, setScore } from "../../../util";

/**
 * @name aim_a
 * @param {player} player - The player to check
 * @remarks Checks for simple delta rotations [Beta]
*/

const data = new Map();

export function aim_a(player) {

    if(config.modules.aimA.enabled && data.has(player.name)) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        const rot = player.getRotation();

        const data_yaw = data.get(player.name).yaw;
        const data_pitch = data.get(player.name).pitch;

        if(data_yaw && data_pitch) {

            const deltaPitch = Math.abs(rot.x - data_pitch.one);
            const deltaYaw = Math.abs(rot.y - data_yaw.one);

            const deltaPitch2 = Math.abs(data_pitch.one - data_pitch.two);
            const deltaYaw2 = Math.abs(data_yaw.one - data_yaw.two);

            const yawAccel = Math.abs(deltaYaw - deltaYaw2);
            const pitchAccel = Math.abs(deltaPitch - deltaPitch2);

            if(deltaYaw == 0 && deltaPitch == 0) return;

            if(deltaPitch > 15 && config.modules.aimA.diff < 0.05 || deltaPitch < config.modules.aimA.diff && (deltaYaw > 15 && deltaYaw < 25 || deltaYaw > 250) && deltaYaw2 > 15 && deltaPitch2 < 0){
                setScore(player, "aim_a_buffer", getScore(player, "aim_a_buffer", 0) + 1);
            }

            if(player.hasTag("aim_debug")) player.sendMessage("§r§uDebug §j> Yaw: §8" + deltaYaw.toFixed(4) + " §jPitch: §8" + deltaPitch.toFixed(5));

            if(getScore(player, "aim_a_buffer", 0) > config.modules.aimA.buffer && Math.abs(rot.x) !== 90) {
                flag(player, "Aim", "A", "delta", `${deltaYaw},${deltaPitch}`);
                setScore(player, "aim_a_buffer", 0);
            }

            if(deltaYaw > 35 && yawAccel < 0.01) {
                flag(player, "Aim", "A-Beta", "yaw", `${deltaYaw},accel=${yawAccel}`);
            }
        }
    }

    data.set(player.name, {
        pitch: {
            one: player.getRotation().x,
            two: data.get(player.name)?.pitch.one || 0,
            three: data.get(player.name)?.pitch.two || 0
        },
        yaw: {
            one: player.getRotation().y,
            two: data.get(player.name)?.yaw_one || 0,
            three: data.get(player.name)?.yaw_two || 0
        }
    });
}