tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=devspeed, tag=op] add nodevspeed
tag @s[type=player, tag=nodevspeed, tag=op] remove devspeed
tellraw @s[type=player, tag=nodevspeed, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cSpeed will no longer be displayed."}]}

tag @s[type=player, tag=!nodevspeed, tag=op] add devspeed
tag @s[type=player, tag=nodevspeed, tag=op] remove nodevspeed
tellraw @s[type=player, tag=devspeed, tag=!nodevspeed, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aSpeed will now be displayed."}]}