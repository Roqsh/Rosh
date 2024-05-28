tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=devtps, tag=op] add nodevtps
tag @s[type=player, tag=nodevtps, tag=op] remove devtps
tellraw @s[type=player, tag=nodevtps, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cTps will no longer be displayed."}]}

tag @s[type=player, tag=!nodevtps, tag=op] add devtps
tag @s[type=player, tag=nodevtps, tag=op] remove nodevtps
tellraw @s[type=player, tag=devtps, tag=!nodevtps, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aTps will now be displayed."}]}