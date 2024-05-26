import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

export function deop(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    
    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to deop.");

    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0]?.toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");
    if(!member.hasTag("op")) return player.sendMessage("§r§uRosh §j> §cThis player doesnt have Rosh-Op.");

    removeOp(member);
    member.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.name} §chas removed §8${member.name}'s §cRosh-Op status"}]}`);
}

export function removeOp(player) {
    player.removeTag("op")
    player.sendMessage("§r§uRosh §j> §cYou have been de-opped! Warning: If this is wrong contact your server admin!");
}