export function tag_system(player) {
    player.runCommandAsync(`tag @a[m=!c] remove gmc`);
    player.runCommandAsync(`tag @a[m=!s] remove gms`);
    player.runCommandAsync(`tag @a[m=!a] remove gma`);
    player.runCommandAsync(`tag @a[m=!spectator] remove spec`);

    player.runCommandAsync(`tag @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] add ender_pearl`);
    player.runCommandAsync(`tag @a[hasitem={item=trident,location=slot.weapon.mainhand}] add trident`);
    player.runCommandAsync(`tag @a[hasitem={item=bow,location=slot.weapon.mainhand}] add bow`);
    player.runCommandAsync(`tag @a[m=c] add gmc`);
    player.runCommandAsync(`tag @a[m=s] add gms`);
    player.runCommandAsync(`tag @a[m=a] add gma`);
    player.runCommandAsync(`tag @a[m=spectator] add spec`);

    player.runCommandAsync(`scoreboard players add @a[tag=right,scores={right=..1000}] right 1`);
    player.runCommandAsync(`scoreboard players add @a[tag=!moving,scores={last_move=..1000}] last_move 1`);
}


export function setTitle(player, title, subtitle, actionbar) {
    // Set the title if it exists
    if (title !== undefined) {
        player.runCommandAsync(`title "${player.name}" title ${title}`);
    }

    // Set the subtitle if it exists
    if (subtitle !== undefined) {
        player.runCommandAsync(`title "${player.name}" subtitle ${subtitle}`);
    }

    // Set the actionbar if it exists
    if (actionbar !== undefined) {
        player.runCommandAsync(`title "${player.name}" actionbar ${actionbar}`);
    }
}


export function setParticle(player, particleName) {
    player.runCommandAsync(`particle minecraft:${particleName} ~ ~ ~`);
}


export function getHealth(player) {
    const healthComponent = player.getComponent("minecraft:health");
    return healthComponent;
}


export function kick(player, reason) {
    player.runCommandAsync(`kick "${player.name}" ${reason}`);
}