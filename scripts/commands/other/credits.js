export function credits(message) {

    const player = message.sender;

    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§uRosh §j> §aThanks to the team behind Rosh:\n§8Rosh§a/§8rqosh§a,\n§8NT AUTHORITY/hpwd§a/§8MrDiamond64§a,\n§8Dream23322§a/§84urxra§a,\n§8yellowworld777§a! <3"}]}`);
    
}