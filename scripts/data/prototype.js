import { Player, Entity } from "@minecraft/server";
import { Memory } from "../utils/Memory.js";    

/**
 * Initializes and enhances the Player prototype with custom methods.
 */
export function loadPlayerPrototypes() {

    // Adding CPS methods to the Player prototype

    Player.prototype.getCps = function() {
        return this.clicks ?? 0;  // Use nullish coalescing operator
    };

    Player.prototype.setCps = function(cpsValue) {
        this.clicks = cpsValue || 0;
    };

    Player.prototype.getLastCps = function() {
        return this.lastClicks ?? 0;  // Use nullish coalescing operator
    };

    Player.prototype.setLastCps = function(lastCpsValue) {
        this.lastClicks = lastCpsValue || 0;
    };

    // Adding yaw methods to the Player prototype

    Player.prototype.getYaw = function() {
        return this.yaw ?? this.getRotation().y;
    };

    Player.prototype.setYaw = function(yawValue) {
        this.yaw = yawValue;
    };

    Player.prototype.getLastYaw = function() {
        return this.lastYaw ?? this.getYaw();
    }

    Player.prototype.setLastYaw = function(lastYawValue) {
        this.lastYaw = lastYawValue;
    };

    Player.prototype.getDeltaYaw = function() {
        return this.deltaYaw ?? 0;  // Use nullish coalescing operator
    };

    Player.prototype.setDeltaYaw = function(deltaYawValue) {
        this.deltaYaw = deltaYawValue;
    };


    // Adding pitch methods to the Player prototype

    Player.prototype.getPitch = function() {
        return this.pitch ?? this.getRotation().x;
    };

    Player.prototype.setPitch = function(pitchValue) {
        this.pitch = pitchValue;
    };

    Player.prototype.getLastPitch = function() {
        return this.lastPitch ?? this.getPitch();
    }

    Player.prototype.setLastPitch = function(lastPitchValue) {
        this.lastPitch = lastPitchValue;
    };

    Player.prototype.getDeltaPitch = function() {
        return this.deltaPitch ?? 0;  // Use nullish coalescing operator
    };

    Player.prototype.setDeltaPitch = function(deltaPitchValue) {
        this.deltaPitch = deltaPitchValue;
    };


    // Adding health methods to the Player prototype

    Player.prototype.isDead = function() {
        const healthComponent = this.getComponent("health");
        return healthComponent ? healthComponent.currentValue === 0 : false;  // Added null check
    };

    Player.prototype.isAlive = function() {
        const healthComponent = this.getComponent("health");
        return healthComponent ? healthComponent.currentValue > 0 : false;  // Added null check
    };


    // Adding punishment methods to the Player prototype

    Player.prototype.kick = async function(reason) {
        try {
            if (reason) {
                await this.runCommandAsync(`kick "${this.name}" ${reason}`);
            } else {
                await this.runCommandAsync(`kick "${this.name}"`);
            }
            return true;
        } catch (e) {
            console.error(`Failed to kick player ${this.name}:`, e);
            return false;
        }
    };

    Player.prototype.mute = async function() {
        try {
            if (this.hasTag("isMuted")) {
                return true;
            } else {
                this.addTag("isMuted");
                return true;
            }
        } catch (e) {
            console.error(`Failed to mute player ${this.name}:`, e);
            return false;
        }
    };

    Player.prototype.unmute = async function() {
        try {
            if (this.hasTag("isMuted")) {
                this.removeTag("isMuted");
                return true;
            } else {
                return true;
            }
        } catch (e) {
            console.error(`Failed to unmute player ${this.name}:`, e);
            return false;
        }
    };

    Player.prototype.isMuted = function() {
        return this.hasTag("isMuted");
    }


    // Adding movement methods to the Player prototype

    Player.prototype.getPosition = function() {
        return this.location;
    }

    Player.prototype.getLastPosition = function() {
        return this.lastPosition ?? this.location;
    };

    Player.prototype.setLastPosition = function(Position) {
        this.lastPosition = Position;
    };

    Player.prototype.getLastVelocity = function() {
        return this.lastVelocity ?? this.getVelocity();
    };

    Player.prototype.setLastVelocity = function(Velocity) {
        this.lastVelocity = Velocity;
    };

    Player.prototype.getMoveDirection = function() {
        
        const currentPos = this.location;
        const lastPos = this.getLastPosition();

        return {
            x: currentPos.x - lastPos.x,
            y: currentPos.y - lastPos.y,
            z: currentPos.z - lastPos.z,
        }
    };


    // Adding operating system specific methods to the Player prototype

    Player.prototype.isMobile = function() {

        const isMobile = this.clientSystemInfo.platformType === "Mobile";

        if (isMobile) {
            return true;
        } else {
            return false;
        }
    }

    Player.prototype.isConsole = function() {
        
        const isConsole = this.clientSystemInfo.platformType === "Console";

        if (isConsole) {
            return true;
        } else {
            return false;
        }
    }

    Player.prototype.isDesktop = function() {
        
        const isDesktop = this.clientSystemInfo.platformType === "Desktop";
        
        if (isDesktop) {
            return true;
        } else {
            return false;
        }
    }


    // Adding utility methods

    Player.prototype.isRiding = function() {
        // The tag `isRiding` is added when the riding animation controller is triggered
        if (this.hasTag("isRiding")) {
            return true;
        } else {
            return false;
        }
    }

    Player.prototype.isInWeb = function() {

        const { x, y, z } = this.location;
        const dimension = this.dimension;
        
        // Iterate through the surrounding blocks (3x4x3 cube centered on the player)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 2; dy++) {  // -1 below, 0 at feet, 1 at head, 2 above head
                for (let dz = -1; dz <= 1; dz++) {
                    
                    // Skip the player's current location (feet position)
                    if (dx === 0 && dy === 0 && dz === 0) continue;
                    
                    const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
                    
                    // If at least one web block is found, return true
                    if (block.typeId === "minecraft:web") {
                        return true;
                    }
                }
            }
        }

        // No web blocks found
        return false;
    }

    Player.prototype.isSlimeBouncing = function() {
        
        if (this.isFalling || this.isFlying) {
            return false;
        }

        // Check if the player touched a slime block and has a positive velocity (being repelled upwards)
        if (this.touchedSlimeBlock && this.getVelocity().y > 0) {
            return true;
        }
    
        return false; // Default return false when not bouncing
    };

    Player.prototype.isTridentHovering = function() {

        if (this.isFalling || this.isFlying) {
            return false;
        }

        if (this.usedRiptideTrident && this.getVelocity().y > 0) {
            return true;
        }

        return false;
    }

    Player.prototype.isLoggedIn = function(ticks) {

        const playerInfo = Memory.get(this.id);  // Retrieve player info from Memory
    
        if (!playerInfo) {
            return false;
        }
    
        const loginMs = playerInfo.loginMs;
        const currentMs = Date.now();
    
        const delayTicks = ticks ?? 100; // Default to 100 ticks (5 seconds)
        const ticksInMs = delayTicks * 50; // Convert ticks to milliseconds
    
        return (currentMs - loginMs > ticksInMs);
    };
}

/**
 * Initializes and enhances the Entity prototype with custom methods.
 */
export function loadEntityPrototypes() {

    Entity.prototype.isPlayer = function() {
        return this.typeId === "minecraft:player";
    }
}