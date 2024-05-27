import { Player, Entity, EntityComponent, Container, ItemComponent, EnchantmentList, Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
	
	interface Player {

		Player: any,

		flagAutotoolA: boolean,
		flagNamespoofA: boolean,
		flagNamespoofB: boolean,

		pitch: number,
		blocksBroken: number,
		startBreakTime: number,
		lastSelectedSlot: number,
		autotoolSwitchDelay: number,
		cps: number,
		firstAttack: number,
		lastThrow: number,
		lastMessageSent: number,
		lastLeftClick: number,

		entitiesHit: Array<String>,
		reports: Array<String>,
		
		lastGoodPosition: Vector3

	}

	interface Entity {

		Entity: any,
		
		flagAutotoolA: boolean,

		name: string,

		cps: number,
		selectedSlot: number,
		lastThrow: number,
		startBreakTime: number,
		lastSelectedSlot: number,
		autotoolSwitchDelay: number,
		lastMessageSent: number,

		entitiesHit: Array<String>

	}
}