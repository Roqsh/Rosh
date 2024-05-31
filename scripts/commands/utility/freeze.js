import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

const world = Minecraft.world;

/**
 * @name freeze
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
*/

export function freeze(message, args) {
   
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;
    
    if(!args.length) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide which target to freeze.`);
    
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);
   
    member.runCommandAsync("function tools/freeze");
}