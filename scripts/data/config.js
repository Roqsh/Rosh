export default
{
    "preset": "stable", // Choose between 'stable' and 'beta' - Beta contains checks which are still under development/not finished, so false flags or bugs can occur.

    "kicksBeforeBan": 2, // The Amount of kicks a player is allowed to recieve before getting banned.

    "exclude_staff": false, // Ignores staff when enabled - Enable with caution!

    "console_debug": true, // Shows flags and punishments in the console

    "themecolor": "§u", // The color of the theme which is used for Rosh - ex: §a, §c, §9, etc.

    "flagWhitelist": [], // Who is able to bypass flags and punishments - ex: ["Playername1", "Playername2"]

    "autoban": false, // Automatically bans a player if he exceeds the maximum threshold

    "generalModules": { // Enable or disable a type of detection - Subchecks can be edited below.
        "fly": true,
        "speed": true,
        "motion": true,
        "killaura": true,
        "aim": true,
        "sprint": true,
        "misc": true,
        "reach": true,
        "movement": true,
        "scaffold": true,
        "tower": true,
        "nuker": true,
        "autoclicker": true,
        "aim": true
    },

    "logSettings": { // Adjust the settings of the log menu (can be done in game too)
        "compactMode": false,
        "showErrors": false,
        "showDebug": false,
        "showChat": false,
        "showJoinLeave": true,
        "linesPerPage": 25
    },

    "debug": true,
    
    "fancy_kick_calculation": {
        "on": false,
        "movement": 4,
        "combat": 3,
        "world": 3,
        "misc": 2
    },
    
    "clientSpam": {
        "punishment": "mute"
    },
    "ViolationsBeforeBan": 30,
    "autoReset": false,
    "silent": true,

    'ViolationsForKick': 15,
    
    "customcommands": {
        "prefix": "!",
        "sendInvalidCommandMsg": true,

        "ban": {
            "enabled": true,
            "description": "!ban <player> <length> <reason> - Ban a player",
            "requiredTags": ["op"],
            "aliases": ["b"]
        },

        "unban": {
            "enabled": true,
            "description": "!unban <player> <reason> - Unban a player",
            "requiredTags": ["op"],
            "aliases": ["ub"]
        },

        "kick": {
            "enabled": true,
            "description": "!kick <player> <reason> - Kicks a player\nOr: !kick <player> -silent - Kicks a player without notifying them",
            "requiredTags": ["op"],
            "aliases": ["k"]
        },

        "kickall": {
            "enabled": true,
            "description": "!kickall - Kicks all players except you and Rosh-Ops",
            "requiredTags": ["op"]
        },

        "mute": {
            "enabled": true,
            "description": "!mute <player> - Removes the ability to chat from a player",
            "requiredTags": ["op"],
            "aliases": ["m"]
        },

        "unmute": {
            "enabled": true,
            "description": "!unmute <player> - Lets a player chat again",
            "requiredTags": ["op"],
            "aliases": ["um"]
        },

        "freeze": {
            "enabled": true,
            "description": "!freeze <player> - Disables movement, camera and hud for a player",
            "requiredTags": ["op"]
        },

        "unfreeze": {
            "enabled": true,
            "description": "!unfreeze <player> - Reenables movement, camera and hud for a player",
            "requiredTags": ["op"]
        },

        "spectate": {
            "enabled": true,
            "description": "!spectate <player> - Spectate a player",
            "requiredTags": ["op"],
            "aliases": ["spec"]
        },

        "vanish": {
            "enabled": true,
            "description": "!vanish - Sets you in spectator mode",
            "requiredTags": ["op"],
            "aliases": ["v"]
        },

        "fly": {
            "enabled": true,
            "description": "!fly <player> - Lets a player fly",
            "requiredTags": ["op"]
        },

        "invsee": {
            "enabled": true,
            "description": "!invsee <player> - See the contents of a players inventory",
            "requiredTags": ["op"],
            "aliases": ["inv"]
        },

        "cloneinv": {
            "enabled": true,
            "description": "!cloneinv <player> - Set your inventory to someone elses",
            "requiredTags": ["op"],
            "aliases": ["invclone", "invc"]
        },

        "ecwipe": {
            "enabled": true,
            "description": "!ecwipe <player> - Clears an enderchest of a player",
            "requiredTags": ["op"],
            "aliases": ["enderchestwipe", "ecw"]
        },

        "testaura": {
            "enabled": true,
            "description": "!testaura <player> - Lets you test players for killaura",
            "requiredTags": ["op"],
            "aliases": ["ta"]
        },

        "ui": {
            "enabled": true,
            "description": "!ui - Gives you the UI item",
            "ui_item_name": "§r§uRosh§r",
            "ui_item": "minecraft:stone_axe",
            "rate_limit": 500, // (1000=1s)
            "requiredTags": ["op"],
            "aliases": ["gui"]
        },

        "op": {
            "enabled": true,
            "description": "!op <player> - Grants a player Rosh-Op",
            "requiredTags": ["op"],
            "aliases": ["staff"]
        },

        "deop": {
            "enabled": true,
            "description": "!deop <player> - Removes Rosh-Op from a player",
            "requiredTags": ["op"],
            "aliases": ["destaff", "demote", "do"]
        },

        "notify": {
            "enabled": true,
            "description": "!notify - Lets you recieve flags",
            "requiredTags": ["op"],
            "aliases": ["not","notifications"]
        },

        "autoban": {
            "enabled": true,
            "description": "!autoban - Enables or disables auto-baning players by Rosh",
            "requiredTags": ["op"],
            "aliases": ["ab"]
        },

        "module": {
            "enabled": true,
            "description": "!module <modulename> <setting> <value> - Lets you customize a check\nOr: !module <modulename> reset - Resets the values back to default",
            "requiredTags": ["op"],
            "aliases": ["m", "settings", "setting"]
        },

        "stats": {
            "enabled": true,
            "description": "!stats <player> - Lets you see flags and punishments of a player",
            "requiredTags": ["op"],
            "aliases": ["info"]
        },

        "logs": {
            "enabled": true,
            "description": "!logs <page> - View all logged information",
            "requiredTags": ["op"],
            "aliases": ["log", "data", "recent", "rl", "recentlogs"]
        },

        "resetwarns": {
            "enabled": true,
            "description": "!resetwarns <player> - Resets all flags of a player",
            "requiredTags": ["op"],
            "aliases": ["rw"]
        },

        "report": {
            "enabled": true,
            "description": "!report <player> - Notifies staff to inspect a player",
            "requiredTags": [],
            "aliases": ["r", "wdr", "ir", "isolate-report", "rep","isr","ir","isolatereport","isolate"]
        },

        "tag": {
            "enabled": true,
            "description": "!tag <player> <tag> - Adds a custom tag to a player\nOr: !tag <player> reset - Removes a custom tag from a player",
            "mainColor": "§u",
            "borderColor": "§8",
            "playerNameColor": "§r",
            "requiredTags": ["op"],
            "aliases": ["rank"]
        },

        "help": {
            "enabled": true,
            "description": "!help - See all available commands",
            "requiredTags": ["op"],
            "aliases": ["support","commands","what"]
        },

        "about": {
            "enabled": true,
            "description": "!about <modulname> - Lets you view the description of a check",
            "requiredTags": ["op"],
            "aliases": ["what", "a", "info", "?", "define", "def"]
        },

        "version": {
            "enabled": true,
            "description": "!version - See the current Rosh version",
            "requiredTags": ["op"],
            "aliases": ["ver","about"]
        },

        "credits": {
            "enabled": true,
            "description": "!credits - See the team behind Rosh",
            "requiredTags": ["op"]
        }
    },

    "modules": { // Be cautious if you dont know what you are doing!  

        "spammerA": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },

        "spammerB": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },

        "spammerC": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },

        "spammerD": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },

        "namespoofA": {
            "enabled": false,
            "minNameLength": 3,
            "maxNameLength": 16,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },

        "namespoofB": {
            "enabled": false,
            "regex": /[^A-Za-z0-9_\-() ]/,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },

        "autotoolA": {
            "enabled": false,
            "description": "Checks for instant slot change after breaking a block",
            "startBreakDelay": 53,
            "punishment": "kick",
            "minVlbeforePunishment": 4
        },

        /*
        Packet Checks
        */

        "exploitA": {
            "enabled": true,
            "description": "Checks for invalid skins",
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },

        "exploitB": {
            "enabled": true,
            "description": "Checks for being below world",
            "punishment": "kick",
            "minVlbeforePunishment": 6
        },

        "crasherA": {
            "enabled": false,
            "description":"Checks for old horion crasher method, some clients may still use them",
            "punishment": "kick",
            "punishmentLength": "14d",
            "minVlbeforePunishment": 1
        },

        "badpacketsB": {
            "enabled": false,
            "description": "Checks for moving to far in a tick",
            "speed": 7.3,
            "punishment": "kick",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 1
        },

        "badpacketsC": {
            "enabled": false,
            "description":"Checks for self-hit",
            "punishment": "kick",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 2
        },

        "badpacketsD": {
            "enabled": true,
            "description": "Checks for derp hacks",
            "punishment": "kick",
            "minVlbeforePunishment": 12
        },

        "badpacketsE": {
            "enabled": false,
            "description": "Patches a disabler on Vector Client (Changing location without velocity)",
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },

        "badpacketsF": {
            "enabled": true,
            "description": "Checks if a players rotation is flat",
            "punishment": "kick",
            "minVlbeforePunishment": 7
        },

        "badpacketsG": {
            "enabled": false,
            "description": "",
            "punishment": "kick",
            "minVlbeforePunishment": 15
        },

        "badpacketsH": {
            "enabled": true,
            "description": "Checks for flying without permissions",
            "punishment": "kick",
            "minVlbeforePunishment": 8
        },

        "badpacketsI": {
            "enabled": true,
            "description": "Checks for head rotation over 90 ",
            "punishment": "kick",
            "minVlbeforePunishment": 6
        },

        "badpacketsJ": {
            "enabled": true,
            "description": "Patches a disabler on Prax Client (Sending glide packets without elytra)",
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },

        "timerA": {
            "enabled": true,
            "description": "Checks for Timer",
            "timer_level": 22.5,
            "timer_level_low": 17.5,
            "strict": true,
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },

        "badenchantsA": {
			"enabled": true,
            "description": "Checks for levels that are higher than what the item supports",
			"levelExclusions": {}, // Example:  "sharpness": 69,
			"punishment": "kick",
			"minVlbeforePunishment": 0
		},

        "badenchantsB": {
            "enabled": true,
            "description": "Checks for negative enchantments",           
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },

        "badenchantsC": {
            "enabled": true,
            "description": "Checks for unsupported enchantments",           
            "punishment": "kick",
            "multi_protection": true,
            "minVlbeforePunishment": 0
        },

        "badenchantsD": {
            "enabled": true,
            "description": "Checks for duplicate enchantments",           
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },

        /*
        Combat Checks
        */

        "reachA": {
            "enabled": true,
            "description": "Checks for invalid reach",
            "punishment": "kick",
            "reach": 6.1,
            "dynamicReach": true,
            "smartReach": true,
            "buffer": 7,
            "dynamicData": {
                "water": 3.5,
                "still": 3.5,
                "speed": 5.4
            },
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "minVlbeforePunishment": 8
        },  

        "aimA": {
            "enabled": false,
            "description":"Simple delta check",
            "punishment": "kick",
            "minVlbeforePunishment": 8
        },

        "aimB": {
            "enabled": true,
            "description":"Checks for invalid rotations",
            "punishment": "kick",
            "minVlbeforePunishment": 8
        },

        "aimC": {
            "enabled": false,
            "description": "Checks for head snaps",
            "punishment": "kick",
            "buffer": 10,
            "minVlbeforePunishment": 8
        },

        "aimD": {
            "enabled": false,
            "description": "Checks for extrememly smooth rotation",
            "punishment": "kick",
            "buffer": 8,
            "minVlbeforePunishment": 8
        },

        "aimE": {
            "enabled": false,
            "description": "Checks for a valid sensitivity in the rotation",
            "punishment": "kick",
            "buffer": 10,
            "minVlbeforePunishment": 8
        },

        "autoclickerA": {
            "enabled": true,
            "description":"Checks for too high cps (amount)",
            "punishment": "kick",
            "delay": 1000,
            "cps": 17,
            "minVlbeforePunishment": 6
        },

        "autoclickerB": {
            "enabled": true,
            "description": "Checks for too little cps differences (constant)",   
            "punishment": "kick",
            "delay": 1000,
            "diff": 0.28,
            "minVlbeforePunishment": 4,
        },

        "autoclickerC": {
            "enabled": true,
            "description": "Checks for integer cps (flat)",   
            "punishment": "kick",
            "delay": 1000,
            "minVlbeforePunishment": 4,
        },

        "killauraA": {
            "enabled": true,
            "description": "Checks for attacking with an integer x/y rotation",
            "punishment": "kick",
            "minVlbeforePunishment": 4
        },

        "killauraB": {
            "enabled": false,
            "description": "Checks for no-swing",
            "punishment": "kick",
			"wait_ticks": 20,
			"max_swing_delay": 2000,
            "minVlbeforePunishment": 3
        },

        "killauraC": {
            "enabled": true,
            "description": "Checks for hitting multiple entities at once",
            "punishment": "kick",
            "entities": 2,
            "minVlbeforePunishment": 5
        },

        "killauraD": {
            "enabled": true,
            "description": "Checks for not looking at the attacked entity",
            "punishment": "kick",
            "punishmentLength": "3d",
            "minVlbeforePunishment": 4
        },

        "killauraE": {
            "enabled": false,
            "description": "Killaura Bot check (Spawns a fake player and if it gets attacked it flags)",
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },

        "killauraF": {
            "enabled": false,
            "description": "Checks for looking at the exact center of a player",
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },

        "killauraG": {
			"enabled": false,
            "description": "Checks for attacking while using an item",
			"punishment": "kick",
            "rightTicks": 4,
			"minVlbeforePunishment": 5
        },

        "hitboxA": {
            "enabled": true,
            "description": "Checks for attacking with a too high angle",
            "punishment": "kick",
            "angle": 55,
            "distance": 2.25,
            "minVlbeforePunishment": 5
        },

        /*
        Movement Checks
        */

        "noslowA": {
            "enabled": true,
            "description": "Checks for moving to fast while using an item",
            "speed": 0.21,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },

        "noslowB": {
            "enabled": true,
            "description": "Checks for moving to fast while being in cobwebs",
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },

        "invalidsprintA": {
            "enabled": true,
            "description": "Checks for sprinting while having the blindness effect",
            "punishment": "kick",
            "minVlbeforePunishment": 4
        },

        "invalidjumpA": {
            "enabled": false,
            "description": "Checks for jumping too high",
            "punishment": "kick",
            "maxheight": 1.25,
            "minVlbeforePunishment": 6
        },

        "invalidjumpB": {
            "enabled": false,
            "description": "Checks for jumping in air",
            "punishment": "kick",
            "minheightDiff": 0.35,
            "minVlbeforePunishment": 4
        },

        "invmoveA": {
            "enabled": false,
            "description": "Checks for moving while having a GUI open",
            "punishment": "kick",
            "delay": 8,
            "minVlbeforePunishment": 5
        },

        "speedA": {
            "enabled": true,
            "description":"Checks for moving too fast",
            "speed": 1.1,
            "checkForSprint": true,
            "checkForJump": false,
            "punishment": "kick",
            "minVlbeforePunishment": 6
        }, 

        "speedB": {
            "enabled": true,
            "description": "Checks for sus velocities",
            "speed": 1.35,
            "velocity": 0.412,
            "checkForSprint": false,
            "checkForJump": false,
            "punishment": "kick",
            "minVlbeforePunishment": 3
        }, 

        "flyA": {
            "enabled": true,
            "description": "In air velocity check",
            "punishment": "kick", 
            "diff": 0.1,
            "speed": 2.45,
            "punishmentLength": "3d",
            "minVlbeforePunishment": 3
        }, 

        "flyB": {
            "enabled": true,
            "description": "Checks for a player not going into the predicted location (y)",
            "punishment": "kick",
            "amount": 4,
            "punishmentLength": "5m",
            "minVlbeforePunishment": 5
        },

        "flyC": {
            "enabled": true,
            "description": "Checks for invalid Y movements",
            "fallDistance": -1,
            "punishment": "kick",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 3
        },

        "flyD": {
            "enabled": true,
            "description": "Checks for non BDS based fly (Only use if ur server doesnt use BDS Prediction - Not a realm)",
            "punishment": "kick",
            "dist": 2,
            "minVlbeforePunishment": 9
        },

        "motionA": {
            "enabled": true,
            "speed": 7.3,
            "description": "Checks for really high speed",
            "punishment": "kick",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 1
        },

        "motionB": {
            "enabled": true,
            "description": "Checks for high velocity changes",
            "punishment": "kick",
            "yVelocity": 30,
            "xVelocity": 25,
            "zVelocity": 25,
            "minVlbeforePunishment": 0
        },

        "motionC": {
            "enabled": true,
            "description": "Checks for not moving when having velocity",
            "punishment": "kick",
            "min_velocity": 2.5,
            "minVlbeforePunishment": 4
        },

        "motionD": {
            "enabled": true,
            "description": "Checks for not going to the predicted direction",
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },

        "motionE": {
            "enabled": true,
            "description": "Checks for invalid speed changes",
            "punishment": "kick",
            "minVlbeforePunishment": 4
        },

        "strafeA": {
            "enabled": true,
            "description": "Checks for drastically changing xz velocity whilst in air",
            "punishment": "kick",
            "maxChange": 0.2,
            "minVlbeforePunishment": 3
        },

        "strafeB": {
            "enabled": false,
            "description": "Checks for strafing mid-air",
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },
        

        /*
        World Checks
        */

        "nukerA": {
            "enabled": true,
            "description":"Checks for breaking too many blocks within a tick",
            "maxBlocks": 3,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },

        "nukerB": {
            "enabled": true,
            "description":"Checks for breaking with a too high angle",
            "angle": 80,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },

        "nukerC": {
            "enabled": false,
            "description":"Checks for breaking a covered block",
            "punishment": "kick",
            "score": -1,
            "minVlbeforePunishment": 0
        },

        "nukerD": {
            "enabled": true,
            "description":"Checks for not looking at the broken block",
            "punishment": "kick",
            "score": -1,
            "punishmentLength": "1m",
            "minVlbeforePunishment": 1
        },

        "instabreakA": {
            "enabled": true,
            "description": "Checks for breaking unbreakable blocks",
            "unbreakable_blocks": [
                "minecraft:bedrock",
                "minecraft:end_portal",
                "minecraft:end_portal_gateway",
                "minecraft:barrier",
                "minecraft:command_block",
                "minecraft:chain_command_block",
                "minecraft:repeating_command_block",
                "minecraft:end_gateway",
                "minecraft:light_block"
            ],
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },

        "scaffoldA": {
            "enabled": false,
            "description": "Checks for diagonal scaffolds",
            "punishment": "kick",
            "nofalse": false,
            "minVlbeforePunishment": 2
        },

        "scaffoldB": {
            "enabled": true,
            "description": "Checks for placing with an integer x/y rotation",
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },

        "scaffoldC": {
            "enabled": true,
            "description": "Checks for not looking at the placed block",
            "punishment": "kick", 
            "minVlbeforePunishment": 3
        },

        "scaffoldD": {
            "enabled": true,
            "description": "Checks for not looking at the placed block",
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },

        "scaffoldE": {
            "enabled": true,
            "description": "Checks for going too fast while placing",
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },

        "scaffoldF": {
            "enabled": true,
            "description":"Checks for placing too many blocks scaffold-ish per 20 ticks",
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },

        "scaffoldG": {
            "enabled": true,
            "description": "Checks for not triggering the 'itemUse' event",
            "punishment": "kick", 
            "minVlbeforePunishment": 0
        },

        "towerA": {
            "enabled": true,
            "description": "Checks for funny velocity while towering up",
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },

        "towerB": {
            "enabled": false,
            "description": "Checks for too short delays between placing",
            "punishment": "kick",
            "delay": 380,
            "minVlbeforePunishment": 2
        },

        "reachB": {
            "enabled": true,
            "description": "Checks for breaking too far away",
            "punishment": "kick",
            "reach": 6.65,
            "minVlbeforePunishment": 1
        },

    },
    
    "misc_modules": {},
    
    // Extra thhings
    "itemLists": {
        "spawnEggs": {
            "clearVanillaSpawnEggs": true,
            "clearCustomSpawnEggs": true
        },
        "elements": true,
        "cbe_items": [
            "minecraft:beehive",
            "minecraft:bee_nest",
            "minecraft:moving_block",
            "minecraft:axolotl_bucket",
            "minecraft:cod_bucket",
            "minecraft:powder_snow_bucket",
            "minecraft:pufferfish_bucket",
            "minecraft:salmon_bucket",
            "minecraft:tropical_fish_bucket",
            "minecraft:tadpole_bucket",
            "minecraft:dispenser"
        ],
        "items_semi_illegal": [
            "minecraft:bedrock",
            "minecraft:end_portal_frame",
            "minecraft:dragon_egg",
            "minecraft:monster_egg",
            "minecraft:infested_deepslate",
            "minecraft:mob_spawner",
            "minecraft:budding_amethyst",
            "minecraft:command_block",
            "minecraft:repeating_command_block",
            "minecraft:chain_command_block",
            "minecraft:barrier",
            "minecraft:structure_block",
            "minecraft:structure_void",
            "minecraft:jigsaw",
            "minecraft:allow",
            "minecraft:deny",
            "minecraft:light_block",
            "minecraft:border_block",
            "minecraft:chemistry_table",
            "minecraft:frosted_ice",
            "minecraft:npc_spawn_egg",
            "minecraft:reinforced_deepslate",
            "minecraft:farmland"
        ],
        "items_very_illegal": [
            "minecraft:flowing_water",
            "minecraft:water",
            "minecraft:flowing_lava",
            "minecraft:lava",
            "minecraft:fire",
            "minecraft:lit_furnace",
            "minecraft:standing_sign",
            "minecraft:wall_sign",
            "minecraft:lit_redstone_ore",
            "minecraft:unlit_redstone_ore",
            "minecraft:portal",
            "minecraft:unpowered_repeater",
            "minecraft:powered_repeater",
            "minecraft:pumpkin_stem",
            "minecraft:melon_stem",
            "minecraft:end_portal",
            "minecraft:lit_redstone_lamp",
            "minecraft:carrots",
            "minecraft:potatoes",
            "minecraft:unpowered_comparator",
            "minecraft:powered_comparator",
            "minecraft:double_wooden_slab",
            "minecraft:standing_banner",
            "minecraft:wall_banner",
            "minecraft:daylight_detector_inverted",
            "minecraft:chemical_heat",
            "minecraft:underwater_torch",
            "minecraft:end_gateway",
            "minecraft:stonecutter",
            "minecraft:glowingobsidian",
            "minecraft:netherreactor",
            "minecraft:bubble_column",
            "minecraft:bamboo_sapling",
            "minecraft:spruce_standing_sign",
            "minecraft:spruce_wall_sign",
            "minecraft:birch_standing_sign",
            "minecraft:birch_wall_sign",
            "minecraft:jungle_standing_sign",
            "minecraft:jungle_wall_sign",
            "minecraft:acacia_standing_sign",
            "minecraft:acacia_wall_sign",
            "minecraft:darkoak_standing_sign",
            "minecraft:darkoak_wall_sign",
            "minecraft:lit_smoker",
            "minecraft:lava_cauldron",
            "minecraft:soul_fire",
            "minecraft:crimson_standing_sign",
            "minecraft:crimson_wall_sign",
            "minecraft:warped_standing_sign",
            "minecraft:warped_wall_sign",
            "minecraft:blackstone_double_slab",
            "minecraft:polished_blackstone_brick_double_slab",
            "minecraft:polished_blackstone_double_slab",
            "minecraft:unknown",
            "minecraft:camera",
            "minecraft:reserved6",
            "minecraft:info_update",
            "minecraft:info_update2",
            "minecraft:lit_deepslate_redstone_ore",
            "minecraft:hard_stained_glass_pane",
            "minecraft:hard_stained_glass",
            "minecraft:colored_torch_rg",
            "minecraft:colored_torch_bp",
            "minecraft:balloon",
            "minecraft:ice_bomb",
            "minecraft:medicine",
            "minecraft:sparkler",
            "minecraft:glow_stick",
            "minecraft:compound",
            "minecraft:powder_snow",
            "minecraft:lit_blast_furnace",
            "minecraft:redstone_wire",
            "minecraft:crimson_double_slab",
            "minecraft:warped_double_slab",
            "minecraft:cobbled_deepslate_double_slab",
            "minecraft:polished_deepslate_double_slab",
            "minecraft:deepslate_tile_double_slab",
            "minecraft:deepslate_brick_double_slab",
            "minecraft:agent_spawn_egg",
            "minecraft:client_request_placeholder_block",
            "minecraft:rapid_fertilizer",
            "minecraft:hard_glass",
            "minecraft:hard_glass_pane",
            "minecraft:exposed_double_cut_copper_slab",
            "minecraft:oxidized_double_cut_copper_slab",
            "minecraft:waxed_double_cut_copper_slab",
            "minecraft:waxed_exposed_double_cut_copper_slab",
            "minecraft:waxed_oxidized_double_cut_copper_slab",
            "minecraft:waxed_weathered_double_cut_copper_slab",
            "minecraft:weathered_double_cut_copper_slab",
            "minecraft:double_wooden_slab",
            "minecraft:double_cut_copper_slab",
            "minecraft:invisible_bedrock",
            "minecraft:piston_arm_collision",
            "minecraft:sticky_piston_arm_collision",
            "minecraft:trip_wire",
            "minecraft:brewingstandblock",
            "minecraft:real_double_stone_slab",
            "minecraft:item.acacia_door",
            "minecraft:item.bed",
            "minecraft:item.beetroot",
            "minecraft:item.birch_door",
            "minecraft:item.cake",
            "minecraft:item.camera",
            "minecraft:item.campfire",
            "minecraft:item.cauldron",
            "minecraft:item.chain",
            "minecraft:item.crimson_door",
            "minecraft:item.dark_oak_door",
            "minecraft:item.flower_pot",
            "minecraft:item.frame",
            "minecraft:item.glow_frame",
            "minecraft:item.hopper",
            "minecraft:item.iron_door",
            "minecraft:item.jungle_door",
            "minecraft:item.kelp",
            "minecraft:item.nether_sprouts",
            "minecraft:item.nether_wart",
            "minecraft:item.reeds",
            "minecraft:item.skull",
            "minecraft:item.soul_campfire",
            "minecraft:item.spruce_door",
            "minecraft:item.warped_door",
            "minecraft:item.wheat",
            "minecraft:item.wooden_door",
            "minecraft:real_double_stone_slab3",
            "minecraft:real_double_stone_slab4",
            "minecraft:cave_vines",
            "minecraft:cave_vines_body_with_berries",
            "minecraft:cave_vines_head_with_berries",
            "minecraft:real_double_stone_slab2",
            "minecraft:spawn_egg",
            "minecraft:coral_fan_hang",
            "minecraft:coral_fan_hang2",
            "minecraft:coral_fan_hang3",
            "minecraft:cocoa",
            "minecraft:mangrove_standing_sign",
            "minecraft:item.mangrove_door",
            "minecraft:mangrove_wall_sign",
            "minecraft:mud_brick_double_slab",
            "minecraft:mangrove_double_slab",
            "minecraft:item.brewing_stand",
            "minecraft:double_stone_block_slab",
            "minecraft:bleach",
            "minecraft:double_stone_block_slab2",
            "minecraft:double_stone_block_slab3",
            "minecraft:double_stone_block_slab4",
            "minecraft:black_candle_cake",
            "minecraft:blue_candle_cake",
            "minecraft:brown_candle_cake",
            "minecraft:candle_cake",
            "minecraft:cyan_candle_cake",
            "minecraft:gray_candle_cake",
            "minecraft:green_candle_cake",
            "minecraft:light_blue_candle_cake",
            "minecraft:light_gray_candle_cake",
            "minecraft:lime_candle_cake",
            "minecraft:magenta_candle_cake",
            "minecraft:orange_candle_cake",
            "minecraft:pink_candle_cake",
            "minecraft:purple_candle_cake",
            "minecraft:red_candle_cake",
            "minecraft:sweet_berry_bush",
            "minecraft:unlit_redstone_torch",
            "minecraft:white_candle_cake",
            "minecraft:yellow_candle_cake"
        ]
    }
}