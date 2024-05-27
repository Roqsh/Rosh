import * as Minecraft from "@minecraft/server";
import { parseTime } from "../../util.js";
import { animation } from "../../util.js";

const world = Minecraft.world;

/**
 * @name testban
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function testban(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§uRosh §j> §cYou need to provide who to ban.");

    const time = args[1] ? parseTime(args[1]) : undefined;

    if(!time) args.splice(1, 1);

    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }

    if(!member) return player.sendMessage("§r§uRosh §j> §cCouldn't find that player.");
    animation(member, "type1");
    animation(member, "type2");
    animation(member, "type3");
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8${player.nameTag} §chas banned §8${member.nameTag}"}]}`);
}