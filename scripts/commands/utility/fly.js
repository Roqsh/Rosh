import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

const world = Minecraft.world;

export function fly(message, args) {

    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;
    let member;
    
    for(const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0]?.toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl; 
        break;
    }
    
    if(!member) member = player;

    const checkGmc = world.getPlayers({
        excludeGameModes: [Minecraft.GameMode.creative, Minecraft.GameMode.spectator],
        name: member.name
    });

    if(![...checkGmc].length) return player.sendMessage(`§r${themecolor}Rosh §j> §cThis player is in creative which already allows flying by default.`);

    if(player.hasTag("flying")) {
        player.removeTag("flying");
        player.runCommandAsync("ability @s mayfly false");
        player.sendMessage(`§r${themecolor}Rosh §j> §cYou are now no longer in fly mode.`);
        
    } else {
        player.addTag("flying");
        player.runCommandAsync("ability @s mayfly true");
        player.sendMessage(`§r${themecolor}Rosh §j> §aYou are now in fly mode.`);
    }
}