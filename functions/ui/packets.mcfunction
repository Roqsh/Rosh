tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=packetlogger, tag=op] add nopacketlogger
tag @s[type=player, tag=nopacketlogger, tag=op] remove packetlogger
tellraw @a[tag=nopacketlogger, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cYou will no longer recieve Packets."}]}

tag @s[type=player, tag=!nopacketlogger, tag=op] add packetlogger
tag @s[type=player, tag=nopacketlogger, tag=op] remove nopacketlogger
tellraw @a[tag=packetlogger, tag=!nopacketlogger, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aYou will now recieve Packets."}]}