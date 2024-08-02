tag @s[type=player, tag=debug] add nodebug
tag @s[type=player, tag=nodebug] remove debug
tellraw @a[tag=nodebug] {"rawtext":[{"text":"§r§uRosh §j> §cChecks will no longer include Debug info."}]}

tag @s[type=player, tag=!nodebug] add debug
tag @s[type=player, tag=nodebug] remove nodebug
tellraw @a[tag=debug, tag=!nodebug] {"rawtext":[{"text":"§r§uRosh §j> §aChecks will now include Debug info."}]}