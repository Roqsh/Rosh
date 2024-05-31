import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

/**
 * @name tag
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 * @remarks Changes the tag infront of the player nametag
*/

const world = Minecraft.world;

export function tag(message, args) {

    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    const themecolor = config.themecolor;

    if(!args.length) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a tag to add.`);

    let member;

    for(const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        args.shift();
        break;
    }

    if(!member) member = player;

    if(!args[0]) return player.sendMessage(`§r${themecolor}Rosh §j> §cYou need to provide a tag to add.`);

    if(args[0].includes("reset")) {
        
        member.getTags().forEach(t => {
            if(t.replace(/"|\\/g, "").startsWith("tag:")) member.removeTag(t);
        });

        member.nameTag = member.name;
        return player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §chas reset §8${member.name}'s §cnametag."}]}`);
    }

    const tag = args.join(" ").replace(/"|\\/g, "");
    const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;

    const nametag = `${borderColor}[§r${mainColor}${tag}§r${borderColor}]§r ${playerNameColor}${member.name}§r`.replace(/"|\\/g, "");

    member.nameTag = nametag;

    member.getTags().forEach(t => {
        if(t.replace(/"|\\/g, "").startsWith("tag:")) member.removeTag(t);
    });

    member.addTag(`tag:${tag}`);

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §8${player.name} §ahas changed §8${member.name}'s §anametag to §8${nametag}§a."}]}`);
}