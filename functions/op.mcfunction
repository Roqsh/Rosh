tellraw @s[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cYou are already op!"}]}
tellraw @s[tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §aYou are now op!"}]}
tellraw @a[tag=op] {"rawtext":[{"text":"§r§uRosh §j> §8"},{"selector":"@s"},{"text":" §ais now op!"}]}
tag @s[type=player, tag=!op] add op