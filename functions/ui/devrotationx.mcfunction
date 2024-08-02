tag @s[type=player, tag=devrotationx] add nodevrotationx
tag @s[type=player, tag=nodevrotationx] remove devrotationx
tellraw @s[type=player, tag=nodevrotationx] {"rawtext":[{"text":"§r§uRosh §j> §cXRotation will no longer be displayed."}]}

tag @s[type=player, tag=!nodevrotationx] add devrotationx
tag @s[type=player, tag=nodevrotationx] remove nodevrotationx
tellraw @s[type=player, tag=devrotationx, tag=!nodevrotationx] {"rawtext":[{"text":"§r§uRosh §j> §aXRotation will now be displayed."}]}