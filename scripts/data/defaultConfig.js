export default
{

    // This is only required to reset modules via the !module command. ( !module <module_name> reset )
    // Therefore, you better not change this!

    "modules": {  

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
            "description": "Checks if a player's nametag length is invalid.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 1
        },

        "namespoofB": {
            "enabled": true,
            "description": "Checks if a player's nametag contains invalid characters.",
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
            "description": "Checks if the length of a message is valid.",
            "punishment": "kick",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 4
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
            "minVlbeforePunishment": 8
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

        "scaffoldH": {
            "enabled": true,
            "description": "Checks for invalid held blocks",
            "punishment": "kick",
            "punishmentLength": "7d", 
            "minVlbeforePunishment": 3
        },

        "scaffoldI": {
            "enabled": true,
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
    
}