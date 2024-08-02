tag @s[type=player, tag=devrotationy] add nodevrotationy
tag @s[type=player, tag=nodevrotationy] remove devrotationy
tellraw @s[type=player, tag=nodevrotationy] {"rawtext":[{"text":"§r§uRosh §j> §cYRotation will no longer be displayed."}]}

tag @s[type=player, tag=!nodevrotationy] add devrotationy
tag @s[type=player, tag=nodevrotationy] remove nodevrotationy
tellraw @s[type=player, tag=devrotationy, tag=!nodevrotationy] {"rawtext":[{"text":"§r§uRosh §j> §aYRotation will now be displayed."}]}