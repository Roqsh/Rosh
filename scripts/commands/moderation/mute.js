import * as Minecraft from "@minecraft/server";
import { banAnimation  } from "../../util";
const world = Minecraft.world;

export function mute(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to mute.");

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");

    if(member.id === player.id) return player.sendMessage("§r§uRosh §j> §cYou cannot mute yourself.");

    member.addTag("isMuted");
    member.sendMessage(`§r§uRosh §j> §cYou have been muted for §8${reason}`);

    member.runCommandAsync("ability @s mute true");

    banAnimation(player, "type2");
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §chas muted §8${member.nameTag} §cfor §8${reason}"}]}`);
}