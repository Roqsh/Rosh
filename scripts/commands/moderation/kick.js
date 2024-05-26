import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

export function kick(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to kick.");

    let isSilent = false;

    if(args[1] === "-s" || args[1] === "-silent") isSilent = true;

    const reason = args.slice(1).join(" ").replace(/-s|-silent/, "").replace(/"|\\/g, "") || "No reason specified";	
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");
    if(member.id === player.id) return player.sendMessage("§r§uRosh §j> §cYou cannot kick yourself.");
    if(!isSilent) player.runCommandAsync(`kick "${member.name}" ${reason}`);
    
    member.triggerEvent("scythe:kick");
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §chas kicked §8${member.name} ${isSilent ? "§cSilent ": ""}for §8${reason}"}]}`);
}
