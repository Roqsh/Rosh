import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks if a players rotation exceeds the vanilla rotation limit.
 * @param {Minecraft.Player} player - The player to check.
 * @remarks 
 * **Note:** Because of silly mojang when enabling "Full Keyboard Gameplay"
 * in your settings and using arrow keys for rotation, you can exceed the 
 * games 90 pitch limit! See: https://bugs.mojang.com/browse/MCPE-177981
*/
export function badpackets_a(player) {

    if (!config.modules.badpacketsA.enabled) return;

    const rotation = player.getRotation();

    if (Math.abs(rotation.x) > 90 || Math.abs(rotation.y) > 180) {
        flag(player, "BadPackets", "A", "xRot", `${rotation.x},yRot=${rotation.y}`);
    }
}