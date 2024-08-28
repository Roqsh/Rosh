import { Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
	
	interface Player {

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
         * Wheter the player is moving on stairs. (upwards or downwards)
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isRunningStairs: boolean,

        /**
         * Whether the player has a trident in his selected slot.
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        isHoldingTrident: boolean,

        flagAutotoolA: boolean,

        /**
         * Gets a player's attacks per second. (This does not include regular arm swings/clicks, **only attacks**!)
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        getCps(): number,

        /**
         * Sets a player's attacks per second.
         * @param {number} cpsValue The value to assign to the player's attacks per second.
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        setCps(cpsValue: number),

        /**
         * A helper variable for calculating the attacks per second of a player.
         * (Use `getCps()` instead if you wish to use the player's actual attacks per second)
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        cps: number,

        /**
         * A variable to track time intervals. This property gets updated every 20 ticks using Date.now().
         * @Rosh
         * @remarks This property is a placeholder until we get an official version in the API.
         */
        lastTime: number,

		lastSelectedSlot: number,	
		lastThrow: number,
		lastMessageSent: number,
		lastLeftClick: number,
        autotoolSwitchDelay: number,
        blocksBroken: number,
        pitch: number,
        selectedSlotIndex: number,
        startBreakTime: number,

		entitiesHit: Array<String>,
		reports: Array<String>,
		
		lastGoodPosition: Vector3
	}

	interface Entity {
		
		flagAutotoolA: boolean,

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