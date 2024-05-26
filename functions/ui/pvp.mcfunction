tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=pvp, tag=op] add nopvp
tag @s[type=player, tag=nopvp, tag=op] remove pvp
tellraw @s[type=player, tag=nopvp, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cPvP is now disabled."}]}

tag @s[type=player, tag=!nopvp, tag=op] add pvp
tag @s[type=player, tag=nopvp, tag=op] remove nopvp
tellraw @s[type=player, tag=pvp, tag=!nopvp, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aPvP is now enabled."}]}