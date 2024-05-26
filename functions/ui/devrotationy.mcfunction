tellraw @s[type=player,tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=devrotationy, tag=op] add nodevrotationy
tag @s[type=player, tag=nodevrotationy, tag=op] remove devrotationy
tellraw @s[type=player, tag=nodevrotationy, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cYRotation will no longer be displayed."}]}

tag @s[type=player, tag=!nodevrotationy, tag=op] add devrotationy
tag @s[type=player, tag=nodevrotationy, tag=op] remove nodevrotationy
tellraw @s[type=player, tag=devrotationy, tag=!nodevrotationy, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aYRotation will now be displayed."}]}