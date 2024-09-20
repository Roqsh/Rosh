import { Vector3 } from "@minecraft/server";

declare module "@minecraft/server" {
	
    interface Player {

        /**
         * Whether the player is crawling. For example: Getting pushed down by a trapdoor.
         * @Rosh
         * @beta **This property cannot be used yet!**
         */
        isCrawling: boolean,

        /**
         * Whether the player is riding another entity. For example: Riding a horse, pig, or a strider is considered true.
         * @Rosh
         */
        isRiding: boolean,

        /**
         * Whether the block below the player is a sort of ice.
         * @Rosh
         */
        isOnIce: boolean,

        /**
         * Whether the block below the player is a sort of snow. (Snow layers are considered blocks as well.)
         * @Rosh
         */
        isOnSnow: boolean,

        /**
         * Whether the block below the player is slime.
         * @Rosh
         */
        isOnSlime: boolean,

        /**
         * Whether the player is on a shulker.
         * (Both shulker entities and shulker shells will work as well as standing on top of it while the shulker is open.)
         * @Rosh
         */
        isOnShulker: boolean,

        /**
         * Whether the player is moving on stairs. (upwards or downwards)
         * @Rosh
         */
        isRunningStairs: boolean,

        /**
         * Whether the player has a trident in their selected slot.
         * @Rosh
         */
        isHoldingTrident: boolean,

        /**
         * Whether the player is currently dead. (Health = 0)
         * @returns {boolean} True if the player is dead, false otherwise.
         * @Rosh
         */
        isDead(): boolean,

        /**
         * Whether the player is currently alive. (Health > 0)
         * @returns {boolean} True if the player is alive, false otherwise.
         * @Rosh
         */
        isAlive(): boolean,

        /**
         * Whether the player is currently muted/can't chat. (Has tag `isMuted`)
         * @returns {boolean} True if the player is muted, false otherwise.
         * @Rosh
         */
        isMuted(): boolean,

        /**
         * Whether the player's device on which minecraft is running is a mobile device. (Phones with iOS or Android etc.)
         * @returns {boolean} Whether the player's platform is a mobile device.
         * @Rosh
         */
        isMobile(): boolean,

        /**
         * Wheter the player's device on which minecraft is running is a console. (Xbox, Playstation etc.)
         * @returns {boolean} Whether the player's platform is a console.
         * @Rosh
         */
        isConsole(): boolean,

        /**
         * Whether the player's device on which minecraft is running is a desktop. (Pc's with Windows or Linux etc.)
         * @returns {boolean} Wheter the player's platform is a Pc.
         * @Rosh
         */
        isDesktop(): boolean,

        /**
         * Gets a player's attacks per second. (This does not include regular arm swings/clicks, **only attacks**!)
         * @returns {number} The player's attacks per second.
         * @Rosh
         */
        getCps(): number,

        /**
         * Sets a player's attacks per second.
         * @param {number} cpsValue The value to assign to the player's attacks per second.
         * @Rosh
         */
        setCps(cpsValue: number): void,

        /**
         * Gets the player's current yaw (horizontal rotation).
         * @returns {number} The player's current yaw.
         * @Rosh
         */
        getYaw(): number,

        /**
         * Gets the player's last yaw (horizontal rotation).
         * @returns {number} The player's last yaw.
         * @Rosh
         */
        getLastYaw(): number,

        /**
         * Gets the change in the player's yaw since the last update.
         * @returns {number} The change in the player's yaw.
         * @Rosh
         */
        getDeltaYaw(): number,

        /**
         * Sets the player's yaw (horizontal rotation).
         * @param {number} yawValue The value to set for the player's yaw.
         * @Rosh
         */
        setYaw(yawValue: number): void,

        /**
         * Sets the player's last yaw (horizontal rotation).
         * @param {number} lastYawValue The last yaw value.
         * @Rosh
         */
        setLastYaw(lastYawValue: number): void,

        /**
         * Sets the change in the player's yaw since the last update.
         * @param {number} deltaYawValue The value to set for the change in the player's yaw.
         * @Rosh
         */
        setDeltaYaw(deltaYawValue: number): void,

        /**
         * Gets the player's current pitch (vertical rotation).
         * @returns {number} The player's current pitch.
         * @Rosh
         */
        getPitch(): number,

        /**
         * Gets the player's last pitch (vertical rotation).
         * @returns {number} The player's last pitch.
         * @Rosh
         */
        getLastPitch(): number,

        /**
         * Gets the change in the player's pitch since the last update.
         * @returns {number} The change in the player's pitch.
         * @Rosh
         */
        getDeltaPitch(): number,

        /**
         * Sets the player's pitch (vertical rotation).
         * @param {number} pitchValue The value to set for the player's pitch.
         * @Rosh
         */
        setPitch(pitchValue: number): void,

        /**
         * Sets the player's last pitch (vertical rotation).
         * @param {number} lastPitchValue The last pitch value.
         * @Rosh
         */
        setLastPitch(lastPitchValue): void,

        /**
         * Sets the change in the player's pitch since the last update.
         * @param {number} deltaPitchValue The value to set for the change in the player's pitch.
         * @Rosh
         */
        setDeltaPitch(deltaPitchValue: number): void,

        /**
         * A helper variable for calculating the attacks per second of a player.
         * (Use `getCps()` instead if you wish to use the player's actual attacks per second!)
         * @Rosh
         */
        clicks: number,

        /**
         * A variable to track the player's current yaw (horizontal rotation).
         * (Use `getYaw()` instead if you wish to use the player's actual yaw!)
         * @Rosh
         */
        yaw: number,

        /**
         * A variable to track the player's last yaw (horizontal rotation).
         * (Use `getLastYaw()` instead if you wish to use the player's actual last yaw!)
         * @Rosh
         */
        lastYaw: number,

        /**
         * A variable to track the change in the player's yaw since the last update.
         * (Use `getDeltaYaw()` instead if you wish to use the player's actual change in yaw!)
         * @Rosh
         */
        deltaYaw: number,

        /**
         * A variable to track the player's current pitch (vertical rotation).
         * (Use `getPitch()` instead if you wish to use the player's actual pitch!)
         * @Rosh
         */
        pitch: number,

        /**
         * A variable to track the player's last pitch (vertical rotation).
         * (Use `getLastPitch()` instead if you wish to use the player's actual last pitch!)
         * @Rosh
         */
        lastPitch: number,

        /**
         * A variable to track the change in the player's pitch since the last update.
         * (Use `getDeltaPitch()` instead if you wish to use the player's actual change in pitch!)
         * @Rosh
         */
        deltaPitch: number,
        
        autotoolSwitchDelay: number,
        blocksBroken: number,
        startBreakTime: number,

        /**
         * A variable to track time intervals in ms. This property gets updated every 20 ticks using `Date.now()`.
         * @Rosh
         */
        lastTime: number,

        /**
         * Saves a player's selected slot of the last tick using `selectedSlotIndex`.
         * @Rosh
         */
        lastSelectedSlot: number,

        /**
         * Stores a player's velocity of the last tick.
         * (Use `getLastVelocity()` instead if you wish to use the player's actual last velocity!)
         * @Rosh
         */
        lastVelocity: Vector3,
		
        /**
         * Stores a player's location of the last tick.
         * (Use `getLastPosition()` instead if you wish to use the player's actual last position!)
         * @Rosh
         */
        lastPosition: Vector3,

        /**
         * Saves a safe position to teleport the player back to when flagging a certain check.
         * Positions where the player is on ground are considered safe.
         * @Rosh
         */
        lastGoodPosition: Vector3,

        /**
         * Gets a player's position of the last tick.
         * @returns {Vector3} A vector representing the player's position on the x, y and z coordinates.
         * @Rosh
         */
        getLastPosition(): Vector3,

        /**
         * Sets the change in the player's position.
         * @param {Vector3} Position
         * @Rosh
         */
        setLastPosition(Position: Vector3): void,

        /**
         * Gets a player's velocity of the last tick.
         * @returns {Vector3} A vector representing the player's velocity on the x, y and z coordinates.
         * @Rosh
         */
        getLastVelocity(): Vector3,

        /**
         * Sets the change in the player's velocity.
         * @param {Vector3} Velocity
         * @Rosh
         */
        setLastVelocity(Velocity: Vector3): void,

        /**
         * Gets the player's current move direction.
         * @returns {Vector3} A vector representing the player's current move direction on the x, y and z axis.
         * @Rosh
         */
        getMoveDirection(): Vector3,

        /**
         * Stores a list of (potential malicious) player names a player has reported.
         * @Rosh
         */
        reports: Array<String>,

        /**
         * Kicks a player from the game.
         * @Rosh
         * @param {string | undefined} reason - The reason for kicking the player.
         */
        kick(reason: string | undefined): Promise<boolean>

        /**
         * Prevents a player from sending messages. (Adds tag `isMuted`)
         * @Rosh
         * @remarks Messages from players with an `isMuted` tag will be canceled in `Minecraft.ChatSendBeforeEvent`.
         */
        mute(): Promise<boolean>,

        /**
         * Allows a player to send messages again. (Removes tag `isMuted`)
         * @Rosh
         */
        unmute(): Promise<boolean>
    }

    interface Entity {
        
        flagAutotoolA: boolean,

        autotoolSwitchDelay: number,
        lastSelectedSlot: number,
        startBreakTime: number,
        cps: number,
    }
}