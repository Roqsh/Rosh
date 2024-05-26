import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

export function report(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const reason = args.slice(1).join(" ") || "No reason specified";

    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to report.");
    
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");
    if(member.nameTag === player.nameTag) return player.sendMessage("§r§uRosh §j> §cYou cannot report yourself.");
    if(player.reports.includes(member.nameTag)) return player.sendMessage("§r§uRosh §j> §cYou have already reported this player.");

    player.reports.push(member.nameTag);
    player.sendMessage(`§r§uRosh §j> §aYou have reported §8${member.nameTag} §afor §8${reason}.`);
    
    member.addTag("reported");

    player.runCommandAsync(`tellraw @a[tag=notify, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §ahas reported §8${member.nameTag} §afor §8${reason}"}]}`);
}