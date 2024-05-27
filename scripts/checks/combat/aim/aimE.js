import config from "../../../data/config.js";
import { flag, debug } from "../../../util";
import { gcd, EXPANDER } from "../../../utils/mathUtil";

/**
 * @name aim_e
 * @param {player} player - The player to check
 * @remarks Checks for a valid sensitivity in the rotation [Beta]
*/

const data = new Map();

export function aim_e(player) {

    if(config.modules.aimE.enabled) {

        const preset = config.preset?.toLowerCase();
        if(preset === "stable") return;

        if(data.get(player.name)) { 

            const deltaPitch = Math.abs(player.getRotation().x - data.get(player.name).one);
            const lastDeltaPitch = Math.abs(data.get(player.name).one - data.get(player.name).two);

            if(deltaPitch !== 0 && lastDeltaPitch !== 0) {

                const expandedDeltaPitch = (deltaPitch * EXPANDER);
                const expandedLastDeltaPitch = (lastDeltaPitch * EXPANDER);
                const Gcd = gcd(expandedDeltaPitch, expandedLastDeltaPitch);

                debug(player, `GCD: ${Gcd}, EXPAND1: ${expandedDeltaPitch}, EXPAND2: ${expandedLastDeltaPitch}`, "aim-e");

                if(Gcd < 1311072) flag(player, "Aim", "E", "gcd", `${Gcd}`);
            }
        }

        data.set(player.name, {
            one: player.getRotation().x,
            two: data.get(player.name)?.one || 0
        });
    }
}