import * as Minecraft from "@minecraft/server";
import * as Network from "@minecraft/server-net";
import { system, world, ItemTypes, ItemStack } from "@minecraft/server";
import config from "./data/config.js";
import data from "./data/data.js";
import { loadPlayerPrototypes, loadEntityPrototypes } from "./data/prototype.js";
import { Memory } from "./utils/Memory.js";
import { flag, ban, convertToMs, getScore, timeDisplay, tellStaff } from "./util.js";
import { mainMenu, rateLimit } from "./ui/mainMenu.js";
import { playerMenuSelected } from "./ui/main/playerMenu.js";

// Import Miscellaneous checks
import { badpackets_b } from "./checks/misc/badpackets/badpacketsB.js";
import { badpackets_c } from "./checks/misc/badpackets/badpacketsC.js";
import { badpackets_e } from "./checks/misc/badpackets/badpacketsE.js";
import { badpackets_f } from "./checks/misc/badpackets/badpacketsF.js";
import { badpacketsH } from "./checks/misc/badpackets/badpacketsH.js";
import { badpacketsJ } from "./checks/misc/badpackets/badpacketsJ.js";
import { exploitA } from "./checks/misc/exploit/exploitA.js";
import { namespoofA } from "./checks/misc/namespoof/namespoofA.js";
import { namespoofB } from "./checks/misc/namespoof/namespoofB.js";
import { inventoryA } from "./checks/misc/inventory/inventoryA.js";
import { inventoryB } from "./checks/misc/inventory/inventoryB.js";
import { timerA } from "./checks/misc/timer/timerA.js";

// Import Movement related checks
import { speed_a } from "./checks/movement/speed/speedA.js";
import { speed_b } from "./checks/movement/speed/speedB.js";
import { fastclimbA } from "./checks/movement/fastclimb/fastclimbA.js";
import { motionA } from "./checks/movement/motion/motionA.js";
import { motion_b } from "./checks/movement/motion/motionB.js";
import { motion_c } from "./checks/movement/motion/motionC.js";
import { motion_d } from "./checks/movement/motion/motionD.js";
import { motion_e } from "./checks/movement/motion/motionE.js";
import { flyA } from "./checks/movement/fly/flyA.js";
import { flyB } from "./checks/movement/fly/flyB.js";
import { flyC } from "./checks/movement/fly/flyC.js";
import { flyD } from "./checks/movement/fly/flyD.js";
import { flyE } from "./checks/movement/fly/flyE.js";
import { flyF } from "./checks/movement/fly/flyF.js";
import { strafe_a } from "./checks/movement/strafe/strafeA.js";
import { strafe_b } from "./checks/movement/strafe/strafeB.js";
import { noslowA } from "./checks/movement/noslow/noslowA.js";
import { noslowB } from "./checks/movement/noslow/noslowB.js";
import { noslowC } from "./checks/movement/noslow/noslowC.js";
import { sprintA } from "./checks/movement/sprint/sprintA.js";
import { sprintB } from "./checks/movement/sprint/sprintB.js";
import { sprintC } from "./checks/movement/sprint/sprintC.js";
import { jumpA } from "./checks/movement/jump/jumpA.js";

// Import Block related checks
import { nukerA } from "./checks/world/nuker/nukerA.js";
import { nukerB } from "./checks/world/nuker/nukerB.js";
import { nukerC } from "./checks/world/nuker/nukerC.js";
import { nukerD } from "./checks/world/nuker/nukerD.js";
import { reachB } from "./checks/world/reach/reachB.js";
import { scaffold_a } from "./checks/world/scaffold/scaffoldA.js";
import { scaffold_b } from "./checks/world/scaffold/scaffoldB.js";
import { scaffold_c } from "./checks/world/scaffold/scaffoldC.js";
import { scaffold_d } from "./checks/world/scaffold/scaffoldD.js";
import { scaffold_e } from "./checks/world/scaffold/scaffoldE.js";
import { scaffold_f, scaffold_f_dependency } from "./checks/world/scaffold/scaffoldF.js";
import { scaffold_g } from "./checks/world/scaffold/scaffoldG.js";
import { scaffold_h, dependencies_h } from "./checks/world/scaffold/scaffoldH.js";
import { scaffold_j } from "./checks/world/scaffold/scaffoldJ.js";
import { scaffold_k } from "./checks/world/scaffold/scaffoldK.js";
import { tower_a } from "./checks/world/tower/towerA.js";
import { tower_b } from "./checks/world/tower/towerB.js";

// Import Combat related checks
import { killauraA } from "./checks/combat/killaura/killauraA.js";
import { killauraB } from "./checks/combat/killaura/killauraB.js";
import { killauraC } from "./checks/combat/killaura/killauraC.js";
import { killauraD } from "./checks/combat/killaura/killauraD.js";
import { killauraE } from "./checks/combat/killaura/killauraE.js";
import { hitbox_a } from "./checks/combat/hitbox/hitboxA.js";
import { hitbox_b } from "./checks/combat/hitbox/hitboxB.js";
import { reachA } from "./checks/combat/reach/reachA.js";
import { autoclickerA } from "./checks/combat/autoclicker/autoclickerA.js";
import { autoclickerB } from "./checks/combat/autoclicker/autoclickerB.js";
import { autoclickerC } from "./checks/combat/autoclicker/autoclickerC.js";
import { autoclickerD } from "./checks/combat/autoclicker/autoclickerD.js";
import { autoclickerE } from "./checks/combat/autoclicker/autoclickerE.js";
import { aimA } from "./checks/combat/aim/aimA.js";
import { aimB } from "./checks/combat/aim/aimB.js";
import { aimC } from "./checks/combat/aim/aimC.js";

import { debugHandler } from "./handlers/debugHandler.js";
import { clicksHandler } from "./handlers/clicksHandler.js";
import { commandHandler } from "./handlers/commandHandler.js";
import { movementHandler } from "./handlers/movementHandler.js";
import { rotationHandler } from "./handlers/rotationHandler.js";

import { manageCurrentTick } from "./handlers/playerManager/manageCurrentTick.js";
import { manageFootblock } from "./handlers/playerManager/manageFootblock.js";
import { manageLastTick } from "./handlers/playerManager/manageLastTick.js";
import { manageTickResetting } from "./handlers/playerManager/manageTickResetting.js";

loadPlayerPrototypes();
loadEntityPrototypes();

let tps = 20;
let lagValue = 1;
let lastDate = Date.now();

system.runInterval(() => {
    
    if (system.currentTick % 20 == 0) {
        const deltaDate = Date.now() - lastDate;
        const lag = deltaDate / 1000;
        
        tps = Minecraft.TicksPerSecond / lag;
        lagValue = lag;
        lastDate = Date.now();
    }
    
    for (const player of world.getAllPlayers()) {
        
        if (player.isBanned()) {
            const gotBanned = player.ban();

            if (gotBanned) {
                continue; // Skip this player iteration if they are banned
            }
        }

        if (!player.isValid()) {
            continue; // Skip this player iteration if their EntityLifeTimeState is unloaded
        }

        manageCurrentTick(player);
        manageFootblock(player);

        debugHandler(player, tps);
        

        const movementData = movementHandler(player);
        
        if (movementData) {
            flyA(player);
            flyB(player);
            flyC(player);
            flyD(player);
            flyE(player);
            flyF(player);
            
            motionA(player);
            motion_b(player);
            motion_c(player);
            motion_d(player);
            motion_e(player);

            timerA(player, lagValue);

            fastclimbA(player);
    
            speed_a(player);
            speed_b(player);
            
            strafe_a(player);
            strafe_b(player);
            
            noslowA(player);
            noslowB(player);
            noslowC(player);
            
            sprintA(player);
            sprintB(player);
            sprintC(player);
            
            jumpA(player);
        }
        
        
        badpackets_b(player);
        badpackets_f(player);
        badpacketsH(player);
        badpacketsJ(player);
        
        exploitA(player);

        inventoryA(player);
        inventoryB(player);
        
        const rotationData = rotationHandler(player);
        
        if (rotationData) {
            aimA(player);
            aimB(player);
            aimC(player);
        }

        const clicksData = clicksHandler(player, getScore(player, "currentTick", 0));
        
        if (clicksData) {
            autoclickerA(player);
            autoclickerB(player);
            autoclickerC(player);
            autoclickerD(player);
            autoclickerE(player);

            // Update the player's last clicks per second using the returned value by the clicks handler
            player.setLastCps(clicksData.currentCps);
        }
        
        scaffold_f_dependency(player, getScore(player, "currentTick", 0));
        

        manageLastTick(player);
        manageTickResetting(player);
    }
});


const filter = {
    monitoredPacketIds: [""],
    ignoredPacketIds: [""]
}

Network.beforeEvents.packetReceive.subscribe((packet) => {
    
    const {packetId, packetSize, sender: player} = packet;

    if (!player || !player.isValid()) return;
    
    if (player.hasTag("packetlogger")) {
        player.sendMessage(`${config.themecolor}Rosh §j> §8${packetId} §j(§8${packetSize} bytes§j)`);
    }

}/** , filter */);


world.beforeEvents.chatSend.subscribe((msg) => {

    const themecolor = config.themecolor;
	const { sender: player, message } = msg;
    
    badpackets_e(player, message, msg);
    
    if (player.isMuted()) {
        msg.cancel = true;
        player.sendMessage(`${themecolor}Rosh §j> §cUnable to send that message - You are muted!`);
	}

	commandHandler(msg);

	if (config.logSettings.showChat) {
        data.recentLogs.push(`${timeDisplay()}§r<${player.nameTag}> ${message}`);
    }

	if (!msg.cancel) {
		if (player.name !== player.nameTag) {
			world.sendMessage(`§r<${player.nameTag}> ${message}`);
			msg.cancel = true;
		} else {
			world.sendMessage(`<${player.nameTag}> ${message.replace(/[^\x00-\xFF]/g, "")}`);
			msg.cancel = true;
		}
	}
});


world.afterEvents.entityHurt.subscribe((data) => {
    
    const player = data.hurtEntity;
    
    if (!player.isPlayer()) return;
    
    player.addTag("damaged");
    
    if (data.damageSource.cause === "fall") {
        player.addTag("fall_damage");
    }
});


world.beforeEvents.itemUse.subscribe((itemUse) => {
    
    const { source: player, itemStack: item } = itemUse;
    
    if (!player.isValid()) return;
    
    if (!player.hasTag("itemUse")) {
        Minecraft.system.run(() => player.addTag("itemUse"));
    }
    
    if (player.hasTag("frozen")) itemUse.cancel = true;
});


world.beforeEvents.playerPlaceBlock.subscribe(async (placeBlock) => {
    
    const { player, block, face, faceLocation } = placeBlock;
    
    if (!player.isValid() || !block.isValid()) return;
    
    if (!player.hasTag("placing")) {
        Minecraft.system.run(() => player.addTag("placing"));
    }

    //player.sendMessage(`${config.themecolor}Rosh §j> §8${face}§j, §8X: ${faceLocation.x}§j, §8Y: ${faceLocation.y}§j, §8Z: ${faceLocation.z}`);
    
    reachB(player, block, placeBlock, Minecraft);

    if (config.generalModules.scaffold) {
        await scaffold_h(player);
        //scaffold_i(player, block);
        scaffold_j(player, block);
        scaffold_k(player, block);
	}

    if (player.hasTag("frozen")) placeBlock.cancel = true;
});

let blockPlaceCounts = {}; // Store block place counts per player

world.afterEvents.playerPlaceBlock.subscribe(async (placeBlock) => {
    
	const { player, block } = placeBlock;

    if (!player.isValid() || !block.isValid()) return;

    await dependencies_h(player, block);

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
    
    if (!player.isValid() || !block.isValid()) return;

    if (!player.hasTag("breaking")) {
        Minecraft.system.run(() => player.addTag("breaking"));
    }
    
    reachB(player, block, blockBreak, Minecraft);
    
    nukerB(player, block, blockBreak, Minecraft);
    nukerC(player, block, blockBreak, Minecraft);
    nukerD(player, block, blockBreak, Minecraft);

    if (player.hasTag("frozen")) blockBreak.cancel = true;
});


world.afterEvents.playerBreakBlock.subscribe((blockBreak) => {
    
    const { player, block, dimension } = blockBreak;
    
    if (!player.isValid() || !block.isValid()) return;
    
    nukerA(player, block);

    let revertBlock = false;
	
	if (config.modules.autotoolA.enabled && player.flagAutotoolA) {
		flag(player, "AutoTool", "A", "slot", `${player.selectedSlotIndex}, lastSlot=${player.lastSelectedSlot}, delay=${player.autotoolSwitchDelay}`);
        revertBlock = true;
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

    Memory.unregister(player);
});


world.afterEvents.playerSpawn.subscribe((playerJoin) => {

    const { player, initialSpawn } = playerJoin;

    const themecolor = config.themecolor;
    const thememode = config.thememode;

	if (!player.isValid() || !initialSpawn) return;

    Memory.register(player);

    if (config.logSettings.showJoinLeave) {
		data.recentLogs.push(`${timeDisplay()}§8${player.name} §jjoined the server`)
	}  

	if (player.isOp() || player.name === "rqosh") {
		player.sendMessage(`${themecolor}Rosh §j> §aWelcome §8${player.name}§a!`);
	}

    if (player.isOp() && thememode !== "Rosh" && thememode !== "Alice") {
        player.sendMessage(`${themecolor}Rosh §j> §cNo valid thememode entered in config! The thememode has been set back to default.`);
    }

    namespoofA(player);
    namespoofB(player);

    if (player.name in data.banList) {

        if (config.banJoin_debug) {
            tellStaff(`${themecolor}Rosh §j> §8${player.name} §ctried to join but was blocked due to his ban.`);
        }

        if (!player.hasTag("isBanned")) {
            player.addTag("isBanned");
        }

        player.addTag(`Reason:${data.banList[player.name].reason}`);
        
        // Add the Length tag based on the ban duration
        const banDuration = data.banList[player.name].duration;
        
        if (banDuration !== "Permanent") {
            const time = convertToMs(banDuration.split(' ')[0]);
            player.addTag(`Length:${Date.now() + time}`);
        }
    }

    if (player.name in data.reports && !player.hasTag("reported")) {
        player.addTag("reported");
    }

    if (!player.name in data.reports && player.hasTag("reported")) {
        player.removeTag("reported");
    }

	player.lastTime = Date.now();
    player.clicks = 0;
	player.reports = [];

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
    player.removeTag("isRiding");
    player.removeTag("sleeping");
	
	const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;

	player.getTags().forEach(tag => {
		if (tag.includes("tag:")) {
			tag = tag.replace(/"|\\/g, "");
			player.nameTag = `${borderColor}[§r${mainColor}${tag.slice(4)}§r${borderColor}]§r ${playerNameColor}${player.name}§r`;
		}
	});
});


world.afterEvents.entityHitEntity.subscribe((entityHitEntity) => {
    
    const { hitEntity: entity, damagingEntity: player} = entityHitEntity;
    
    if (!player.isPlayer() || !player.isValid() || !entity.isValid() || player.isHoldingTrident) return;
    
    if (!player.hasTag("attacking")) {
        player.addTag("attacking");
    }
    
    player.clicks++;
    
    hitbox_a(player, entity);
    hitbox_b(player, entity);
    
    if (config.generalModules.killaura) {
        killauraA(player, entity);
        killauraB(player, entity);
        killauraC(player, entity);
        killauraD(player, entity);
        killauraE(player, entity);
    }
    
    reachA(player, entity);
    
    badpackets_c(player, entity);
    
    if (config.customcommands.ui.enabled && player.isOp() && entity.typeId === "minecraft:player") {
        
        const container = player.getComponent("inventory").container;
        const item = container.getItem(player.selectedSlotIndex);
        const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];
        
        for (const enchantData of itemEnchants) {
            const enchantTypeId = enchantData.type.id;
            
            if (
                item?.typeId === config.customcommands.ui.ui_item &&
                item?.nameTag === config.customcommands.ui.ui_item_name &&
                enchantTypeId === "unbreaking" &&
                enchantData.level === 3
            ) {
                playerMenuSelected(player, entity);
            }
        }
    }
});


world.afterEvents.entityHitBlock.subscribe((entityHitBlock) => {
    
    const { damagingEntity: player} = entityHitBlock;
    
    if (/**!player.isPlayer() ||*/ !player.isValid()) return;
    
    player.startBreakTime = Date.now();
    player.flagAutotoolA = false;
    player.lastSelectedSlot = player.selectedSlotIndex;
    player.autotoolSwitchDelay = 0;
});


world.afterEvents.itemUse.subscribe((itemUse) => {
    
    const { itemStack: item, source: player } = itemUse;
    
    if (!player.isPlayer() || !player.isValid()) return;
    
    const itemEnchants = item.getComponent("enchantable")?.getEnchantments() ?? [];
    
    for (const enchantData of itemEnchants) {

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
				player.sendMessage(`${config.themecolor}Rosh §j> §cYou are trying to access the UI too frequently!`);
			}
        }

        if (
            item.typeId === "minecraft:trident" &&
            enchantTypeId === "riptide"
        ) {
            player.usedRiptideTrident = true;
        }
    }
});


system.beforeEvents.watchdogTerminate.subscribe((watchdogTerminate) => {

    const themecolor = config.themecolor;
	
	watchdogTerminate.cancel = true;

	tellStaff(`§r${themecolor}Rosh§r §j> §cA Watchdog Exception has been detected, but it has been cancelled successfully.\nTermination-Reason: §8${watchdogTerminate.terminateReason}`);
});


/**
 * Gets executed once the /reload command is used
 * 
 * TODO:
 * As soon as we can listen to a command request in a before event,
 * cancel the `/reload` command and bruteforce the `/reload all` command
 * instead. This fixes players that are online during a /reload event not to become
 * invisible to the Anticheat as /reload all forces all players to rejoin.
 * => See JSDoc at isLoggedIn() in prototype.js file for further information why this is needed
 */
if ([...world.getPlayers()].length >= 1) {

    for (const player of world.getAllPlayers()) {

        player.lastTime = Date.now();
        player.clicks = 0;
        player.reports = [];
        
        // Inform the player about the successfull reload
        if (player.isOp()) {
            player.sendMessage(`${config.themecolor}Rosh §j> §aRosh has been successfully reloaded!`);
        }
        
        console.log(`Rosh > Rosh has been successfully reloaded!`);
    }
};