tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

scoreboard players add @a autoban 0
tag @s[type=player, tag=op, tag=auto] add noauto
tag @s[type=player, tag=op, tag=noauto] remove auto
tellraw @a[tag=noauto, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cAuto-Banning is now disabled."}]}

tag @s[type=player, tag=op, tag=!noauto] add auto
tag @s[type=player, tag=op, tag=noauto] remove noauto
tellraw @a[tag=auto,tag=!noauto, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aAuto-Banning is now enabled."}]}