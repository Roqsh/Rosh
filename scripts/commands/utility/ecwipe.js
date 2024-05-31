import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

const world = Minecraft.world;

/**
 * @name ecwipe
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function ecwipe(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;
    
    if(!args.length) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide who's ender chest inventory to wipe.`);
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);

    for(let i = 0; i < 27; i++) {
        member.runCommandAsync(`replaceitem entity @s slot.enderchest ${i} air`);
    }

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.nameTag} §chas cleared §8${member.nameTag}'s §cenderchest."}]}`);
}
