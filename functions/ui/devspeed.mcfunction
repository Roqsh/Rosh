tag @s[type=player, tag=devspeed] add nodevspeed
tag @s[type=player, tag=nodevspeed] remove devspeed
tellraw @s[type=player, tag=nodevspeed] {"rawtext":[{"text":"§r§uRosh §j> §cSpeed will no longer be displayed."}]}

tag @s[type=player, tag=!nodevspeed] add devspeed
tag @s[type=player, tag=nodevspeed] remove nodevspeed
tellraw @s[type=player, tag=devspeed, tag=!nodevspeed] {"rawtext":[{"text":"§r§uRosh §j> §aSpeed will now be displayed."}]}