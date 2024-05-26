tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=devfalldistance, tag=op] add nodevfalldistance
tag @s[type=player, tag=nodevfalldistance, tag=op] remove devfalldistance
tellraw @s[type=player, tag=nodevfalldistance, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cFallDistance will no longer be displayed."}]}

tag @s[type=player, tag=!nodevfalldistance, tag=op] add devfalldistance
tag @s[type=player, tag=nodevfalldistance, tag=op] remove nodevfalldistance
tellraw @s[type=player, tag=devfalldistance, tag=!nodevfalldistance, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aFallDistance will now be displayed."}]}