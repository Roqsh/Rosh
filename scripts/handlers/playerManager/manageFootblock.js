import * as Minecraft from "@minecraft/server";

/**
 * Manages player properties based on the block under the player's feet
 * for this current tick. (Runs before the main code)
 * @param {Minecraft.Player} player - The player which is being managed.
 */
export function manageFootblock(player) {

    player.lastGoodPosition ??= player.location;
    
    if (player.isOnGround) {
        player.lastGoodPosition = player.location;
    }

    const blockUnderPlayer = player.dimension.getBlock({
        x: player.location.x, 
        y: player.location.y - 1, 
        z: player.location.z
    });
    
    switch (true) {
        
        case blockUnderPlayer.typeId.includes("ice"):
            player.isOnIce = true;
            break;

        case blockUnderPlayer.typeId.includes("snow"):
            player.isOnSnow = true;
            break;
            
        case blockUnderPlayer.typeId.includes("stairs"):
            player.isOnStairs = true;
            break;
            
        case blockUnderPlayer.typeId.includes("shulker"):
            player.isOnShulker = true;
            break;

        case blockUnderPlayer.typeId.includes("soul_sand"):
            player.isOnSoulSand = true;
            break;

        case blockUnderPlayer.typeId.includes("slime"):
            player.touchedSlimeBlock = true;
            break;

        // Add more cases as needed
        default:
            // Optional: Handle the case where no match is found
            break;
    }
}