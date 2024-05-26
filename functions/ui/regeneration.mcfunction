tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=regeneration, tag=op] add noregeneration
tag @s[type=player, tag=noregeneration, tag=op] remove regeneration
tellraw @s[type=player, tag=noregeneration, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cRegeneration is now disabled."}]}

tag @s[type=player, tag=!noregeneration, tag=op] add regeneration
tag @s[type=player, tag=noregeneration, tag=op] remove noregeneration
tellraw @s[type=player, tag=regeneration, tag=!noregeneration, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aRegeneration is now enabled."}]}