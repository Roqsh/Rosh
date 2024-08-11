import { Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
	
	interface Player {

		Player: any,

		flagAutotoolA: boolean,
        isCrawling: boolean,

        autotoolSwitchDelay: number,
        blocksBroken: number,
        cps: number,
        firstAttack: number,
		lastSelectedSlot: number,	
		lastThrow: number,
		lastMessageSent: number,
		lastLeftClick: number,
        pitch: number,
        selectedSlotIndex: number,
        startBreakTime: number,

		entitiesHit: Array<String>,
		reports: Array<String>,
		
		lastGoodPosition: Vector3

	}

	interface Entity {

		Entity: any,
		
		flagAutotoolA: boolean,
        isRiding: boolean,

		name: string,

        autotoolSwitchDelay: number,
		cps: number,
		lastThrow: number,
		lastSelectedSlot: number,
		lastMessageSent: number,
		lastLeftClick: number,
        selectedSlotIndex: number,
        startBreakTime: number,

		entitiesHit: Array<String>

	}
}