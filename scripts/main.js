import * as Minecraft from "@minecraft/server";
import { system, world, ItemTypes, ItemStack } from "@minecraft/server";
import config from "./data/config.js";
import data from "./data/data.js";
import { tag_system, setTitle } from "./utils/gameUtil.js";
import { flag, ban, getScore, setScore, getSpeed, aroundAir, tellStaff, debug } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import { mainGui, playerSettingsMenuSelected } from "./ui/mainGui.js";

// Misc
import { badpackets_c } from "./checks/misc/badpackets/badpacketsC.js";
import { badpackets_d } from "./checks/misc/badpackets/badpacketsD.js";
import { badpackets_f } from "./checks/misc/badpackets/badpacketsF.js";
import { badpackets_h } from "./checks/misc/badpackets/badpacketsH.js";
import { badpackets_i } from "./checks/misc/badpackets/badpacketsI.js";
import { badpackets_j } from "./checks/misc/badpackets/badpacketsJ.js";
import { exploit_a } from "./checks/misc/exploit/exploitA.js";
import { exploit_b } from "./checks/misc/exploit/exploitB.js";
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
import { scaffold_f, dependencies_f } from "./checks/world/scaffold/scaffoldF.js";
import { scaffold_g } from "./checks/world/scaffold/scaffoldG.js";
import { tower_a } from "./checks/world/tower/towerA.js";
import { tower_b } from "./checks/world/tower/towerB.js";

// Combat
import { killaura_a } from "./checks/combat/killaura/killauraA.js";
import { killaura_b } from "./checks/combat/killaura/killauraB.js";
import { killaura_c } from "./checks/combat/killaura/killauraC.js";
import { killaura_d } from "./checks/combat/killaura/killauraD.js";
import { killaura_e, dependencies_e } from "./checks/combat/killaura/killauraE.js";
import { killaura_f } from "./checks/combat/killaura/killauraF.js";
import { killaura_g } from "./checks/combat/killaura/killauraG.js";
import { hitbox_a } from "./checks/combat/hitbox/hitboxA.js";
import { reach_a } from "./checks/combat/reach/reachA.js";
import { autoclicker_a } from "./checks/combat/autoclicker/autoclickerA.js";
//import { aim_a } from "./checks/combat/aim/aimA.js";
import { aim_b } from "./checks/combat/aim/aimB.js";
import { aim_c } from "./checks/combat/aim/aimC.js";
// FIXME:
//import { aim_d } from "./checks/combat/aim/aimD.js";
//import { aim_e } from "./checks/combat/aim/aimE.js";


let tps = 20;
let lagValue = 1;
let lastDate = Date.now();
let themecolor = config.themecolor;


world.beforeEvents.chatSend.subscribe((msg) => {

	const { sender: player, message } = msg;

	if(message.includes("horion") || message.includes("borion") || message.includes("packet") || message.includes("vector") || message.includes("prax") || message.includes("zephyr") || message.includes("nuvola")  || message.includes("aelous") || message.includes("disepi") || message.includes("ambrosial") || message.includes("utility mod") || message.includes("nigga") || message.includes("niger")) {	
		msg.cancel = true;
	}

	if(message.includes("Horion") || message.includes("Borion") || message.includes("Packet") || message.includes("Vector") || message.includes("Prax") || message.includes("Zephyr") || message.includes("Nuvola") || message.includes("Aelous") || message.includes("Disepi") || message.includes("Ambrosial") || message.includes("Lunaris") || message.includes("Nigga") || message.includes("Niger")) {
		msg.cancel = true;
	}

	if(player.hasTag("isMuted")) {
		msg.cancel = true;
		player.sendMessage(`§r${themecolor}Rosh §j> §cUnable to send that message - You are muted!`);
	}

	commandHandler(msg);
	if(config.logSettings.showChat) {
		data.recentLogs.push(`§r<${player.nameTag}> ${msg.message}`);
	}

	if(!msg.cancel) {
		if(player.name !== player.nameTag) {
			world.sendMessage(`§r<${player.nameTag}> ${msg.message}`);
			msg.cancel = true;
		} else if(player.name === player.nameTag) {
			world.sendMessage(`<${player.nameTag}> ${msg.message.replace(/[^\x00-\xFF]/g, "")}`);
			msg.cancel = true;
		}
	}
});


world.afterEvents.chatSend.subscribe(({ sender: player }) => {

	if(config.modules.spammerA.enabled && player.isSprinting && player.hasTag("ground") && !player.isJumping) {
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

    let currentVL;

    if(system.currentTick % 20 == 0) {

	   const deltaDate = Date.now() - lastDate;
	   const lag = deltaDate / 1000;

	   tps = Minecraft.TicksPerSecond / lag;
	   lagValue = lag;
	   lastDate = Date.now();
    }

	for(const player of world.getPlayers()) {

		const rotation = player.getRotation();
		const velocity = player.getVelocity();
		const speed = getSpeed(player);

		player.removeTag("noPitchDiff");
		
		const selectedSlot = player.selectedSlotIndex;

		if(player.hasTag("isBanned")) ban(player);
		if(player.blocksBroken >= 1 && config.modules.nukerA.enabled) player.blocksBroken = 0;
		if(player.entitiesHit?.length >= 1 && config.modules.killauraC.enabled) player.entitiesHit = [];

		if(Date.now() - player.startBreakTime < config.modules.autotoolA.startBreakDelay && player.lastSelectedSlot !== selectedSlot) {
			player.flagAutotoolA = true;
			player.autotoolSwitchDelay = Date.now() - player.startBreakTime;
		}
		if(player.flagNamespoofA) {
			flag(player, "Namespoof", "A", "nameLength", player.name.length, false);
			player.flagNamespoofA = true;
			currentVL++;
		}
		if(player.flagNamespoofB) {
			flag(player, "Namespoof", "B", undefined, false);
			player.flagNamespoofB = true;
			currentVL++;
		}
		if(player.hasTag("moving")) {
			player.runCommandAsync(`scoreboard players set @s xPos ${Math.floor(player.location.x)}`);
			player.runCommandAsync(`scoreboard players set @s yPos ${Math.floor(player.location.y)}`);
			player.runCommandAsync(`scoreboard players set @s zPos ${Math.floor(player.location.z)}`);
		}

		if(getScore(player, "kickvl", 0) > config.ViolationsBeforeBan / 2 && !player.hasTag("strict")) {
			try {
				player.addTag("strict");
			} catch (error) {
				player.runCommandAsync(`tag "${player.name}" add strict`);
			}
		}
		
		if(config.autoReset) {
			if(getScore(player, "tick_counter2", 0) > 300) {
				if(!player.hasTag("reported") && player.hasTag("strict")) {
					player.removeTag("strict");
				}
				player.runCommandAsync("function tools/resetwarns");
				setScore(player, "tick_counter2", 0);
			}
		}

		const blockBelow = player.dimension.getBlock({x: player.location.x, y: player.location.y - 1, z: player.location.z}) ?? {typeId: "minecraft:air"};

		if(blockBelow.typeId.includes("ice")) {
			player.addTag("ice");
		}
		if(blockBelow.typeId.includes("slime")) {
			player.addTag("slime");
		}
		if(player.hasTag("trident")) {
			setScore(player, "right", 0);
		}
		if(blockBelow.typeId.includes("end_portal")) {
			player.addTag("end_portal");
        }
		if(blockBelow.typeId.includes("stairs")) {
			player.addTag("stairs");
		}
		if(player.hasTag("slime")) {
			setScore(player, "tick_counter2", 0);
		}

		tag_system(player);	

		const tickValue = getScore(player, "tickValue", 0);
		setScore(player, "tickValue", tickValue + 1);


        // Invmove/A delay
        const invmove_delay = getScore(player, "invmove_delay", 0);
		if(player.hasTag("hasGUIopen")) {
			setScore(player, "invmove_delay", invmove_delay + 1);
		} else setScore(player, "invmove_delay", 0);


        // Fly/D delay
		const flyTime = getScore(player, "airTime", 0);
		if(!player.isOnGround && !player.hasTag("ground") && aroundAir(player)) {
			setScore(player, "airTime", flyTime + 1);
		} else setScore(player, "airTime", 0);

		if (player.hasTag("devtps")) {
			setTitle(player, undefined, undefined, `§r§uDebug §j> Tps: §8${tps}`);
		}

		debug(player, "Speed", speed, "devspeed");
		debug(player, "FallDistance", player.fallDistance, "devfalldistance");
        debug(player, "YVelocity", velocity.y, "devvelocity");
		debug(player, "XRotation", rotation.x, "devrotationx");
		debug(player, "YRotation", rotation.y, "devrotationy");

		if(player.isOnGround) {			
		    player.lastGoodPosition = player.location;			
		}

		
		if(config.generalModules.fly) {
			fly_a(player);
			fly_b(player);
			fly_c(player);
			fly_d(player);
		}

		if(config.generalModules.speed) {
			speed_a(player);
			speed_b(player);
		}

		if(config.generalModules.motion) {
			motion_a(player);
			motion_b(player);
			motion_c(player);
			motion_d(player);
			motion_e(player);
		}

		if(config.generalModules.misc) {
			badpackets_d(player);			
			badpackets_f(player);
			badpackets_h(player);
			badpackets_i(player);
			badpackets_j(player);
			exploit_a(player);
			exploit_b(player);
			timer_a(player, player.lastPosition, lagValue);
		}

		if(config.generalModules.movement) {
			strafe_a(player);
			strafe_b(player);
			noslow_a(player);
			noslow_b(player);
			sprint_a(player);
			invmove_a(player);
			jump_a(player);
			jump_b(player);
		}

		if(config.generalModules.aim) {
			//aim_a(player);
			aim_b(player);
			aim_c(player);
			//aim_d(player);
			//aim_e(player);
		}

		if(config.generalModules.autoclicker) {
			autoclicker_a(player);
		}

		
		const container = player.getComponent("inventory")?.container;

        for (let i = 0; i < 36; i++) {
            const item = container.getItem(i);
            if (!item) continue;

            const itemType = item.type ?? ItemTypes.get("minecraft:book");
            const item2 = new ItemStack(itemType, item.amount);
            const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];
            const item2Enchants = item2.getComponent("enchantable");
            const enchantments = [];

            let hasBadEnchantments = false;

            for (const enchantData of itemEnchants) {
                const enchantTypeId = enchantData.type.id;

                // Checks for enchantments that are higher than what is vanilla possible
                if (config.modules.badenchantsA.enabled) {
                    const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type] ?? enchantData.type.maxLevel;
                    if (enchantData.level > maxLevel) {
                        flag(player, "BadEnchants", "A", "enchantment", `${enchantTypeId},level=${enchantData.level},slot=${i}`);
                        hasBadEnchantments = true;
                        continue;
                    }
                }

                // Checks for negative/null enchantments
                if (config.modules.badenchantsB.enabled && enchantData.level <= 0) {
                    flag(player, "BadEnchants", "B", "enchantment", `${enchantTypeId},level=${enchantData.level},slot=${i}`);
                    hasBadEnchantments = true;
                    continue;
                }

                // Checks for enchantments that should not be allowed on specific items
                if (config.modules.badenchantsC.enabled && item2Enchants) {
                    if (!item2Enchants.canAddEnchantment({ type: enchantData.type, level: 1 })) {
                        flag(player, "BadEnchants", "C", "item", `${item.typeId},enchantment=${enchantTypeId},level=${enchantData.level},slot=${i}`);
                        hasBadEnchantments = true;
                        continue;
                    }

                    if (config.modules.badenchantsC.multi_protection) {
                        item2Enchants.addEnchantment({ type: enchantData.type, level: 1 });
                    }
                }

                // Checks for duplicate enchantments
                if (config.modules.badenchantsD.enabled) {
                    if (enchantments.includes(enchantTypeId)) {
                        flag(player, "BadEnchants", "D", "enchantments", `${enchantments.join(", ")},slot=${i}`);
                        hasBadEnchantments = true;
                        continue;
                    }

                    enchantments.push(enchantTypeId);
                }

                // Add valid enchantment to the item2Enchants
                item2Enchants.addEnchantment(enchantData);
            }

            // If the item had any bad enchantments, replace it with the modified item
            if (hasBadEnchantments) {
                container.setItem(i, item2);
            }
        }


        dependencies_e(player);
		dependencies_f(player, tickValue, velocity);

		
		player.removeTag("attacking");
		player.removeTag("itemUse");
		player.removeTag("breaking");
		
		if(tickValue > 19) {
			const currentCounter = getScore(player, "tick_counter", 0);
			setScore(player, "tick_counter", currentCounter + 1);
			setScore(player, "tick_counter2", getScore(player, "tick_counter2", 0) + 1);
			setScore(player, "tag_reset", getScore(player, "tag_reset", 0) + 1);
			setScore(player, "scaffold_g_reset", getScore(player, "scaffold_g_reset", 0) + 1);
			player.removeTag("snow");
		}

		if(getScore(player, "tag_reset", 0) > 5) {
			player.removeTag("slime")
			player.removeTag("placing");
			player.removeTag("ice");
			player.removeTag("damaged");
			player.removeTag("fall_damage");
			player.removeTag("end_portal");
			player.removeTag("stairs");
			player.removeTag("timer_bypass");
			player.removeTag("ender_pearl");
			player.removeTag("trident");
			player.removeTag("bow");
			setScore(player, "tag_reset", 0);
		}	
	}
});


world.afterEvents.playerPlaceBlock.subscribe((placeBlock) => {

	const { block, player } = placeBlock;

	if(!player.hasTag("placing")) {
		player.addTag("placing");
	}
	
	let undoPlace = false;

    if(config.generalModules.scaffold) {
		scaffold_a(player, block);
	    scaffold_b(player);
	    scaffold_c(player, block);
		scaffold_d(player, block);		
	    scaffold_e(player);
	    scaffold_f(player, block);
		scaffold_g(player);
	}

	if(config.generalModules.tower) {
		tower_a(player, block);
	    tower_b(player, block);	
	}

    if(config.generalModules.reach) {
		reach_b(player, block, undoPlace);
	}

	if(undoPlace === "true") {
		try {
			block.setType(Minecraft.MinecraftBlockTypes.air);
		} catch (error) {
			player.runCommandAsync(`fill ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.x} ${block.location.y} ${block.location.z} air`);
		}
	}

});


world.beforeEvents.playerBreakBlock.subscribe((blockBreak) => {
	
    const player = blockBreak.player;
    const block = blockBreak.block;

    if(config.generalModules.nuker) {      
        nuker_b(player, block, blockBreak, Minecraft);     
        nuker_c(player, block, blockBreak, Minecraft);    
        nuker_d(player, block, blockBreak, Minecraft);      
    }
});


world.afterEvents.playerBreakBlock.subscribe(async (blockBreak) => {

	const player = blockBreak.player
	const block = blockBreak.block
	const dimension = blockBreak.dimension;
	const brokenBlockId = blockBreak.brokenBlockPermutation.type.id;

	if(!player.hasTag("breaking")) {
		player.addTag("breaking");
	}

	let revertBlock = false;

	if(brokenBlockId === "minecraft:snow" || brokenBlockId === "minecraft:snow_layer") {
		player.addTag("snow");
	}
	
    if(config.generalModules.nuker) {   
        await nuker_a(player, revertBlock);      
    }

	if(config.modules.reachB.enabled) {

		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));

		if(distance > config.modules.reachB.reach) {
			flag(player, "Reach", "B", "distance", distance);
			revertBlock = true;
		}
	}
	
	if(config.modules.autotoolA.enabled && player.flagAutotoolA) {

		revertBlock = true;
		flag(player, "AutoTool", "A", "selectedSlot", `${player.selectedSlotIndex},lastSelectedSlot=${player.lastSelectedSlot},switchDelay=${player.autotoolSwitchDelay}`);
		currentVL++;
	}

	if(config.modules.instabreakA.enabled && config.modules.instabreakA.unbreakable_blocks.includes(blockBreak.brokenBlockPermutation.type.id)) {

		const checkGmc = world.getPlayers({
			excludeGameModes: [Minecraft.GameMode.creative],
			name: player.name
		});
		if([...checkGmc].length !== 0) {
			revertBlock = true;
			flag(player, "InstaBreak", "A", "block", blockBreak.brokenBlockPermutation.type.id, true);
			currentVL++;
		}
	}

	if(revertBlock) {
		const droppedItems = dimension.getEntities({
			location: block.location,
			minDistance: 0,
			maxDistance: 2,
			type: "item"
		});
		block.setPermutation(blockBreak.brokenBlockPermutation);
		for(const item of droppedItems) item.kill();
	}

});


world.beforeEvents.playerLeave.subscribe((playerLeave) => {

    const player = playerLeave.player

	if(config.logSettings.showJoinLeave) {
		data.recentLogs.push(`§8${player.name} §jleft the server`);
	}	

});


world.afterEvents.playerSpawn.subscribe((playerJoin) => {

	const { initialSpawn, player } = playerJoin;

	if(!initialSpawn) return;

	if(player.hasTag("op") || player.name === "rqosh") {
		player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r${themecolor}Rosh §j> §aWelcome §8${player.name}§a!"}]}`);
	}

	if(config.logSettings.showJoinLeave) {
		data.recentLogs.push(`§8${player.name} §jjoined the server`)
	}

	if(config.modules.spammerA.enabled) player.lastMessageSent = 0;
	if(config.modules.nukerA.enabled) player.blocksBroken = 0;
	if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
	if(config.modules.autoclickerA.enabled) player.cps = 0;
	if(config.modules.killauraB.enabled) player.lastLeftClick = NaN;
	if(config.modules.killauraC.enabled) player.entitiesHit = [];
	if(config.customcommands.report.enabled) player.reports = [];

	if(player.isOnGround) player.lastGoodPosition = player.location;
	player.gamemode = player.getGameMode();

	setScore(player, "tick_counter2", 0);

	exploit_a(player);
	
	player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/gm, "").trim();

	if(player.hasTag("notify")) {
		player.runCommandAsync('execute at @a[tag=reported] run tellraw @a[tag=notify] {"rawtext":[{"text":"§r§uRosh §j> §8"},{"selector":"@s"},{"text":" §chas been reported while your were offline."}]}');
	}

	player.removeTag("attack");
	player.removeTag("hasGUIopen");
	player.removeTag("right");
	player.removeTag("left");
	player.removeTag("ground");
	player.removeTag("gliding");
	player.removeTag("sprinting");
	player.removeTag("moving");
	player.removeTag("sleeping");
	
	const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;

	player.getTags().forEach(t => {
		if(t.includes("tag:")) {
			t = t.replace(/"|\\/g, "");
			player.nameTag = `${borderColor}[§r${mainColor}${t.slice(4)}${borderColor}]§r ${playerNameColor}${player.name}`;
		}
	});
	
	if(config.modules.namespoofA.enabled) {

		// checks if 2 players are logged in with the same name
		// minecraft adds a sufix to the end of the name which we detect
		if(player.name.endsWith(')') && (player.name.length > config.modules.namespoofA.maxNameLength + 3 || player.name.length < config.modules.namespoofA.minNameLength))
			player.flagNamespoofA = true;

		if(!player.name.endsWith(')') && (player.name.length < config.modules.namespoofA.minNameLength || player.name.length > config.modules.namespoofA.maxNameLength))
			player.flagNamespoofA = true;

		if(player.flagNamespoofA) {
			const extraLength = player.name.length - config.modules.namespoofA.maxNameLength;
			player.nameTag = player.name.slice(0, -extraLength) + "...";
		}
	}

	if(config.modules.namespoofB.enabled && config.modules.namespoofB.regex.test(player.name)) player.flagNamespoofB = true;

});


world.afterEvents.entitySpawn.subscribe(({entity}) => {

	if(!entity.isValid()) return;

});


world.afterEvents.entityHitEntity.subscribe(({ hitEntity: entity, damagingEntity: player}) => {
	
	if(player.typeId !== "minecraft:player" || !entity.isValid()) return;

	if(!player.hasTag("attacking")) {
		player.addTag("attacking");
	}

	if(config.modules.killauraB.enabled && !player.hasTag("trident") && !player.getEffect("haste")) {

		system.runTimeout(() => {

			const swingDelay = Date.now() - player.lastLeftClick;

			if(swingDelay > config.modules.killauraB.max_swing_delay) {
				flag(player, "Killaura", "B", "Combat", `swingDelay=${swingDelay}`);
			}

		}, config.modules.killauraB.wait_ticks);
	}

	if(config.generalModules.killaura) {
		killaura_a(player);
		killaura_b(player, entity);
		killaura_c(player, entity, player.entitiesHit);
		killaura_d(player, entity);
	    killaura_e(player, entity);
	    //killaura_f(player, entity);
		//killaura_g(player, entity);
	}

	hitbox_a(player, entity);

	reach_a(player, entity);

	badpackets_c(player, entity);
	
	if(config.modules.killauraE.enabled) {
		setScore(player, "tick_counter", getScore(player, "tick_counter", 0) + 2);
	}

	if(config.customcommands.ui.enabled && player.hasTag("op") && entity.typeId === "minecraft:player") {

		const container = player.getComponent("inventory").container;
		const item = container.getItem(player.selectedSlotIndex);
		
		if(config.customcommands.ui.enabled && player.hasTag("op") && item?.typeId === config.customcommands.ui.ui_item && item?.nameTag === config.customcommands.ui.ui_item_name) {
		    playerSettingsMenuSelected(player, entity);
		}
	}

	if(config.generalModules.autoclicker) {
		player.cps++;
	}

});


world.afterEvents.entityHitBlock.subscribe((entityHit) => {

	const { damagingEntity: player} = entityHit;

	player.flagAutotoolA = false;
	player.lastSelectedSlot = player.selectedSlotIndex;
	player.startBreakTime = Date.now();
	player.autotoolSwitchDelay = 0;

});


world.beforeEvents.itemUse.subscribe((itemUse) => {

	const { source: player } = itemUse;

	if(player.typeId !== "minecraft:player") return;

	if(!player.hasTag("itemUse")) {
		Minecraft.system.run(() => player.addTag("itemUse"));
	}

	if(player.hasTag("freeze")) itemUse.cancel = true;

});


const accessAttempts = new Map();
function rateLimit(player) {
    const now = Date.now();
    const lastAttempt = accessAttempts.get(player.name) || 0;
    const timeDiff = now - lastAttempt;

    // Allow access if more than config time have passed since the last attempt
	// Prevents cheaters from accessing the UI by spamming so fast that theres a chance that you can glitch in (but I havent seen this kind of method yet)
    if (timeDiff > config.customcommands.ui.rate_limit) {
        accessAttempts.set(player.name, now);
        return true;
    }
    return false;
}

world.afterEvents.itemUse.subscribe((itemUse) => {

    const { itemStack: item, source: player } = itemUse;

    if (player.typeId !== "minecraft:player" || !player.hasTag("itemUse")) return;

    const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];

    for(const enchantData of itemEnchants) {

        const enchantTypeId = enchantData.type.id;

        if (config.customcommands.ui.enabled && 
            player.hasTag("op") && 
            item.typeId === config.customcommands.ui.ui_item && 
            item.nameTag === config.customcommands.ui.ui_item_name &&
            enchantTypeId === "unbreaking" &&
            enchantData.level === 3
        ) {
			if (rateLimit(player)) {
				mainGui(player);
			} else {
				player.runCommandAsync(`tellraw @s[tag=op] {"rawtext":[{"text":"§r${themecolor}Rosh §j> §cYou are trying to access the UI too frequently!"}]}`);
			}
        }
    }
});

system.afterEvents.scriptEventReceive.subscribe(({id, sourceEntity }) => {

	if(!sourceEntity) return;

	const splitId = id.split(":");
	switch(splitId[1]) {
		case "left":
			sourceEntity.lastLeftClick = Date.now();
	}
});

system.beforeEvents.watchdogTerminate.subscribe((watchdogTerminate) => {
	
	watchdogTerminate.cancel = true;

	tellStaff(`§r${themecolor}Rosh§r §j> §cA Watchdog Exception has been detected, but it has been cancelled successfully.\nTermination-Reason: §8${watchdogTerminate.terminateReason}`);
});


if([...world.getPlayers()].length >= 1) {
	for(const player of world.getPlayers()) {

		if(config.modules.spammerA.enabled) player.lastMessageSent = 0;
		if(config.modules.nukerA.enabled) player.blocksBroken = 0;
		if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
		if(config.modules.autoclickerA.enabled) player.cps = 0;
		if(config.modules.killauraB.enabled) player.lastLeftClick = NaN;
		if(config.modules.killauraC.enabled) player.entitiesHit = [];
		if(config.customcommands.report.enabled) player.reports = [];
		
		if(player.isOnGround) player.lastGoodPosition = player.location;
		player.gamemode = player.getGameMode();
	}
};