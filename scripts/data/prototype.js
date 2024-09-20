import { Player } from "@minecraft/server";

/**
 * Initializes and enhances the Player prototype with custom methods.
 */
export function initializePlayerPrototypes() {

    // Adding CPS methods to the Player prototype

    Player.prototype.getCps = function() {
        return this.clicks ?? 0;  // Use nullish coalescing operator
    };

    Player.prototype.setCps = function(cpsValue) {
        this.clicks = cpsValue || 0;
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
}