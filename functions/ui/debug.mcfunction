tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=debug, tag=op] add nodebug
tag @s[type=player, tag=nodebug, tag=op] remove debug
tellraw @a[tag=nodebug, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cChecks will no longer include Debug info."}]}

tag @s[type=player, tag=!nodebug, tag=op] add debug
tag @s[type=player, tag=nodebug, tag=op] remove nodebug
tellraw @a[tag=debug, tag=!nodebug, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aChecks will now include Debug info."}]}