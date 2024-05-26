tag @s[tag=vanish] add novanish
tag @s[tag=novanish] remove vanish
gamemode creative @s[tag=novanish]
tellraw @s[tag=novanish] {"rawtext":[{"text":"§r§uRosh §j> §cYou are now no longer vanished."}]}
tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8"},{"selector":"@s"},{"text":" §cis no longer vanished."}]}

tag @s[tag=!novanish] add vanish
tag @s[tag=novanish] remove novanish
gamemode spectator @s[tag=vanish,tag=!novanish]
tellraw @s[tag=vanish,tag=!novanish] {"rawtext":[{"text":"§r§uRosh §j> §aYou are now vanished."}]}
tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8"},{"selector":"@s"},{"text":" §ais now vanished."}]}