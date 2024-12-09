import { Vector3, ItemStack } from "@minecraft/server";
import { BoundingBox } from "../../utils/BoundingBox.js";

declare module "@minecraft/server" {
	
    interface Player {

        /**
         * Whether the player is crawling (e.g., pushed down by a trapdoor).
         * @Rosh
         * @beta **This property cannot be used yet!**
         */
        isCrawling: boolean;

        /**
         * Whether the player is riding another entity.
         * @Rosh
         */
        isRiding(): boolean;

        /**
         * The entity that the player is riding (e.g., a horse, a pig, a strider ...).
         * @Rosh
         */
        getRiddenEntity(): Entity;

        /**
         * Whether the block below the player is a type of ice.
         * @Rosh
         */
        isOnIce: boolean;

        /**
         * Whether the block below the player is a type of snow (including snow layers).
         * @Rosh
         */
        isOnSnow: boolean;

        /**
         * Whether the player is on a shulker entity or shulker shell (works for both closed and open shulkers).
         * @Rosh
         */
        isOnShulker: boolean;

        /**
         * Returns true if at least one web block is found in a 3x4x3 cube around the player.
         * @Rosh
         */
        isInWeb(): boolean;

        /**
         * Whether the player is currently bouncing off of a slime block. (Returns false as soon as he starts falling again)
         * @Rosh
         */
        isSlimeBouncing(): boolean;

        /**
         * @Rosh
         */
        isTridentHovering(): boolean;

        /**
         * Whether the player is moving on stairs (upwards or downwards).
         * @Rosh
         */
        isRunningStairs: boolean;

        /**
         * Whether the player has a trident equipped in their selected slot.
         * @Rosh
         */
        isHoldingTrident: boolean;

        /**
         * Whether the player is dead (Health = 0).
         * @returns {boolean} True if the player is dead, false otherwise.
         * @Rosh
         */
        isDead(): boolean;

        /**
         * Whether the player is alive (Health > 0).
         * @returns {boolean} True if the player is alive, false otherwise.
         * @Rosh
         */
        isAlive(): boolean;

        /**
         * Whether the player is muted (tagged with `isMuted`).
         * @returns {boolean} True if the player is muted, false otherwise.
         * @Rosh
         */
        isMuted(): boolean;

        /**
         * Whether the player is banned (tagged with `isBanned`).
         * @returns {boolean} True if the player is banned, false otherwise.
         * @Rosh
         */
        isBanned(): boolean;

        /**
         * Whether the player is logged in for the specified number of ticks.
         * @param {number} ticks The number of ticks to check for. Defaults to 5 seconds (100 ticks) if not specified.
         * @Rosh
         */
        isLoggedIn(ticks: number): boolean;

        /**
         * Whether the player is using a mobile device (iOS, Android, etc.).
         * @returns {boolean} True if the player is on a mobile platform, false otherwise.
         * @Rosh
         */
        isMobile(): boolean;

        /**
         * Whether the player is using a console (Xbox, PlayStation, etc.).
         * @returns {boolean} True if the player is on a console, false otherwise.
         * @Rosh
         */
        isConsole(): boolean;

        /**
         * Whether the player is using a desktop computer (Windows, Linux, etc.).
         * @returns {boolean} True if the player is on a desktop platform, false otherwise.
         * @Rosh
         */
        isDesktop(): boolean;

        /**
         * Gets the player's attacks per second (only counts actual attacks, not arm swings).
         * @returns {number} The player's attacks per second (CPS).
         * @Rosh
         */
        getCps(): number;

        /**
         * Gets the player's last attacks per second (only counts actual attacks, not arm swings).
         * @returns {number} The player's last attacks per second (CPS).
         * @Rosh
         */
        getLastCps(): number;

        /**
         * Sets the player's attacks per second.
         * @param {number} cpsValue The CPS value to assign to the player.
         * @Rosh
         */
        setCps(cpsValue: number): void;

        /**
         * Sets the player's last attacks per second.
         * @param lastCpsValue The last CPS value to assign to the player.
         * @Rosh
         */
        setLastCps(lastCpsValue: number): void;

        /**
         * Gets the player's current yaw (horizontal rotation).
         * @returns {number} The player's current yaw.
         * @Rosh
         */
        getYaw(): number;

        /**
         * Gets the player's last yaw (horizontal rotation).
         * @returns {number} The player's last yaw.
         * @Rosh
         */
        getLastYaw(): number;

        /**
         * Gets the change in the player's yaw since the last update.
         * @returns {number} The change in the player's yaw.
         * @Rosh
         */
        getDeltaYaw(): number;

        /**
         * Gets the change in the player's yaw from the last tick.
         * @returns {number} The change in the player's yaw from the last tick or the current delta yaw if not set.
         * @Rosh
         */
        getLastDeltaYaw(): number;

        /**
         * Gets the change in the player's yaw since the last update (jolt).
         * @returns {number} The change in the player's yaw since the last update (jolt).
         * @Rosh
         */
        getJoltYaw(): number;

        /**
         * Sets the player's yaw (horizontal rotation).
         * @param {number} yawValue The yaw value to set for the player.
         * @Rosh
         */
        setYaw(yawValue: number): void;

        /**
         * Sets the player's last yaw (horizontal rotation).
         * @param {number} lastYawValue The last yaw value to set.
         * @Rosh
         */
        setLastYaw(lastYawValue: number): void;

        /**
         * Sets the change in the player's yaw since the last update.
         * @param {number} deltaYawValue The value to set for the change in yaw.
         * @Rosh
         */
        setDeltaYaw(deltaYawValue: number): void;

        /**
         * Sets the change in the player's yaw from the last tick.
         * @param {number} lastDeltaYawValue The value to set for the last delta yaw.
         * @Rosh
         */
        setLastDeltaYaw(lastDeltaYawValue: number): void;

        /**
         * Sets the change in the player's yaw since the last update (jolt).
         * @param {number} joltYawValue The value to set for the change in yaw (jolt).
         * @Rosh
         */
        setJoltYaw(joltYawValue: number): void;

        /**
         * Gets the player's current pitch (vertical rotation).
         * @returns {number} The player's current pitch.
         * @Rosh
         */
        getPitch(): number;

        /**
         * Gets the player's last pitch (vertical rotation).
         * @returns {number} The player's last pitch.
         * @Rosh
         */
        getLastPitch(): number;

        /**
         * Gets the change in the player's pitch since the last update.
         * @returns {number} The change in the player's pitch.
         * @Rosh
         */
        getDeltaPitch(): number;

        /**
         * Gets the change in the player's pitch from the last tick.
         * @returns {number} The change in the player's pitch from the last tick or the current delta pitch if not set.
         * @Rosh
         */
        getLastDeltaPitch(): number;

        /**
         * Gets the change in the player's pitch since the last update (jolt).
         * @returns {number} The change in the player's pitch since the last update (jolt).
         * @Rosh
         */
        getJoltPitch(): number;

        /**
         * Sets the player's pitch (vertical rotation).
         * @param {number} pitchValue The pitch value to set for the player.
         * @Rosh
         */
        setPitch(pitchValue: number): void;

        /**
         * Sets the player's last pitch (vertical rotation).
         * @param {number} lastPitchValue The last pitch value to set.
         * @Rosh
         */
        setLastPitch(lastPitchValue: number): void;

        /**
         * Sets the change in the player's pitch since the last update.
         * @param {number} deltaPitchValue The value to set for the change in pitch.
         * @Rosh
         */
        setDeltaPitch(deltaPitchValue: number): void;

        /**
         * Sets the change in the player's pitch from the last tick.
         * @param {number} lastDeltaPitchValue The value to set for the last delta pitch.
         * @Rosh
         */
        setLastDeltaPitch(lastDeltaPitchValue: number): void;

        /**
         * Sets the change in the player's pitch since the last update (jolt).
         * @param {number} joltPitchValue The value to set for the change in pitch (jolt).
         */
        setJoltPitch(joltPitchValue: number): void;

        /**
         * A helper variable for calculating the player's attacks per second.
         * @Rosh
         */
        clicks: number;

        /**
         * A variable to track the player's current yaw (horizontal rotation).
         * @note (Use `getYaw()` instead if you wish to use the player's actual yaw!)
         * @Rosh
         */
        yaw: number;

        /**
         * A variable to track the player's last yaw (horizontal rotation).
         * @note (Use `getLastYaw()` instead if you wish to use the player's actual last yaw!)
         * @Rosh
         */
        lastYaw: number;

        /**
         * A variable to track the change in the player's yaw since the last update.
         * @note (Use `getDeltaYaw()` instead if you wish to use the player's actual change in yaw!)
         * @Rosh
         */
        deltaYaw: number;

        /**
         * A variable to track the player's current pitch (vertical rotation).
         * @note (Use `getPitch()` instead if you wish to use the player's actual pitch!)
         * @Rosh
         */
        pitch: number;

        /**
         * A variable to track the player's last pitch (vertical rotation).
         * @note (Use `getLastPitch()` instead if you wish to use the player's actual last pitch!)
         * @Rosh
         */
        lastPitch: number;

        /**
         * A variable to track the change in the player's pitch since the last update.
         * @note (Use `getDeltaPitch()` instead if you wish to use the player's actual change in pitch!)
         * @Rosh
         */
        deltaPitch: number;
        
        autotoolSwitchDelay: number;
        blocksBroken: number;
        startBreakTime: number;

        /**
         * A variable to track time intervals in milliseconds (updated every 20 ticks using `Date.now()`).
         * @Rosh
         */
        lastTime: number;

        /**
         * Saves the player's selected slot from the last tick.
         * @Rosh
         */
        lastSelectedSlot: number;

        /**
         * Stores the player's velocity from the last tick.
         * @Rosh
         */
        lastVelocity: Vector3;

        /**
         * Stores the player's position from the last tick.
         * @Rosh
         */
        lastPosition: Vector3;

        /**
         * Saves a safe position to teleport the player to when flagging a check. Safe positions are those where the player is on the ground.
         * @Rosh
         */
        lastGoodPosition: Vector3;

        /**
         * Gets the player's position.
         * @returns {Vector3} The player's position on the x, y, and z axes.
         * @Rosh
         */
        getPosition(): Vector3;

        /**
         * Gets the player's position from the last tick.
         * @returns {Vector3} The player's last position on the x, y, and z axes.
         * @Rosh
         */
        getLastPosition(): Vector3;

        /**
         * Sets the player's position from the last tick.
         * @param {Vector3} Position The player's position to set.
         * @Rosh
         */
        setLastPosition(Position: Vector3): void;

        /**
         * Gets the player's velocity from the last tick.
         * @returns {Vector3} The player's velocity on the x, y, and z axes.
         * @Rosh
         */
        getLastVelocity(): Vector3;

        /**
         * Sets the player's velocity from the last tick.
         * @param {Vector3} Velocity The player's velocity to set.
         * @Rosh
         */
        setLastVelocity(Velocity: Vector3): void;

        /**
         * Gets the player's current move direction.
         * @returns {Vector3} The player's current move direction on the x, y, and z axes.
         * @Rosh
         */
        getMoveDirection(): Vector3;

        /**
         * Stores a list of player names the player has reported for potentially malicious behavior.
         * @Rosh
         */
        reports: Array<string>;

        /**
         * Kicks the player from the game.
         * @param {string | undefined} reason - The reason for kicking the player.
         * @returns {Promise<boolean>} A promise that resolves to true if the player was successfully kicked, false otherwise.
         * @Rosh
         */
        kick(reason: string | undefined): Promise<boolean>;

        /**
         * Bans a player from the game.
         * @returns {boolean} True if the player was successfully banned, false otherwise.
         * @Rosh
         */
        ban(): boolean;

        /**
         * Mutes the player, preventing them from sending chat messages. Adds the `isMuted` tag.
         * @returns {Promise<boolean>} A promise that resolves when the player is muted.
         * @Rosh
         */
        mute(): Promise<boolean>;

        /**
         * Unmutes the player, allowing them to send chat messages again. Removes the `isMuted` tag.
         * @returns {Promise<boolean>} A promise that resolves when the player is unmuted.
         * @Rosh
         */
        unmute(): Promise<boolean>;

        /**
         * Gets a player's current bounding box. (aka Hitbox)
         * @returns {BoundingBox} The player's current bounding box.
         * @Rosh
         */
        getBoundingBox(): BoundingBox

        /**
         * Gets the item in the player's hand.
         * @returns {ItemStack} The item in the player's hand or undefined if the player is not holding an item.
         * @Rosh
         */
        getItemInHand(): ItemStack | undefined;

        /**
         * Gets the item in the player's hand from the last tick.
         * @returns {ItemStack} The item in the player's hand from the last tick or undefined if the player is not holding an item.
         * @Rosh
         */
        getLastItemInHand(): ItemStack | undefined;

        /**
         * Sets the item in the player's hand from the last tick.
         * @param {ItemStack} lastItemInHand The item in the player's hand from the last tick to set.
         * @Rosh
         */
        setLastItemInHand(lastItemInHand: ItemStack): void;

        /**
         * Gets the item in the player's cursor.
         * @returns {ItemStack} The item in the player's cursor or undefined if the player is not holding an item in their cursor.
         * @Rosh
         */
        getItemInCursor(): ItemStack | undefined;

        /**
         * Gets the item in the player's cursor from the last tick.
         * @returns {ItemStack} The item in the player's cursor from the last tick or undefined if the player is not holding an item in their cursor.
         * @Rosh
         */
        getLastItemInCursor(): ItemStack | undefined;

        /**
         * Sets the item in the player's cursor from the last tick.
         * @param {ItemStack} lastItemInCursor The item in the player's cursor from the last tick to set.
         * @Rosh
         */
        setLastItemInCursor(lastItemInCursor: ItemStack): void;
    }

    interface Entity {

        /**
         * Checks if the current entity is a player.
         * @returns {boolean} True if the entity is a player, false otherwise.
         * @Rosh
         */
        isPlayer(): boolean,

        /**
         * Whether the autotool check flagged this entity.
         */
        flagAutotoolA: boolean,

        autotoolSwitchDelay: number,
        lastSelectedSlot: number,
        startBreakTime: number,
        cps: number,
    }
}