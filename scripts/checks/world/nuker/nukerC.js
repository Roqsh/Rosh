import config from "../../../data/config.js";
import { flag } from "../../../util.js";
import { Block } from "../../../utils/Block.js";

/**
 * Checks for breaking a covered block. [Beta]
 * @param {player} player - The player to check
 * @param {block} block - The broken block
 * @param {object} blockBreak - The event object for block breaking
 * @param {object} Minecraft - The Minecraft game object
 * @remarks Non-solid blocks as cover false flag (example: flower), atm the check only applies to beds (updated later)
 */
export function nuker_c(player, block, blockBreak, Minecraft) {

    if (config.modules.nukerC.enabled) {

        const preset = config.preset?.toLowerCase();
        if (preset === "stable") return;
        
        let score = 0;
        
        const directions = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0}
        ];
        
        for (const dir of directions) {
            
            const pos = {
                x: block.location.x + dir.x,
                y: block.location.y + dir.y,
                z: block.location.z + dir.z
            };
            
            if (!Block.getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId !== "minecraft:air")) {
                score++;
            }
            
            if (Block.getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId === "minecraft:bed")) {

                let score2 = 0;
                
                for (const dir of directions) {
                    const newPos = {
                        x: pos.x + dir.x,
                        y: pos.y + dir.y,
                        z: pos.z + dir.z                    
                    };
                    
                    if (Block.getBlocksBetween(newPos, newPos).some((blk) => player.dimension.getBlock(blk)?.typeId === "minecraft:air")) {
                        score2++;
                    }
                }
                
                if (score2 === 0) {
                    score--;
                }
            }
        }
        
        if (score === config.modules.nukerC.score && block.typeId === "minecraft:bed") {

            blockBreak.cancel = true;

            Minecraft.system.run(() => {
                flag(player, "Nuker", "C", "block", `covered,type=${block.typeId}`);
            });
        }
    }
}