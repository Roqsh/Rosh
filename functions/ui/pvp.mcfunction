tag @s[type=player, tag=pvp] add nopvp
tag @s[type=player, tag=nopvp] remove pvp
tellraw @s[type=player, tag=nopvp] {"rawtext":[{"text":"§r§uRosh §j> §cPvP is now disabled."}]}

tag @s[type=player, tag=!nopvp] add pvp
tag @s[type=player, tag=nopvp] remove nopvp
tellraw @s[type=player, tag=pvp, tag=!nopvp] {"rawtext":[{"text":"§r§uRosh §j> §aPvP is now enabled."}]}