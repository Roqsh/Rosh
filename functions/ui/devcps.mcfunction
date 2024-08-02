tag @s[type=player, tag=cps] add nocps
tag @s[type=player, tag=nocps] remove cps
tellraw @s[type=player, tag=nocps] {"rawtext":[{"text":"§r§uRosh §j> §cCps will no longer be displayed."}]}

tag @s[type=player, tag=!nocps] add cps
tag @s[type=player, tag=nocps] remove nocps
tellraw @s[type=player, tag=cps, tag=!nocps] {"rawtext":[{"text":"§r§uRosh §j> §aCps will now be displayed."}]}