/**
 * Manages player tags and scoreboard tracking based on player attributes and held items.
 * @param {Object} player - The player object.
 */
export async function tag_system(player) {
    try {
        // Add tags based on held items
        await Promise.all([
            player.runCommandAsync(`tag @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] add ender_pearl`),
            player.runCommandAsync(`tag @a[hasitem={item=bow,location=slot.weapon.mainhand}] add bow`)
        ]);

        // Update scoreboard values
        await Promise.all([
            player.runCommandAsync(`scoreboard players add @a[tag=right,scores={right=..1000}] right 1`),
            player.runCommandAsync(`scoreboard players add @a[tag=!moving,scores={last_move=..1000}] last_move 1`)
        ]);
    } catch (error) {
        console.error(`Error occurred in tag_system for player ${player.name}:`, error);
    }
}