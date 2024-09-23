import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a player's rotation exceeds the vanilla rotation limit.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks
 * **Note:**
 * - Due to a quirk in Mojang's code, when enabling "Full Keyboard Gameplay"
 * in the settings and using arrow keys for rotation, players can exceed the
 * game's 90° pitch limit! See: https://bugs.mojang.com/browse/MCPE-177981
 */
export function aimA(player) {

    if (!config.modules.aimA.enabled) return;

    const pitch = player.getPitch();
    const yaw = player.getYaw();

    if (Math.abs(pitch) > 90) {
        flag(player, "Aim", "A", "pitch", pitch);
    }

    if (Math.abs(yaw) > 180) {
        flag(player, "Aim", "A", "yaw", yaw);
    }
}

