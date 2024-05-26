tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=devrotationx, tag=op] add nodevrotationx
tag @s[type=player, tag=nodevrotationx, tag=op] remove devrotationx
tellraw @s[type=player, tag=nodevrotationx, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cXRotation will no longer be displayed."}]}

tag @s[type=player, tag=!nodevrotationx, tag=op] add devrotationx
tag @s[type=player, tag=nodevrotationx, tag=op] remove nodevrotationx
tellraw @s[type=player, tag=devrotationx, tag=!nodevrotationx, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aXRotation will now be displayed."}]}