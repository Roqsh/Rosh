tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=inventory, tag=op] add noinventory
tag @s[type=player, tag=noinventory, tag=op] remove inventory
tellraw @s[type=player, tag=noinventory, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cKeep Inventory is now disabled."}]}

tag @s[type=player, tag=!noinventory, tag=op] add inventory
tag @s[type=player, tag=noinventory, tag=op] remove noinventory
tellraw @s[type=player, tag=inventory, tag=!noinventory, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aKeep Inventory is now enabled."}]}