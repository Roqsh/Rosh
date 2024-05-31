import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

const world = Minecraft.world;

/**
 * @name cloneinv
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function cloneinv(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    if(!args.length) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide whos inventory to view.`);
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that player.`);

    const playerInv = player.getComponent('inventory').container;
    const memberInv = member.getComponent('inventory').container;

    for (let i = 0; i < memberInv.size; i++) {
        const item = memberInv.getItem(i);
        if(!item) {
            playerInv.setItem(i, undefined);
            continue;
        }

        playerInv.setItem(i, item);
    }

    player.sendMessage(`§r${themecolor}Rosh §j> §aYou have cloned §8${member.name}'s §aInventory.`);
}
