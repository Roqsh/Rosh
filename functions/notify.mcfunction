tag @s[type=player, tag=notify] add nonotify
tag @s[type=player, tag=nonotify] remove notify
tellraw @a[tag=nonotify] {"rawtext":[{"text":"§r§uRosh §j> §cYou will no longer receive notifications."}]}

tag @s[type=player, tag=!nonotify] add notify
tag @s[type=player, tag=nonotify] remove nonotify
tellraw @a[tag=notify, tag=!nonotify] {"rawtext":[{"text":"§r§uRosh §j> §aYou will now receive notifications."}]}