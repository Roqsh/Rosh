import * as Minecraft from "@minecraft/server";
import { Player, system, world, ItemTypes, ItemStack } from "@minecraft/server";
import config from "./data/config.js";
import data from "./data/data.js";
import { tag_system } from "./utils/gameUtil.js";
import { flag, ban, parseTime, timeDisplay, getScore, setScore, tellStaff, getSpeed, aroundAir, debug } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import { mainMenu } from "./ui/mainMenu.js";
import { playerMenuSelected } from "./ui/main/playerMenu.js";

// Misc
import { badpackets_a } from "./checks/misc/badpackets/badpacketsA.js";
import { badpackets_b } from "./checks/misc/badpackets/badpacketsB.js";
import { badpackets_c } from "./checks/misc/badpackets/badpacketsC.js";
import { badpackets_d } from "./checks/misc/badpackets/badpacketsD.js";
import { badpackets_e } from "./checks/misc/badpackets/badpacketsE.js";
import { badpackets_f } from "./checks/misc/badpackets/badpacketsF.js";
import { badpackets_g } from "./checks/misc/badpackets/badpacketsG.js";
import { badpackets_h } from "./checks/misc/badpackets/badpacketsH.js";
import { badpackets_i } from "./checks/misc/badpackets/badpacketsI.js";
import { badpackets_j } from "./checks/misc/badpackets/badpacketsJ.js";
import { exploit_a } from "./checks/misc/exploit/exploitA.js";
import { namespoof_a } from "./checks/misc/namespoof/namespoofA.js";
import { namespoof_b } from "./checks/misc/namespoof/namespoofB.js";
import { timer_a } from "./checks/misc/timer/timerA.js";

// Movement
import { speed_a } from "./checks/movement/speed/speedA.js";
import { speed_b } from "./checks/movement/speed/speedB.js";
import { motion_a } from "./checks/movement/motion/motionA.js";
import { motion_b } from "./checks/movement/motion/motionB.js";
import { motion_c } from "./checks/movement/motion/motionC.js";
import { motion_d } from "./checks/movement/motion/motionD.js";
import { motion_e } from "./checks/movement/motion/motionE.js";
import { fly_a } from "./checks/movement/fly/flyA.js";
import { fly_b } from "./checks/movement/fly/flyB.js";
import { fly_c } from "./checks/movement/fly/flyC.js";
import { fly_d } from "./checks/movement/fly/flyD.js";
import { strafe_a } from "./checks/movement/strafe/strafeA.js";
import { strafe_b } from "./checks/movement/strafe/strafeB.js";
import { noslow_a } from "./checks/movement/noslow/noslowA.js";
import { noslow_b } from "./checks/movement/noslow/noslowB.js";
import { sprint_a } from "./checks/movement/sprint/sprintA.js";
import { invmove_a } from "./checks/movement/invmove/invmoveA.js";
import { jump_a } from "./checks/movement/jump/jumpA.js";
import { jump_b } from "./checks/movement/jump/jumpB.js";

// World
import { nuker_a } from "./checks/world/nuker/nukerA.js";
import { nuker_b } from "./checks/world/nuker/nukerB.js";
import { nuker_c } from "./checks/world/nuker/nukerC.js";
import { nuker_d } from "./checks/world/nuker/nukerD.js";
import { reach_b } from "./checks/world/reach/reachB.js";
import { scaffold_a } from "./checks/world/scaffold/scaffoldA.js";
import { scaffold_b } from "./checks/world/scaffold/scaffoldB.js";
import { scaffold_c } from "./checks/world/scaffold/scaffoldC.js";
import { scaffold_d } from "./checks/world/scaffold/scaffoldD.js";
import { scaffold_e } from "./checks/world/scaffold/scaffoldE.js";
import { scaffold_f, scaffold_f_dependency } from "./checks/world/scaffold/scaffoldF.js";
import { scaffold_g } from "./checks/world/scaffold/scaffoldG.js";
import { scaffold_h, dependencies_h } from "./checks/world/scaffold/scaffoldH.js";
//import { scaffold_i } from "./checks/world/scaffold/scaffoldI.js";
import { scaffold_j } from "./checks/world/scaffold/scaffoldJ.js";
import { scaffold_k } from "./checks/world/scaffold/scaffoldK.js";
import { tower_a } from "./checks/world/tower/towerA.js";
import { tower_b } from "./checks/world/tower/towerB.js";

// Combat
import { killaura_a } from "./checks/combat/killaura/killauraA.js";
import { killaura_b } from "./checks/combat/killaura/killauraB.js";
import { killaura_c } from "./checks/combat/killaura/killauraC.js";
import { killaura_d } from "./checks/combat/killaura/killauraD.js";
import { killaura_e, dependencies_e } from "./checks/combat/killaura/killauraE.js";
import { hitbox_a } from "./checks/combat/hitbox/hitboxA.js";
import { hitbox_b } from "./checks/combat/hitbox/hitboxB.js";
import { reach_a } from "./checks/combat/reach/reachA.js";
import { clicksHandler } from "./checks/combat/autoclicker/clicksHandler.js";
import { autoclicker_a } from "./checks/combat/autoclicker/autoclickerA.js";
import { autoclicker_b } from "./checks/combat/autoclicker/autoclickerB.js";
import { autoclicker_c } from "./checks/combat/autoclicker/autoclickerC.js";
import { autoclicker_d } from "./checks/combat/autoclicker/autoclickerD.js";
//import { aim_a } from "./checks/combat/aim/aimA.js";
import { aim_b } from "./checks/combat/aim/aimB.js";
import { aim_c } from "./checks/combat/aim/aimC.js";
// FIXME:
//import { aim_d } from "./checks/combat/aim/aimD.js";
//import { aim_e } from "./checks/combat/aim/aimE.js";


// Adding methods to the prototype
Player.prototype.getCps = function() {
    return this.cps || 0;  // Return 0 if cps is undefined
};

Player.prototype.setCps = function(cpsValue) {
    this.cps = cpsValue;
};


let tps = 20;
let lagValue = 1;
let lastDate = Date.now();

world.beforeEvents.chatSend.subscribe((msg) => {

    const themecolor = config.themecolor;
	const { sender: player, message } = msg;

    let cancelEvent = false;
    
    badpackets_e(player, message, msg);

	if (message.includes("horion") || message.includes("borion") || message.includes("packet") || message.includes("vector") || message.includes("prax") || message.includes("zephyr") || message.includes("nuvola")  || message.includes("aelous") || message.includes("disepi") || message.includes("ambrosial") || message.includes("utility mod") || message.includes("nigga") || message.includes("niger")) {	
		cancelEvent = true;
	}

	if (message.includes("Horion") || message.includes("Borion") || message.includes("Packet") || message.includes("Vector") || message.includes("Prax") || message.includes("Zephyr") || message.includes("Nuvola") || message.includes("Aelous") || message.includes("Disepi") || message.includes("Ambrosial") || message.includes("Lunaris") || message.includes("Nigga") || message.includes("Niger")) {
		cancelEvent = true;
	}

	if (player.hasTag("isMuted")) {
		cancelEvent = true;
		player.sendMessage(`§r${themecolor}Rosh §j> §cUnable to send that message - You are muted!`);
	}

	commandHandler(msg);

	if (config.logSettings.showChat) {
        data.recentLogs.push(`${timeDisplay()}§r<${player.nameTag}> ${message}`);
    }

	if (!msg.cancel) {
		if (player.name !== player.nameTag) {
			world.sendMessage(`§r<${player.nameTag}> ${message}`);
			cancelEvent = true;
		} else {
			world.sendMessage(`<${player.nameTag}> ${message.replace(/[^\x00-\xFF]/g, "")}`);
			cancelEvent = true;
		}
	}

    // Prevent the message from being sent
    if (cancelEvent) {
        msg.cancel = true;
    }
});


world.afterEvents.chatSend.subscribe(({ sender: player }) => {

    //TODO: Recode them (Move them into their own category and add Spammer/E)
	if(config.modules.spammerA.enabled && player.isSprinting && player.isOnGround && !player.isJumping) {
		flag(player, "Spammer", "A", "moving", "true");
	}

	if(config.modules.spammerB.enabled && player.hasTag("attacking") && !player.getEffect(Minecraft.MinecraftEffectTypes.miningFatigue)) {
		flag(player, "Spammer", "B", "attacking", "true");
	}

	if(config.modules.spammerC.enabled && player.hasTag("placing")) {
		flag(player, "Spammer", "C", "placing", "true");
	}

	if(config.modules.spammerD.enabled && player.hasTag("hasGUIopen")) {
		flag(player, "Spammer", "D", "inGUI", "true");
	}
});


world.afterEvents.entityHurt.subscribe((data) => {

	const player = data.hurtEntity;

	if(player.typeId !== "minecraft:player") return;

	player.addTag("damaged");

	if(data.damageSource.cause === "fall") {
		player.addTag("fall_damage");
	}

});

system.runInterval(() => {

    if (system.currentTick % 20 == 0) {

	   const deltaDate = Date.now() - lastDate;
	   const lag = deltaDate / 1000;

	   tps = Minecraft.TicksPerSecond / lag;
	   lagValue = lag;
	   lastDate = Date.now();
    }

	for (const player of world.getPlayers()) {

		const rotation = player.getRotation();
		const velocity = player.getVelocity();
        const xp = player.getTotalXp();

        const xpForNextLevel = player.totalXpNeededForNextLevel;
        const xpAtCurrentLevel = player.xpEarnedAtCurrentLevel;
        const container = player.getComponent("inventory")?.container;
        const selectedSlot = player.selectedSlotIndex;
        const selectedItem = container.getItem(selectedSlot);
        const level = player.level;

		const speed = getSpeed(player);

        const themecolor = config.themecolor;

		player.removeTag("noPitchDiff");

		if (player.hasTag("isBanned")) {
            ban(player);
        }

        // Whacky solution for missing riding property in Minecraft.Entity
        if (player.hasTag("riding")) {
            player.isRiding = true;
        } else {
            player.isRiding = false;
        }

        if (selectedItem?.typeId === "minecraft:trident") {
            player.isHoldingTrident = true; 
        } else {
            player.isHoldingTrident = false;
        }
        
		if(player.blocksBroken >= 1 && config.modules.nukerA.enabled) player.blocksBroken = 0;

		if (Date.now() - player.startBreakTime < config.modules.autotoolA.startBreakDelay && player.lastSelectedSlot !== selectedSlot) {
			player.flagAutotoolA = true;
			player.autotoolSwitchDelay = Date.now() - player.startBreakTime;
		}

		if(player.hasTag("moving")) {
			player.runCommandAsync(`scoreboard players set @s xPos ${Math.floor(player.location.x)}`);
			player.runCommandAsync(`scoreboard players set @s yPos ${Math.floor(player.location.y)}`);
			player.runCommandAsync(`scoreboard players set @s zPos ${Math.floor(player.location.z)}`);
		}

		if(getScore(player, "kickvl", 0) > config.kicksBeforeBan / 2 && !player.hasTag("strict")) {
			try {
				player.addTag("strict");
			} catch (error) {
				player.runCommandAsync(`tag "${player.name}" add strict`);
			}
		}

		const blockUnderPlayer = player.dimension.getBlock({
            x: player.location.x, 
            y: player.location.y - 1, 
            z: player.location.z
        });
        
        switch (true) {

            case blockUnderPlayer.typeId.includes("ice"):
                player.isOnIce = true;
                break;

            case blockUnderPlayer.typeId.includes("snow"):
                player.isOnSnow = true;
                break;

            case blockUnderPlayer.typeId.includes("slime"):
                player.isOnSlime = true;
                break;

            case blockUnderPlayer.typeId.includes("shulker"):
                player.isOnShulker = true;
                break;

            case blockUnderPlayer.typeId.includes("stairs"):
                player.isRunningStairs = true;
                break;

            // Add more cases as needed
            default:
                // Optional: Handle the case where no match is found
                break;
        }
        
		if (player.isOnSlime) {
			setScore(player, "tick_counter2", 0);
		}
        if (player.isHoldingTrident) {
			setScore(player, "right", 0);
		}

		tag_system(player);	

		const tick = getScore(player, "tickValue", 0);
		setScore(player, "tickValue", tick + 1);


        // Invmove/A delay
        const invmove_delay = getScore(player, "invmove_delay", 0);
		if(player.hasTag("hasGUIopen")) {
			setScore(player, "invmove_delay", invmove_delay + 1);
		} else setScore(player, "invmove_delay", 0);


        // Fly/D delay
		const flyTime = getScore(player, "airTime", 0);
		if(!player.isOnGround && aroundAir(player)) {
			setScore(player, "airTime", flyTime + 1);
		} else setScore(player, "airTime", 0);

        // Debug utilities
		debug(player, "Speed", speed, "speed");
		debug(player, "Ticks", `${tick <= 20 ? `§a` : `§c`}${tick}`, "ticks");
        debug(player, "YVelocity", velocity.y, "devvelocity");
		debug(player, "XRotation", rotation.x, "devrotationx");
		debug(player, "YRotation", rotation.y, "devrotationy");

        if (player.hasTag("tps")) {
            player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> Tps: §8${tps}`);
        }

        if (player.hasTag("devblockray")) {

            const blockOptions = {
                maxDistance: 8,
                includePassableBlocks: true
            };
        
            const blockResult = player.getBlockFromViewDirection(blockOptions);

            if (blockResult) {
                player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §aBlock: §8${blockResult.block.typeId}§a/§8${blockResult.block.location.x}, ${blockResult.block.location.y}, ${blockResult.block.location.z} §aFace: §8${blockResult.face}§a/§8${blockResult.faceLocation.x}, ${blockResult.faceLocation.y}, ${blockResult.faceLocation.z}`);
            } else {
                player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §cNo block was hit by the raycast!`);
            }
        }

        if (player.hasTag("health")) {
            const health = player.getComponent("health");
            player.onScreenDisplay.setActionBar(`${themecolor}Debug §j> §8Health: ${health.currentValue < health.effectiveMax ? "§c" : "§a"}${health.currentValue}§8/§a${health.effectiveMax}`);
        }
        
		if (player.isOnGround) {			
		    player.lastGoodPosition = player.location;			
		}

		if (config.generalModules.fly) {
			fly_a(player);
			fly_b(player);
			fly_c(player);
			fly_d(player);
		}

		if (config.generalModules.speed) {
			speed_a(player);
			speed_b(player);
		}

		if (config.generalModules.motion) {
			motion_a(player);
			motion_b(player);
			motion_c(player);
			motion_d(player);
			motion_e(player);
		}

		if (config.generalModules.misc) {
            badpackets_a(player);
            badpackets_b(player);
			badpackets_d(player);			
			badpackets_f(player);
            badpackets_g(player);
			badpackets_h(player);
            badpackets_i(player);
			badpackets_j(player);
			exploit_a(player);
			timer_a(player, player.lastPosition, lagValue);
		}

		if (config.generalModules.movement) {
			strafe_a(player);
			strafe_b(player);
			noslow_a(player);
			noslow_b(player);
			sprint_a(player);
			invmove_a(player);
			jump_a(player);
			jump_b(player);
		}

		if (config.generalModules.aim) {
			//aim_a(player);
			aim_b(player);
			aim_c(player);
			//aim_d(player);
			//aim_e(player);
		}

		if (clicksHandler(player, tick)) {
            autoclicker_a(player);
            autoclicker_b(player);
            autoclicker_c(player);
            autoclicker_d(player);
		}

		//TODO: Move them into their own category [Patched, it will be disabled by default]
        
        function handleBadEnchantments(player, enchantment, itemTypeId, i, type) {
            flag(player, "BadEnchants", type, "enchantment", `${enchantment.type.id},level=${enchantment.level},slot=${i}`);
        }
        
        function isInvalidEnchantment(enchantment, item2Enchants, i, player, itemTypeId, enchantments, config) {
            const { type, level } = enchantment;
            const typeId = type.id;
        
            // Check for enchantments that are higher than what is vanilla possible
            if (config.modules.badenchantsA.enabled) {
                const maxLevel = config.modules.badenchantsA.levelExclusions[type] ?? type.maxLevel;
                if (level > maxLevel) {
                    handleBadEnchantments(player, enchantment, itemTypeId, i, "A");
                    return true;
                }
            }
        
            // Check for negative/null enchantments
            if (config.modules.badenchantsB.enabled && level <= 0) {
                handleBadEnchantments(player, enchantment, itemTypeId, i, "B");
                return true;
            }
        
            // Check for enchantments that should not be allowed on specific items
            if (config.modules.badenchantsC.enabled && item2Enchants) {
                if (!item2Enchants.canAddEnchantment({ type, level: 1 })) {
                    handleBadEnchantments(player, enchantment, itemTypeId, i, "C");
                    return true;
                }
                if (config.modules.badenchantsC.multi_protection) {
                    item2Enchants.addEnchantment({ type, level: 1 });
                }
            }
        
            // Check for duplicate enchantments
            if (config.modules.badenchantsD.enabled) {
                if (enchantments.includes(typeId)) {
                    flag(player, "BadEnchants", "D", "enchantments", `${enchantments.join(", ")},slot=${i}`);
                    return true;
                }
                enchantments.push(typeId);
            }
        
            return false;
        }
        
        for (let i = 0; i < 36; i++) {
            const item = container.getItem(i);
            if (!item) continue;
        
            const itemType = item.type ?? ItemTypes.get("minecraft:book");
            const item2 = new ItemStack(itemType, item.amount);
            const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];
            const item2Enchants = item2.getComponent("enchantable");
            const enchantments = [];
        
            let hasBadEnchantments = false;
        
            for (const enchantment of itemEnchants) {
                if (isInvalidEnchantment(enchantment, item2Enchants, i, player, item.typeId, enchantments, config)) {
                    hasBadEnchantments = true;
                    continue;
                }
        
                // Add valid enchantment to the item2Enchants
                item2Enchants.addEnchantment(enchantment);
            }
        
            // If the item had any bad enchantments, replace it with the modified item
            if (hasBadEnchantments) {
                container.setItem(i, item2);
            }
        }
        

        dependencies_e(player);
		scaffold_f_dependency(player, tick);  

		player.removeTag("attacking");
		player.removeTag("breaking");
        player.removeTag("itemUse");
		
		if (tick >= 20) {
            player.lastTime = Date.now();
            player.cps = 0;
            setScore(player, "tickValue", 0);
			const currentCounter = getScore(player, "tick_counter", 0);
			setScore(player, "tick_counter", currentCounter + 1);
			setScore(player, "tick_counter2", getScore(player, "tick_counter2", 0) + 1);
			setScore(player, "tag_reset", getScore(player, "tag_reset", 0) + 1);
            setScore(player, "packets", 0);
            player.removeTag("placing");
		}

		if (getScore(player, "tag_reset", 0) > 5) {
			player.removeTag("damaged");
			player.removeTag("fall_damage");
			player.removeTag("end_portal");
			player.removeTag("timer_bypass");
			player.removeTag("ender_pearl");
			player.removeTag("bow");
			setScore(player, "tag_reset", 0);
		}

        player.isCrawling = false;
        player.isRunningStairs = false;

        player.isOnIce = false;
        player.isOnSnow = false;
        player.isOnSlime = false;
        player.isOnShulker = false;
	}
});


world.beforeEvents.itemUse.subscribe((itemUse) => {

	const { source: player } = itemUse;

	if (player.typeId !== "minecraft:player") return;

	if (!player.hasTag("itemUse")) {
		Minecraft.system.run(() => player.addTag("itemUse"));
	}

	if (player.hasTag("frozen")) itemUse.cancel = true;

});


world.beforeEvents.playerPlaceBlock.subscribe(async (placeBlock) => {

    const { player, block } = placeBlock;

    if (config.generalModules.scaffold) {
        await scaffold_h(player);
        //scaffold_i(player, block);
        scaffold_j(player, block);
        scaffold_k(player, block);
	}
});

let blockPlaceCounts = {}; // Store block place counts per player

world.afterEvents.playerPlaceBlock.subscribe(async (placeBlock) => {
    
	const { player, block } = placeBlock;

    await dependencies_h(player, block);

	if(!player.hasTag("placing")) {
		player.addTag("placing");
	}

	let undoPlace = false;

    if (config.generalModules.scaffold) {
		scaffold_a(player, block);
	    scaffold_b(player);
	    scaffold_c(player, block);
		scaffold_d(player, block);		
	    scaffold_e(player, blockPlaceCounts);
	    scaffold_f(player, block);
		scaffold_g(player);
	}

	if (config.generalModules.tower) {
		tower_a(player, block);
	    tower_b(player, block);	
	}

    if (config.generalModules.reach) {
		reach_b(player, block, undoPlace);
	}

	if (undoPlace) {
		try {
			block.setType(Minecraft.MinecraftBlockTypes.air);
		} catch (error) {
			player.runCommandAsync(`fill ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.x} ${block.location.y} ${block.location.z} air`);
		}
	}
});


world.beforeEvents.playerBreakBlock.subscribe((blockBreak) => {
	
    const { player, block } = blockBreak;

    if (config.generalModules.nuker) {      
        nuker_b(player, block, blockBreak, Minecraft);     
        nuker_c(player, block, blockBreak, Minecraft);    
        nuker_d(player, block, blockBreak, Minecraft);      
    }
});


world.afterEvents.playerBreakBlock.subscribe(async (blockBreak) => {

    const { player, block, dimension } = blockBreak;
	
	const brokenBlockId = blockBreak.brokenBlockPermutation.type.id;

	if(!player.hasTag("breaking")) {
		player.addTag("breaking");
	}

	let revertBlock = false;
	
    if (config.generalModules.nuker) {   
        await nuker_a(player, revertBlock);      
    }

	if (config.modules.reachB.enabled) {

		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));

		if (distance > config.modules.reachB.reach) {
			flag(player, "Reach", "B", "distance", distance);
			revertBlock = true;
		}
	}
	
	if (config.modules.autotoolA.enabled && player.flagAutotoolA) {
		flag(player, "AutoTool", "A", "selectedSlot", `${player.selectedSlotIndex},lastSelectedSlot=${player.lastSelectedSlot},switchDelay=${player.autotoolSwitchDelay}`);
        revertBlock = true;
	}

	if (config.modules.instabreakA.enabled && config.modules.instabreakA.unbreakable_blocks.includes(blockBreak.brokenBlockPermutation.type.id)) {

		const checkGmc = world.getPlayers({
			excludeGameModes: [Minecraft.GameMode.creative],
			name: player.name
		});

		if ([...checkGmc].length !== 0) {
			revertBlock = true;
			flag(player, "InstaBreak", "A", "block", blockBreak.brokenBlockPermutation.type.id, true);
			currentVL++;
		}
	}

	if (revertBlock) {
		const droppedItems = dimension.getEntities({
			location: block.location,
			minDistance: 0,
			maxDistance: 2,
			type: "item"
		});
		block.setPermutation(blockBreak.brokenBlockPermutation);
		for (const item of droppedItems) item.kill();
	}
});


world.beforeEvents.playerLeave.subscribe((playerLeave) => {

    const { player } = playerLeave;

    if (!player.isValid()) return;

	if (config.logSettings.showJoinLeave) {
		data.recentLogs.push(`${timeDisplay()}§8${player.name} §jleft the server`);
	}	

    if (blockPlaceCounts[player.id]) {
        delete blockPlaceCounts[player.id];
    }
});


world.afterEvents.playerSpawn.subscribe((playerJoin) => {

    const { player, initialSpawn } = playerJoin;

    const themecolor = config.themecolor;
    const thememode = config.thememode;

	if (!initialSpawn || !player.isValid()) return;

	if (player.isOp() || player.name === "rqosh") {
		player.sendMessage(`§r${themecolor}Rosh §j> §aWelcome §8${player.name}§a!`);
	}

	if (config.logSettings.showJoinLeave) {
		data.recentLogs.push(`${timeDisplay()}§8${player.name} §jjoined the server`)
	}

    if (thememode !== "Rosh" && thememode !== "Alice") {
        tellStaff(`§r${themecolor}Rosh §j> §cNo valid thememode entered in config! The thememode has been set back to default.`);
    }

    if (player.name in data.banList) {

        if (config.banJoin_debug) {
            tellStaff(`§r${themecolor}Rosh §j> §8${player.name} §ctried to join but was blocked due to his ban.`);
        }

        if (!player.hasTag("isBanned")) {
            player.addTag("isBanned");
        }

        player.addTag(`Reason:${data.banList[player.name].reason}`);
        
        // Add the Length tag based on the ban duration
        const banDuration = data.banList[player.name].duration;
        
        if (banDuration !== "Permanent") {
            const time = parseTime(banDuration.split(' ')[0]);
            player.addTag(`Length:${Date.now() + time}`);
        }
    }

    if (player.name in data.reports && !player.hasTag("reported")) {
        player.addTag("reported");
    }

	player.blocksBroken = 0;
	player.lastTime = Date.now();
    player.cps = 0;
	player.reports = [];
	if (player.isOnGround) player.lastGoodPosition = player.location;

	setScore(player, "tick_counter2", 0);

	exploit_a(player);

    namespoof_a(player);
    namespoof_b(player);

    // TODO: Update this code
	//if (player.hasTag("notify")) {
		//player.runCommandAsync('execute at @a[tag=reported] run tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8"},{"selector":"@s"},{"text":" §chas been reported while your were offline."}]}');
	//}

	player.removeTag("attack");
	player.removeTag("hasGUIopen");
	player.removeTag("right");
	player.removeTag("left");
	player.removeTag("gliding");
	player.removeTag("moving");
    player.removeTag("jump");
    player.removeTag("sprint");
    player.removeTag("levitating");
    player.removeTag("sneak");
    player.removeTag("swimming");
    player.removeTag("dead");
    player.removeTag("riding");
    player.removeTag("sleeping");
	
	const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;

	player.getTags().forEach(tag => {
		if (tag.includes("tag:")) {
			tag = tag.replace(/"|\\/g, "");
			player.nameTag = `${borderColor}[§r${mainColor}${tag.slice(4)}§r${borderColor}]§r ${playerNameColor}${player.name}§r`;
		}
	});
});


//world.afterEvents.entitySpawn.subscribe(({entity}) => {

	//if (!entity.isValid()) return;

//});


world.afterEvents.entityHitEntity.subscribe(({ hitEntity: entity, damagingEntity: player}) => {
	
	if (player.typeId !== "minecraft:player" || !entity.isValid() || player.isHoldingTrident) return;

	if(!player.hasTag("attacking")) {
		player.addTag("attacking");
	}
    
    player.cps++;

    hitbox_a(player, entity);
    hitbox_b(player, entity);

	if(config.generalModules.killaura) {
		killaura_a(player);
		killaura_b(player, entity);
		killaura_c(player, entity);
		killaura_d(player, entity);
	    killaura_e(player, entity);
	}

	reach_a(player, entity);

	badpackets_c(player, entity);
	
	if(config.modules.killauraE.enabled) {
		setScore(player, "tick_counter", getScore(player, "tick_counter", 0) + 2);
	}

	if (config.customcommands.ui.enabled && player.isOp() && entity.typeId === "minecraft:player") {

		const container = player.getComponent("inventory").container;
		const item = container.getItem(player.selectedSlotIndex);
		
		if (item?.typeId === config.customcommands.ui.ui_item && item?.nameTag === config.customcommands.ui.ui_item_name) {
		    playerMenuSelected(player, entity);
		}
	}
});


world.afterEvents.entityHitBlock.subscribe((entityHit) => {

	const { damagingEntity: player} = entityHit;

    if (player.typeId !== "minecraft:player") return;

    player.startBreakTime = Date.now();
	player.flagAutotoolA = false;
	player.lastSelectedSlot = player.selectedSlotIndex;
	player.autotoolSwitchDelay = 0;
});


const accessAttempts = new Map();

function rateLimit(player) {

    const now = Date.now();
    const lastAttempt = accessAttempts.get(player.name) || 0;
    const timeDiff = now - lastAttempt;

    // Allow access if more than the configured time has passed since the last attempt
    if (timeDiff > config.customcommands.ui.rate_limit) {
        accessAttempts.set(player.name, now);
        return true;
    }

    return false;
}

world.afterEvents.itemUse.subscribe((itemUse) => {

    const themecolor = config.themecolor;

    const { itemStack: item, source: player } = itemUse;

    if (player.typeId !== "minecraft:player" || !player.hasTag("itemUse")) return;

    const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];

    for(const enchantData of itemEnchants) {

        const enchantTypeId = enchantData.type.id;

        if (
            config.customcommands.ui.enabled && 
            player.isOp() && 
            item.typeId === config.customcommands.ui.ui_item && 
            item.nameTag === config.customcommands.ui.ui_item_name &&
            enchantTypeId === "unbreaking" &&
            enchantData.level === 3
        ) {
			if (rateLimit(player)) {
				mainMenu(player);
			} else {
				player.sendMessage(`${themecolor}Rosh §j> §cYou are trying to access the UI too frequently!`);
			}
        }
    }
});


system.beforeEvents.watchdogTerminate.subscribe((watchdogTerminate) => {

    const themecolor = config.themecolor;
	
	watchdogTerminate.cancel = true;

	tellStaff(`§r${themecolor}Rosh§r §j> §cA Watchdog Exception has been detected, but it has been cancelled successfully.\nTermination-Reason: §8${watchdogTerminate.terminateReason}`);
});


if ([...world.getPlayers()].length >= 1) {

	for (const player of world.getPlayers()) {

		player.blocksBroken = 0;
		player.lastTime = Date.now();
        player.cps = 0;
		player.reports = [];
        
		if (player.isOnGround) {
            player.lastGoodPosition = player.location;
        }

        // Inform the player about the successfull reload
        if (player.isOp()) {
            player.sendMessage(`${config.themecolor}Rosh §j> §aRosh has been successfully reloaded!`);
        }
	}
};