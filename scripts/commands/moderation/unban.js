import data from "../../data/data.js";

export function unban(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to unban.");

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No Reason Provided";
    const member = args[0].replace(/"|\\/g, "");

    if(data.unbanQueue.includes(member)) return player.sendMessage(`§r§uRosh §j> §8${member} §cis already queued for an unban.`);

    data.unbanQueue.push(member.toLowerCase());
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §ahas added §8${member} §ato the unban queue for: §8${reason}§a."}]}`);
}