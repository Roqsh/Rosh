tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=cps, tag=op] add nocps
tag @s[type=player, tag=nocps, tag=op] remove cps
tellraw @s[type=player, tag=nocps, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cCps will no longer be displayed."}]}

tag @s[type=player, tag=!nocps, tag=op] add cps
tag @s[type=player, tag=nocps, tag=op] remove nocps
tellraw @s[type=player, tag=cps, tag=!nocps, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aCps will now be displayed."}]}