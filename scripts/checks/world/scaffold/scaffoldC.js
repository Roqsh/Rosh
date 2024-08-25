import config from "../../../data/config.js";
import { flag } from "../../../util";

/**
 * Checks for not looking at the placed block.
 * @param {import("@minecraft/server").Player} player - The player to check.
 * @param {import("@minecraft/server").Block} block - The placed block.
 */
export function scaffold_c(player, block) {

    if (!config.modules.scaffoldC.enabled) return;

    let isChecked = false;

    const rotation = player.getRotation();

    const blockUnderPlayer = player.dimension.getBlock({
        x: Math.floor(player.location.x), 
        y: Math.floor(player.location.y) - 1, 
        z: Math.floor(player.location.z)
    });

    if (
        blockUnderPlayer.location.x === block.location.x && 
        blockUnderPlayer.location.y === block.location.y && 
        blockUnderPlayer.location.z === block.location.z
    ) { 
        if (rotation.x < 44) {
            flag(player, "Scaffold", "C", "xRot", rotation.x);
            isChecked = true;
        }  
    }

    if (
        !isChecked && 
        (player.location.y - 0.6) > block.location.y && 
        rotation.x < 0 && 
        !player.hasTag("riding") && 
        !player.isSwimming
    ) {           
        flag(player, "Scaffold", "C", "xRot", rotation.x);
        isChecked = true;
    }

    const distance = Math.sqrt(
        Math.pow(block.location.x - player.location.x, 2) + 
        Math.pow(block.location.z - player.location.z, 2)
    );

    const heightDifference = Math.abs(block.location.y - player.location.y);

    if (
        !isChecked &&
        !player.isFlying &&
        Math.abs(rotation.x) > 75 && 
        distance > 2.75 && 
        heightDifference < 2.1
    ) {
        flag(player, "Scaffold", "C", "distance", `${distance},xRot=${rotation.x}`);
    }

    isChecked = false;
}