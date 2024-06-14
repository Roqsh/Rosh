import * as Minecraft from "@minecraft/server";
import { parseTime } from "../../util.js";
import data from "../../data/data.js";
import config from "../../data/config.js";

const world = Minecraft.world;

export function ban(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    let themecolor = config.themecolor;

    if(!args.length) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to ban.`);

    const time = args[1] ? parseTime(args[1]) : undefined;

    if(!time) args.splice(1, 1);

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "");
    
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);

    if(member.id === player.id) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban yourself.`);
   
    if(member.hasTag("op")) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban other staff members.`);
  
    member.getTags().forEach(t => {
        if(t.includes("Reason:") || t.includes("Length:")) member.removeTag(t);
    });

    member.addTag(`Reason:${reason}`);
    if(typeof time === "number") member.addTag(`Length:${Date.now() + time}`);
    member.addTag("isBanned");

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas banned §8${member.nameTag} §cfor §8${reason}"}]}`);
    data.recentLogs.push(`§8${member.nameTag} §chas been banned by §8${player.name}§c!`);
}