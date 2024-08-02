tag @s[type=player, tag=regeneration] add noregeneration
tag @s[type=player, tag=noregeneration] remove regeneration
tellraw @s[type=player, tag=noregeneration] {"rawtext":[{"text":"§r§uRosh §j> §cRegeneration is now disabled."}]}

tag @s[type=player, tag=!noregeneration] add regeneration
tag @s[type=player, tag=noregeneration] remove noregeneration
tellraw @s[type=player, tag=regeneration, tag=!noregeneration] {"rawtext":[{"text":"§r§uRosh §j> §aRegeneration is now enabled."}]}