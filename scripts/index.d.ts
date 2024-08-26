import { Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
	
	interface Player {

		Player: any,

		flagAutotoolA: boolean,

        /**
         * Wheter the player is crawling. For example: Getting pushed down by a trapdoor.
         * @Rosh
         * @beta **This property cannot be used yet!**
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isCrawling: boolean,

        /**
         * Wheter the player is riding another entity. For example: Riding a horse, pig or a strider is considered true.
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isRiding: boolean,

        /**
         * Wheter the block below the player is a sort of ice.
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isOnIce: boolean,
        
        /**
         * Wheter the player is moving on stairs. (upwards or downwards)
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isRunningStairs: boolean,

        /**
         * Wheter the block below the player is a sort of snow. (Snow layers are considered aswell)
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isOnSnow: boolean,

        /**
         * Wheter the block below the player is slime.
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isOnSlime: boolean,

        /**
         * Whether the player has a trident in his selected slot.
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isHoldingTrident: boolean,

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