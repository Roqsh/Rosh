tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=devtick, tag=op] add nodevtick
tag @s[type=player, tag=nodevtick, tag=op] remove devtick
tellraw @s[type=player, tag=nodevtick, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cTicks will no longer be displayed."}]}

tag @s[type=player, tag=!nodevtick, tag=op] add devtick
tag @s[type=player, tag=nodevtick, tag=op] remove nodevtick
tellraw @s[type=player, tag=devtick, tag=!nodevtick, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aTicks will now be displayed."}]}