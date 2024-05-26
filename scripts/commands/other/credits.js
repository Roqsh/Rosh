export function credits(message) {

    const player = message.sender;

    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§uRosh §j> §aThanks to the team behind Rosh:\n§8"Rosh §a/ §8rqosh§8,\n§8NT AUTHORITY/hpwd §a/ §8MrDiamond64§a,\n§8Dream23322 §a/ §84urxra§a,\n§8yellowworld777§a! <3}]}`);
    
}