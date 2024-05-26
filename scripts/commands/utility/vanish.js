/**
 * @name vanish
 * @param {object} message - Message object
*/

export function vanish(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    if(player.hasTag("vanish")) {
        player.removeTag("vanish");
        player.setGameMode("creative");
        player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §cis no longer vanished."}]}`);
        player.sendMessage("§r§uRosh §j> §cYou are now no longer vanished.");

    } else {
        player.addTag("vanish");
        player.setGameMode("spectator");
        player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §ais now vanished."}]}`);
        player.sendMessage("§r§uRosh §j> §aYou are now vanished.");
    }
}
