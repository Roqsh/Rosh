export function spectate(message, args) {
    
    if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if (typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if (!args.length) {
        return player.sendMessage("§r§uRosh §j> §cYou need to provide who to spectate.");
    }

    const member = args[0].replace(/"|\\/g, "");

    player.runCommandAsync(`gamemode spectator @s`);
    player.runCommandAsync(`tp @s ${member}`);
    player.sendMessage(`§r§uRosh §j> §aYou are now spectating §8${member}§a!`);
}