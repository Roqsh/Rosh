tag @s[type=player, tag=devtps] add nodevtps
tag @s[type=player, tag=nodevtps] remove devtps
tellraw @s[type=player, tag=nodevtps] {"rawtext":[{"text":"§r§uRosh §j> §cTps will no longer be displayed."}]}

tag @s[type=player, tag=!nodevtps] add devtps
tag @s[type=player, tag=nodevtps] remove nodevtps
tellraw @s[type=player, tag=devtps, tag=!nodevtps] {"rawtext":[{"text":"§r§uRosh §j> §aTps will now be displayed."}]}