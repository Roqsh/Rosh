tag @s[tag=freeze] add nofreeze
tag @s[tag=nofreeze] remove freeze

inputpermission set @s[tag=nofreeze] movement enabled
event entity @s[tag=nofreeze] scythe:unfreeze

inputpermission set @s[tag=!nofreeze] movement disabled
event entity @s[tag=!nofreeze] scythe:freeze
tag @s[tag=!nofreeze] add freeze
tag @s[tag=nofreeze] remove nofreeze