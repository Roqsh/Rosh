tag @s[type=player, tag=packetlogger] add nopacketlogger
tag @s[type=player, tag=nopacketlogger] remove packetlogger
tellraw @a[tag=nopacketlogger] {"rawtext":[{"text":"§r§uRosh §j> §cYou will no longer recieve Packets."}]}

tag @s[type=player, tag=!nopacketlogger] add packetlogger
tag @s[type=player, tag=nopacketlogger] remove nopacketlogger
tellraw @a[tag=packetlogger, tag=!nopacketlogger] {"rawtext":[{"text":"§r§uRosh §j> §aYou will now recieve Packets."}]}