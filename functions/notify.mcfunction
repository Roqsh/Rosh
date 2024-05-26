tellraw @s[type=player, tag=!op] {"rawtext":[{"text":"§r§uRosh §j> §cYou must be Op to use this command!"}]}

tag @s[type=player, tag=notify, tag=op] add nonotify
tag @s[type=player, tag=nonotify, tag=op] remove notify
tellraw @a[tag=nonotify, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §cYou will no longer receive notifications."}]}

tag @s[type=player, tag=!nonotify, tag=op] add notify
tag @s[type=player, tag=nonotify, tag=op] remove nonotify
tellraw @a[tag=notify, tag=!nonotify, tag=op] {"rawtext":[{"text":"§r§uRosh §j> §aYou will now receive notifications."}]}