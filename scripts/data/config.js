

export default {

    "webhook": {
        "enabled": false,
        "style": "embed", // Either 'message' or 'embed'
        "url": "" // Better keep it private!
    },
    
    "preset": "stable", // Choose between 'stable' and 'beta' - Beta contains checks which are still under development/not finished, so false flags or bugs can occur.

    "themecolor": "§u", // The color of the theme which is used for Rosh - ex: §a, §c, §9, etc.

    "thememode": "Alice", // Switch between the default style of 'Rosh' or use others, such as 'Alice'

    "silent": true, // Wether to set the player back or not if he fails a check. - (Recommended: true, reduces the chance of false positives)

    "customBanMessage": "", // Allows you to add a custom message to the default message (Does not let you change the default message!)

    "kicksBeforeBan": 2, // The Amount of kicks a player is allowed to recieve before getting banned. - Dependend on "autoban" set to true

    "autoban": false, // Automatically bans a player if he exceeds the maximum threshold "kicksBeforeBan"

    "banJoin_debug": false, // Shows you a message whenever a banned player tries to join.

    "console_debug": true, // Shows flags and punishments in the console

    "exclude_staff": false, // Ignores staff when enabled - Enable with caution!

    "excluded_players": [], // Who is able to bypass flags and punishments - ex: ["Playername1", "Playername2"]

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
        "compactMode": false, // Not yet implemented
        "showErrors": false,  // Not yet implemented
        "showTimestamps": false,
        "showDebug": false,
        "showChat": false,
        "showJoinLeave": true,
        "linesPerPage": 25
    },
    
    "fancy_kick_calculation": {
        "enabled": false,
        "movement": 4,
        "combat": 3,
        "world": 3,
        "misc": 2
    },
    
    "customcommands": {
        "prefix": "!", // The prefix that is used before the command to execute it - (Only a single digit is allowed)
        "sendInvalidCommandMsg": true, // Notifies the user if the typed command is invalid.

        "ban": {
            "enabled": true,
            "description": "§r!ban <player> <length> <reason> §8- Ban a player",
            "operator": true,
            "aliases": ["b"]
        },

        "unban": {
            "enabled": true,
            "description": "§r!unban <player> <reason> §8- Unban a player",
            "operator": true,
            "aliases": ["ub"]
        },

        "kick": {
            "enabled": true,
            "description": "§r!kick <player> <reason> §8- Kicks a player\nOr: §r!kick <player> -silent §8- Kicks a player without notifying them",
            "operator": true,
            "aliases": ["k"]
        },

        "kickall": {
            "enabled": true,
            "description": "§r!kickall §8- Kicks all players except you and staff members",
            "operator": true,
            "aliases": ["ka"]
        },

        "mute": {
            "enabled": true,
            "description": "§r!mute <player> §8- Removes the ability to chat from a player",
            "operator": true,
            "aliases": ["m"]
        },

        "unmute": {
            "enabled": true,
            "description": "§r!unmute <player> §8- Lets a player chat again",
            "operator": true,
            "aliases": ["um"]
        },

        "warn": {
            "enabled": true,
            "description": "§r!warn <player> <reason> §8- Warns a player for a specified reason\nRemarks: When getting warned too often, the player gets kicked",
            "operator": true,
            "aliases": ["w"]
        },

        "freeze": {
            "enabled": true,
            "description": "§r!freeze <player> §8- Disables movement, camera and hud for a player",
            "operator": true,
            "aliases": ["f"]
        },

        "unfreeze": {
            "enabled": true,
            "description": "§r!unfreeze <player> §8- Reenables movement, camera and hud for a player",
            "operator": true,
            "aliases": ["uf"]
        },

        "spectate": {
            "enabled": true,
            "description": "§r!spectate <player> §8- Spectate a player",
            "operator": true,
            "aliases": ["spec"]
        },

        "report": {
            "enabled": true,
            "description": "§r!report <player> <reason> §8- Notifies staff to inspect a player",
            "operator": false,
            "aliases": ["r", "rr", "roshreport", "rosh-report", "rep"]
        },

        "reportui": {
            "enabled": true,
            "description": "§r!reportui §8- Opens a menu to the report a player",
            "operator": false,
            "aliases": ["reportgui", "reportmenu"]
        },

        "vanish": {
            "enabled": true,
            "description": "§r!vanish §8- Sets you in spectator mode",
            "operator": true,
            "aliases": ["v"]
        },

        "fly": {
            "enabled": true,
            "description": "§r!fly <player> §8- Lets a player fly",
            "operator": true
        },

        "invsee": {
            "enabled": true,
            "description": "§r!invsee <player> §8- See the contents of a players inventory",
            "operator": true,
            "aliases": ["inv"]
        },

        "cloneinv": {
            "enabled": true,
            "description": "§r!cloneinv <player> §8- Set your inventory to someone elses",
            "operator": true,
            "aliases": ["invclone", "invc"]
        },

        "ecwipe": {
            "enabled": true,
            "description": "§r!ecwipe <player> §8- Clears an enderchest of a player",
            "operator": true,
            "aliases": ["enderchestwipe", "ecw"]
        },

        "testaura": {
            "enabled": true,
            "description": "§r!testaura <player> §8- Lets you test players for killaura",
            "operator": true,
            "aliases": ["ta", "killaura"]
        },

        "ui": {
            "enabled": true,
            "description": "§r!ui §8- Gives you the UI item",
            "ui_item_name": "§r§uRosh§r",
            "ui_item": "minecraft:stone_axe",
            "rate_limit": 500, // (1000=1s)
            "operator": true,
            "aliases": ["gui"]
        },

        "op": {
            "enabled": true,
            "description": "§r!op <player> §8- Grants a player Operator status",
            "operator": true,
            "aliases": ["staff", "operator"]
        },

        "deop": {
            "enabled": true,
            "description": "§r!deop <player> §8- Revokes Operator status of a player",
            "operator": true,
            "aliases": ["destaff", "demote", "do"]
        },

        "tellstaff": {
            "enabled": true,
            "description": "§r!tellstaff <message> §8- Sends a message to all staff members",
            "operator": true,
            "aliases": ["irc"]
        },

        "notify": {
            "enabled": true,
            "description": "§r!notify §8- Lets you recieve flags",
            "operator": true,
            "aliases": ["not", "notifications", "alerts"]
        },

        "autoban": {
            "enabled": true,
            "description": "§r!autoban §8- Enables or disables auto-baning players by Rosh",
            "operator": true,
            "aliases": ["ab"]
        },

        "module": {
            "enabled": true,
            "description": "§r!module <modulename> <setting> <value> §8- Lets you customize a check\nOr: §r!module <modulename> reset §8- Resets the values back to default",
            "operator": true,
            "aliases": ["setting", "check"]
        },

        "stats": {
            "enabled": true,
            "description": "§r!stats <player> §8- Lets you see flags and punishments of a player",
            "operator": true,
            "aliases": ["info"]
        },

        "logs": {
            "enabled": true,
            "description": "§r!logs <page> §8- View all logged information",
            "operator": true,
            "aliases": ["log", "logged", "recentlogs", "rl"]
        },

        "banlist": {
            "enabled": true,
            "description": "§r!banlist §8- Displays information of all banned players\nOr: §r!banlist <player> §8- View ban-related information of a specific player",
            "operator": true,
            "aliases": ["bl"]
        },

        "resetwarns": {
            "enabled": true,
            "description": "§r!resetwarns <player> §8- Resets all flags of a player",
            "operator": true,
            "aliases": ["rw"]
        },

        "tag": {
            "enabled": true,
            "description": "§r!tag <player> <tag> §8- Adds a custom tag to a player\nOr: §r!tag <player> reset §8- Removes a custom tag from a player",
            "mainColor": "§u",
            "borderColor": "§8",
            "playerNameColor": "§r",
            "operator": true,
            "aliases": ["rank", "nametag"]
        },

        "help": {
            "enabled": true,
            "description": "§r!help §8- See all available commands",
            "operator": true,
            "aliases": ["support", "commands"]
        },

        "about": {
            "enabled": true,
            "description": "§r!about <modulename> §8- Lets you view the description of a check",
            "operator": true,
            "aliases": ["description"]
        },

        "version": {
            "enabled": true,
            "description": "§r!version §8- See the current Rosh version",
            "operator": false,
            "aliases": ["ver", "rosh"]
        },

        "credits": {
            "enabled": true,
            "description": "§r!credits §8- See the team behind Rosh",
            "operator": false,
            "aliases": ["team", "developers", "authors"]
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
            "enabled": true,
            "description": "Checks if a player's name length is invalid.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 1
        },

        "namespoofB": {
            "enabled": true,
            "description": "Checks if a player's name contains invalid characters.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 1
        },

        "autotoolA": {
            "enabled": true,
            "description": "Checks for suspiciously fast slot changes after starting to break a block.",
            "startBreakDelay": 53,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "inventoryA": {
            "enabled": true,
            "description": "Checks for a cursor item in invalid scenarios.",
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 5
        },

        "inventoryB": {
            "enabled": true,
            "description": "Checks for inventory transactions in invalid scenarios.",
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 8
        },

        /*
        Packet Checks
        */

        "exploitA": {
            "enabled": true,
            "description": "Checks for being below the possible y-Level.",
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },

        "crasherA": {
            "enabled": false,
            "description":"Checks for old horion crasher method, some clients may still use them",
            "punishment": "kick",
            "punishmentLength": "14d",
            "minVlbeforePunishment": 1
        },

        "badpacketsA": {
            "enabled": false,
            "description": "",
            "punishment": "",
            "punishmentLength": "",
            "minVlbeforePunishment": 0
        },

        "badpacketsB": {
            "enabled": true,
            "description": "Checks if a player's selected slot is vanilla reachable.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 4
        },

        "badpacketsC": {
            "enabled": true,
            "description":"Checks for hitting yourself.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 1
        },

        "badpacketsD": {
            "enabled": false,
            "description": "",
            "punishment": "",
            "punishmentLength": "",
            "minVlbeforePunishment": 0
        },

        "badpacketsE": {
            "enabled": true,
            "description": "Checks for invalid message properties.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 3
        },

        "badpacketsF": {
            "enabled": true,
            "description": "Checks if a players rotation is flat",
            "punishment": "kick",
            "minVlbeforePunishment": 7
        },

        "badpacketsG": {
            "enabled": true,
            "description": "Checks for movements without valid velocities.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
        },

        "badpacketsH": {
            "enabled": true,
            "description": "Checks for flying without permission",
            "punishment": "kick",
            "minVlbeforePunishment": 8
        },

        "badpacketsI": {
            "enabled": false,
            "description": "Checks for sending too many packets at once.",
            "packets": 50,
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 6
        },

        "badpacketsJ": {
            "enabled": true,
            "description": "Patches a disabler on Prax Client (Sending glide packets without an elytra)",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 6
        },

        "timerA": {
            "enabled": true,
            "description": "Checks for Timer",
            "requiredSamples": 20,
            "timer_level": 22,
            "timer_level_low": 18,
            "strict": true,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
        },

        "badenchantsA": {
			"enabled": false,
            "description": "Checks if an enchantment exceeds its maximum allowed level.",
			"levelExclusions": {}, // Example:  "sharpness": 69,
			"punishment": "kick",
			"minVlbeforePunishment": 0
		},

        "badenchantsB": {
            "enabled": false,
            "description": "Checks if an enchantment has a negative or zero level, which is invalid.",           
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },

        "badenchantsC": {
            "enabled": false,
            "description": "Checks if an enchantment is not compatible with the item it is applied to.",           
            "punishment": "kick",
            "multi_protection": false,
            "minVlbeforePunishment": 0
        },

        "badenchantsD": {
            "enabled": false,
            "description": "Checks for duplicate enchantments within an item, which is not allowed.",           
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },

        /*
        Combat Checks
        */

        "reachA": {
            "enabled": false,
            "description": "Checks for exceeding the maximum reach when attacking.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },  

        "aimA": {
            "enabled": true,
            "description":"Checks if a player's rotation exceeds the vanilla rotation limit.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 3
        },

        "aimB": {
            "enabled": true,
            "description":"Checks for smoothed yaw or pitch movements.",
            "samples": 20,
            "integer_frequency": 0.4,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 6
        },

        "aimC": {
            "enabled": true,
            "description":"Checks for suspicious duplicate rotations that match pre-snap values.",
            "samples": 50,
            "min_delta": 20,
            "duplicate_threshold": 5,
            "tolerance": 1e-7,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
        },

        "autoclickerA": {
            "enabled": true,
            "description":"Checks if a player's CPS exceeds the allowed threshold multiple times.",
            "samples": 8,
            "cps": 17,
            "threshold": 2,
            "maxTimeDiff": 8000,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 6
        },

        "autoclickerB": {
            "enabled": true,
            "description": "Checks for suspiciously low deviation or duplicate CPS.",   
            "samples": 9,
            "maxDuplicates": 2,
            "minStdDev": 0.5,
            "minAverageCps": 7,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 5,
        },

        "autoclickerC": {
            "enabled": true,
            "description": "Checks for a variety of suspicious integer CPS values.",
            "samples": 12,
            "minIntChanges": 3,
            "minAverageCps": 6,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 5,
        },

        "autoclickerD": {
            "enabled": true,
            "description": "Detects suspicious periodic spikes in CPS.",
            "samples": 5,
            "spikeThreshold": 5,
            "minAverageCps": 7,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 5,
        },

        "autoclickerE": {
            "enabled": true,
            "description": "Detects oscillating CPS patterns.",
            "samples": 10,
            "minimumPatternFrequency": 0.75,
            "oscillationThreshold": 1.5,
            "minAverageCps": 9,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5,
        },

        "killauraA": {
            "enabled": true,
            "description": "Checks for attacking with an integer x/y rotation.",
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 5
        },

        "killauraB": {
            "enabled": true,
            "description": "Checks for invalid attacks.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 4
        },

        "killauraC": {
            "enabled": true,
            "description": "Checks for hitting multiple entities at once.",
            "punishment": "kick",
            "entities": 2,
            "timeWindow": 50,
            "punishmentLength": "1d",
            "minVlbeforePunishment": 7
        },

        "killauraD": {
            "enabled": true,
            "description": "Checks if a player hits through a solid wall.",
            "y_increment": 0.1,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 9
        },

        "killauraE": {
            "enabled": true,
            "description": "Detects suspicious optimal yaw values when looking at a target.",
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 6
        },

        "hitboxA": {
            "enabled": true,
            "description": "Checks for attacking with a too high angle",
            "punishment": "kick",
            "angle": 55,
            "distance": 2.25,
            "minVlbeforePunishment": 5
        },

        "hitboxB": {
            "enabled": true,
            "description": "Checks for not looking at the attacked Player.",
            "threshold": 25, // Minimum angle threshold to consider "looking at" the entity
            "height": 1.8, // Approximate height of the entity, adjust as needed (Player only, as the height differs between entities)
            "distance": 2, // Minimum distance the player and the entity needs to have before failing the check
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
        },

        /*
        Movement Checks
        */

        "noslowA": {
            "enabled": true,
            "description": "Checks for not slowing down when using an item.",
            "max_speed": 0.1,
            "item_use_time": 10,
            "buffer": 4,
            "punishment": "kick",
            "minVlbeforePunishment": 8
        },

        "noslowB": {
            "enabled": true,
            "description": "Checks if the player is not slowing down when inside a cobweb.",
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 3
        },

        "noslowC": {
            "enabled": true,
            "description": "Checks for improper deceleration when doing large yaw movements.",
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 8
        },

        "invalidsprintA": {
            "enabled": true,
            "description": "Checks for sprinting in invalid directions. (Omni-Sprint)",
            "angle_threshold": 75,
            "buffer_threshold": 9,
            "punishment": "kick",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 7
        },

        "invalidsprintB": {
            "enabled": true,
            "description": "Checks for sprinting while having the blindness effect.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 6
        },

        "invalidsprintC": {
            "enabled": true,
            "description": "Checks for sprinting while using an item.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "invalidjumpA": {
            "enabled": false,
            "description": "Checks for jumping while in the air.",
            "punishment": "kick",
            "punishmentLength": "1d",
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
            "description": "Checks for excessive vertical movement while in air.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 4
        }, 

        "flyB": {
            "enabled": true,
            "description": "Checks for no vertical movement.",
            "threshold": 9,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "flyC": {
            "enabled": true,
            "description": "Checks for invalid Y movements",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "flyD": {
            "enabled": true,
            "description": "Checks for not falling after being in the air for too long.",
            "in_air_ticks": 10,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "flyE": {
            "enabled": false,
            "description": "Predicts the change in a player's vertical velocity.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
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
            "enabled": false,
            "description": "Checks for not going to the predicted direction",
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },

        "motionE": {
            "enabled": true,
            "description": "Checks for invalid speed changes",
            "punishment": "kick",
            "minVlbeforePunishment": 4
        },

        "strafeA": {
            "enabled": false,
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
            "description":"Checks for breaking too many blocks within a tick.",
            "maxBlocks": 3,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "nukerB": {
            "enabled": true,
            "description":"Checks if a player is breaking a block at an unusual angle.",
            "angle": 60,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "nukerC": {
            "enabled": true,
            "description":"Checks if a player is breaking a covered block.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },

        "nukerD": {
            "enabled": true,
            "description":"Checks if a player is breaking an unbreakable block in survival.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 4
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
            "description": "Checks for placing with an integer x/y rotation.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
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
            "angle": 75,
            "distance": 2,
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },

        "scaffoldE": {
            "enabled": true,
            "description": "Checks for placing too many blocks in a single tick.",
            "amount": 3,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 4
        },

        "scaffoldF": {
            "enabled": true,
            "description":"Checks for suspicious icy-bridging behavior per 20 ticks.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 2
        },

        "scaffoldG": {
            "enabled": false,
            "description": "Checks for not triggering the 'itemUse' event",
            "punishment": "kick", 
            "minVlbeforePunishment": 0
        },

        "scaffoldH": {
            "enabled": true,
            "description": "Checks for invalid held blocks",
            "punishment": "kick",
            "punishmentLength": "7d", 
            "minVlbeforePunishment": 3
        },

        "scaffoldI": {
            "enabled": false,
            "description": "Checks for returning to the original yaw/pitch rotation before the placement happened.",
            "punishment": "kick", 
            "punishmentLength": "7d",
            "minVlbeforePunishment": 2
        },

        "scaffoldJ": {
            "enabled": true,
            "description": "Checks for looking at the exact center of the placed block.",
            "threshold": 0.001,
            "punishment": "kick", 
            "punishmentLength": "7d",
            "minVlbeforePunishment": 9
        },

        "scaffoldK": {
            "enabled": true,
            "description": "Checks for placing blocks at liquid or air.",
            "punishment": "kick", 
            "punishmentLength": "7d",
            "minVlbeforePunishment": 2
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
            "description": "Checks if a player is exceeding the reach distance of a block.",
            "reach": 6.65,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 8
        },
    },
    
    "misc_modules": {}
}