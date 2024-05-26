import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";

const world = Minecraft.world;


export function reportGui(player) {
    
    player.playSound("mob.chicken.plop");

    const allPlayers = world.getPlayers();

    const menu = new MinecraftUI.ActionFormData()
		.title("Report Menu")
		
    for(const plr of allPlayers) {
        let playerName = `${plr.name}`;
        if(plr.id === player.id) playerName += " §8[You]";
        menu.button(playerName);
    }     
    menu.show(player).then(cheatType(player));
}

function cheatType(player) {
    
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Cheat Type")
        .button("Combat")
        .button("Movement")
        .button("Other")
        .button("Back");
    
    menu.show(player).then((response) => {
        if(response.selection === 0) combatType(player);
        if(response.selection === 1) movementType(player);
        if(response.selection === 2) otherType(player);
        if(response.selection === 3 || response.canceled) reportGui(player);
    });
}

function combatType(player) {

    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Combat Type")
        .button("KillAura")
        .button("Reach")
        .button("Hitbox")
        .button("Aim")
        .button("Velocity")
        .button("Back");

    menu.show(player).then((response) => {
        if(response.selection === 0)
        if(response.selection === 1)
        if(response.selection === 2)
        if(response.selection === 3)
        if(response.selection === 4)
        if(response.selection === 5)
        if(response.selection === 6 || response.canceled) cheatType(player);
    });
}

function movementType(player) {

    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Combat Type")
        .button("Fly")
        .button("Speed")
        .button("Phase")
        .button("Teleport")
        .button("Back");

    menu.show(player).then((response) => {
        if(response.selection === 0)
        if(response.selection === 1)
        if(response.selection === 2)
        if(response.selection === 3)
        if(response.selection === 4)
        if(response.selection === 5 || response.canceled) cheatType(player);
    });
}

function otherType(player) {

    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Combat Type")
        .button("Spam")
        .button("Teaming")
        .button("Skin")
        .button("Name")
        .button("Back");

    menu.show(player).then((response) => {
        if(response.selection === 0)
        if(response.selection === 1)
        if(response.selection === 2)
        if(response.selection === 3)
        if(response.selection === 4)
        if(response.selection === 5 || response.canceled) cheatType(player);
    });
}