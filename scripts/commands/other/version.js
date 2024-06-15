export function version(message) { 

    const player = message.sender; 

    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§uRosh §j> §aRosh is currently at §81.23 [Dev] §a!"}]}`);

}