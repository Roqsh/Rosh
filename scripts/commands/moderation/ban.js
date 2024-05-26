import * as Minecraft from "@minecraft/server";
import { parseTime, config } from "../../util.js";

const world = Minecraft.world;

export function ban(message, args) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const themecolor = config.themecolor;
    const player = message.sender;

    if(!args.length) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who to ban.`);

    const time = args[1] ? parseTime(args[1]) : undefined;

    if(!time) args.splice(1, 1);

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);

    if(member.id === player.id) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban yourself.`);
   
    if(member.hasTag("op")) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou cannot ban other staff members.`);
  
    member.getTags().forEach(t => {
        if(t.includes("reason:") || t.includes("by:") || t.includes("time:")) member.removeTag(t);
    });

    member.addTag(`reason:${reason}`);
    member.addTag(`by:${player.nameTag}`);
    if(typeof time === "number") member.addTag(`time:${Date.now() + time}`);
    member.addTag("isBanned");

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas banned §8${member.nameTag} §cfor §8${reason}"}]}`);
}