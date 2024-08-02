tag @s[type=player, tag=devtick] add nodevtick
tag @s[type=player, tag=nodevtick] remove devtick
tellraw @s[type=player, tag=nodevtick] {"rawtext":[{"text":"§r§uRosh §j> §cTicks will no longer be displayed."}]}

tag @s[type=player, tag=!nodevtick] add devtick
tag @s[type=player, tag=nodevtick] remove nodevtick
tellraw @s[type=player, tag=devtick, tag=!nodevtick] {"rawtext":[{"text":"§r§uRosh §j> §aTicks will now be displayed."}]}