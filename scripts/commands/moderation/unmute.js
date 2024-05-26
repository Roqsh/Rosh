import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

export function unmute(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to unmute.");

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    let member;
    for(const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");

    member.removeTag("isMuted");
    member.sendMessage("§r§uRosh §j> §aYou have been unmuted.");
    member.runCommandAsync("ability @s mute false");
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §ahas unmuted §8${member.nameTag} §afor §8${reason}"}]}`);
}