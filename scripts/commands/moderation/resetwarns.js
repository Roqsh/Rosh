import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

export function resetwarns(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    const player = message.sender; 
    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who's warns to reset.");
    let member;
    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");
    if(member.id === player.id) return player.sendMessage("§r§uRosh §j> §cYou cannot reset your own warns.");

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §chas reset §8${member.nameTag}'s §cwarns!"}]}`);
    member.runCommandAsync("function tools/resetwarns");
}