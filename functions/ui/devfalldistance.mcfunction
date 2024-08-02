tag @s[type=player, tag=devfalldistance] add nodevfalldistance
tag @s[type=player, tag=nodevfalldistance] remove devfalldistance
tellraw @s[type=player, tag=nodevfalldistance] {"rawtext":[{"text":"§r§uRosh §j> §cFallDistance will no longer be displayed."}]}

tag @s[type=player, tag=!nodevfalldistance] add devfalldistance
tag @s[type=player, tag=nodevfalldistance] remove nodevfalldistance
tellraw @s[type=player, tag=devfalldistance, tag=!nodevfalldistance] {"rawtext":[{"text":"§r§uRosh §j> §aFallDistance will now be displayed."}]}