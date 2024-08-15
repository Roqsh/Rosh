/**
 * Manages player tags and scoreboard tracking based on player attributes and held items.
 * @param {Object} player - The player object.
 */
export async function tag_system(player) {
    try {
        // Add tags based on held items
        await Promise.all([
            player.runCommandAsync(`tag @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] add ender_pearl`),
            player.runCommandAsync(`tag @a[hasitem={item=trident,location=slot.weapon.mainhand}] add trident`),
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



/**
 * Sets the title, subtitle, and actionbar for a player.
 * @param {Object} player - The player object.
 * @param {string|null} [title=null] - The main title to display. If null, no title is displayed.
 * @param {string|null} [subtitle=null] - The subtitle to display. If null, no subtitle is displayed.
 * @param {string|null} [actionbar=null] - The actionbar message to display. If null, no actionbar message is displayed.
 * @returns {Promise<void>} A promise that resolves when all commands have been executed.
 */
export async function setTitle(player, title = null, subtitle = null, actionbar = null) {
    try {
        const commands = [];

        // Add the title command if a title is provided
        if (title) {
            commands.push(`title "${player.name}" title ${title}`);
        }

        // Add the subtitle command if a subtitle is provided
        if (subtitle) {
            commands.push(`title "${player.name}" subtitle ${subtitle}`);
        }

        // Add the actionbar command if an actionbar message is provided
        if (actionbar) {
            commands.push(`title "${player.name}" actionbar ${actionbar}`);
        }

        // Execute all collected commands in parallel if there are any
        if (commands.length > 0) {
            await Promise.all(commands.map(command => player.runCommandAsync(command)));
        }
    } catch (error) {
        // Log an error message if command execution fails
        console.error(`Failed to set titles for player ${player.name}:`, error);
    }
}



/**
 * Sets a particle effect at the player's location in Minecraft.
 * @param {Object} player - The player object.
 * @param {string} particleName - The name of the particle effect to display.
 * @returns {Promise<void>} A promise that resolves when the command has been executed.
 */
export function setParticle(player, particleName) {
    // Return if the particle is not given
    if (!particleName) {
        console.error('Particle name must be provided');
        return;
    }

    // Create the location to spawn the particle
    const location = {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
    };

    try {
        // Execute the particle command at the player's location
        player.spawnParticle(`minecraft:${animation}`, location);
    } catch (error) {
        // Log an error message if the command execution fails
        console.error(`Failed to set particle effect for player ${player.name}:`, error);
    }
}



/**
 * Kicks a player from the game with a specified reason.
 * @param {Object} player - The player object.
 * @param {string} reason - The reason for kicking the player.
 * @returns {Promise<void>} A promise that resolves when the command has been executed.
 */
export async function kick(player, reason) {
    // Return if the reason is not given
    if (!reason) {
        console.error('Kick reason must be provided');
        return;
    }

    try {
        // Execute the kick command with the provided reason
        await player.runCommandAsync(`kick "${player.name}" ${reason}`);
    } catch (error) {
        // Log an error message if the command execution fails
        console.error(`Failed to kick player ${player.name}:`, error);
    }
}