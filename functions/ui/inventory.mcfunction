tag @s[type=player, tag=inventory] add noinventory
tag @s[type=player, tag=noinventory] remove inventory
tellraw @s[type=player, tag=noinventory] {"rawtext":[{"text":"§r§uRosh §j> §cKeep Inventory is now disabled."}]}

tag @s[type=player, tag=!noinventory] add inventory
tag @s[type=player, tag=noinventory] remove noinventory
tellraw @s[type=player, tag=inventory, tag=!noinventory] {"rawtext":[{"text":"§r§uRosh §j> §aKeep Inventory is now enabled."}]}