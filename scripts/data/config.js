export default
{
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
            "description": "!ban <player> <length> <reason> - Ban a player",
            "operator": true,
            "aliases": ["b"]
        },

        "unban": {
            "enabled": true,
            "description": "!unban <player> <reason> - Unban a player",
            "operator": true,
            "aliases": ["ub"]
        },

        "kick": {
            "enabled": true,
            "description": "!kick <player> <reason> - Kicks a player\nOr: !kick <player> -silent - Kicks a player without notifying them",
            "operator": true,
            "aliases": ["k"]
        },

        "kickall": {
            "enabled": true,
            "description": "!kickall - Kicks all players except you and staff members",
            "operator": true,
            "aliases": ["ka"]
        },

        "mute": {
            "enabled": true,
            "description": "!mute <player> - Removes the ability to chat from a player",
            "operator": true,
            "aliases": ["m"]
        },

        "unmute": {
            "enabled": true,
            "description": "!unmute <player> - Lets a player chat again",
            "operator": true,
            "aliases": ["um"]
        },

        "warn": {
            "enabled": true,
            "description": "!warn <player> <reason> - Warns a player for a specified reason\nRemarks: When getting warned too often, the player gets kicked",
            "operator": true,
            "aliases": ["w"]
        },

        "freeze": {
            "enabled": true,
            "description": "!freeze <player> - Disables movement, camera and hud for a player",
            "operator": true,
            "aliases": ["f"]
        },

        "unfreeze": {
            "enabled": true,
            "description": "!unfreeze <player> - Reenables movement, camera and hud for a player",
            "operator": true,
            "aliases": ["uf"]
        },

        "spectate": {
            "enabled": true,
            "description": "!spectate <player> - Spectate a player",
            "operator": true,
            "aliases": ["spec"]
        },

        "vanish": {
            "enabled": true,
            "description": "!vanish - Sets you in spectator mode",
            "operator": true,
            "aliases": ["v"]
        },

        "fly": {
            "enabled": true,
            "description": "!fly <player> - Lets a player fly",
            "operator": true
        },

        "invsee": {
            "enabled": true,
            "description": "!invsee <player> - See the contents of a players inventory",
            "operator": true,
            "aliases": ["inv"]
        },

        "cloneinv": {
            "enabled": true,
            "description": "!cloneinv <player> - Set your inventory to someone elses",
            "operator": true,
            "aliases": ["invclone", "invc"]
        },

        "ecwipe": {
            "enabled": true,
            "description": "!ecwipe <player> - Clears an enderchest of a player",
            "operator": true,
            "aliases": ["enderchestwipe", "ecw"]
        },

        "testaura": {
            "enabled": true,
            "description": "!testaura <player> - Lets you test players for killaura",
            "operator": true,
            "aliases": ["ta", "killaura"]
        },

        "ui": {
            "enabled": true,
            "description": "!ui - Gives you the UI item",
            "ui_item_name": "§r§uRosh§r",
            "ui_item": "minecraft:stone_axe",
            "rate_limit": 500, // (1000=1s)
            "operator": true,
            "aliases": ["gui"]
        },

        "op": {
            "enabled": true,
            "description": "!op <player> - Grants a player Operator status",
            "operator": true,
            "aliases": ["staff", "operator"]
        },

        "deop": {
            "enabled": true,
            "description": "!deop <player> - Revokes Operator status of a player",
            "operator": true,
            "aliases": ["destaff", "demote", "do"]
        },

        "tellstaff": {
            "enabled": true,
            "description": "!tellstaff <message> - Sends a message to all staff members",
            "operator": true,
            "aliases": ["irc"]
        },

        "notify": {
            "enabled": true,
            "description": "!notify - Lets you recieve flags",
            "operator": true,
            "aliases": ["not", "notifications", "alerts"]
        },

        "autoban": {
            "enabled": true,
            "description": "!autoban - Enables or disables auto-baning players by Rosh",
            "operator": true,
            "aliases": ["ab"]
        },

        "module": {
            "enabled": true,
            "description": "!module <modulename> <setting> <value> - Lets you customize a check\nOr: !module <modulename> reset - Resets the values back to default",
            "operator": true,
            "aliases": ["setting", "check"]
        },

        "stats": {
            "enabled": true,
            "description": "!stats <player> - Lets you see flags and punishments of a player",
            "operator": true,
            "aliases": ["info"]
        },

        "logs": {
            "enabled": true,
            "description": "!logs <page> - View all logged information",
            "operator": true,
            "aliases": ["log", "logged", "recentlogs", "rl"]
        },

        "banlist": {
            "enabled": true,
            "description": "!banlist - Displays information of all banned players\nOr: !banlist <player> - View ban-related information of a specific player",
            "operator": true,
            "aliases": ["bl"]
        },

        "resetwarns": {
            "enabled": true,
            "description": "!resetwarns <player> - Resets all flags of a player",
            "operator": true,
            "aliases": ["rw"]
        },

        "report": {
            "enabled": true,
            "description": "!report <player> <reason> - Notifies staff to inspect a player",
            "operator": false,
            "aliases": ["r", "rr", "roshreport", "rosh-report", "rep"]
        },

        "tag": {
            "enabled": true,
            "description": "!tag <player> <tag> - Adds a custom tag to a player\nOr: !tag <player> reset - Removes a custom tag from a player",
            "mainColor": "§u",
            "borderColor": "§8",
            "playerNameColor": "§r",
            "operator": true,
            "aliases": ["rank", "nametag"]
        },

        "help": {
            "enabled": true,
            "description": "!help - See all available commands",
            "operator": true,
            "aliases": ["support", "commands"]
        },

        "about": {
            "enabled": true,
            "description": "!about <modulname> - Lets you view the description of a check",
            "operator": true,
            "aliases": ["description"]
        },

        "version": {
            "enabled": true,
            "description": "!version - See the current Rosh version",
            "operator": false,
            "aliases": ["ver", "rosh"]
        },

        "credits": {
            "enabled": true,
            "description": "!credits - See the team behind Rosh",
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
            "enabled": true,
            "description": "Checks if a players rotation exceeds the vanilla rotation limit.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 2
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
            "enabled": true,
            "description": "Checks for smooth yaw and pitch movements",
            "punishment": "kick",
            "punishmentLength": "1h",
            "minVlbeforePunishment": 12
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
            "timer_level": 21.5,
            "timer_level_low": 18.5,
            "strict": true,
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 5
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
            "enabled": false,
            "description": "Checks for exceeding the maximum reach when attacking.",
            "punishment": "kick",
            "punishmentLength": "7d",
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
            "samples": 8,
            "maxDuplicates": 2,
            "minStdDev": 0.5,
            "minAverageCps": 7,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 4,
        },

        "autoclickerC": {
            "enabled": true,
            "description": "Checks for a variety of suspicious integer CPS value changes.",
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
            "minAverageCps": 6,
            "punishment": "kick",
            "punishmentLength": "2d",
            "minVlbeforePunishment": 5,
        },

        "killauraA": {
            "enabled": true,
            "description": "Checks for attacking with an integer x/y rotation.",
            "punishment": "kick",
            "punishmentLength": "7d",
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
            "punishmentLength": "7d",
            "minVlbeforePunishment": 9
        },

        "killauraE": {
            "enabled": false,
            "description": "Killaura Bot check (Spawns a fake player and if it gets attacked it flags)",
            "punishment": "kick",
            "minVlbeforePunishment": 2
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
            "enabled": true,
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