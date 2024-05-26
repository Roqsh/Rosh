tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=stable, tag=op] add nostable
tag @s[type=player, tag=nostable, tag=op] remove stable
tellraw @a[tag=nostable, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aSet the preset to §8Beta§a! §c(Unfinished)"}]}

tag @s[type=player, tag=!nostable, tag=op] add stable
tag @s[type=player, tag=nostable, tag=op] remove nostable
tellraw @a[tag=stable, tag=!nostable, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aSet the preset to §8Stable§a! §c(Unfinished)"}]}