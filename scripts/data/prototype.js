import { Player } from "@minecraft/server";

/**
 * Initializes and enhances the Player prototype with custom methods.
 */
export function initializePlayerPrototypes() {

    // Adding CPS methods to the Player prototype

    Player.prototype.getCps = function() {
        return this.clicks || 0;  
    };

    Player.prototype.setCps = function(cpsValue) {
        this.clicks = cpsValue;
    };


    // Adding yaw methods to the Player prototype

    Player.prototype.getYaw = function() {
        return this.yaw || 0;  
    };

    Player.prototype.setYaw = function(yawValue) {
        this.yaw = yawValue;
    };

    Player.prototype.getDeltaYaw = function() {
        return this.deltaYaw || 0;  
    };

    Player.prototype.setDeltaYaw = function(deltaYawValue) {
        this.deltaYaw = deltaYawValue;
    };


    // Adding pitch methods to the Player prototype

    Player.prototype.getPitch = function() {
        return this.pitch || 0;  
    };

    Player.prototype.setPitch = function(pitchValue) {
        this.pitch = pitchValue;
    };

    Player.prototype.getDeltaPitch = function() {
        return this.deltaPitch || 0;  
    };

    Player.prototype.setDeltaPitch = function(deltaPitchValue) {
        this.deltaPitch = deltaPitchValue;
    };


    // Adding health methods to the Player prototype

    Player.prototype.isDead = function() {
        return this.getComponent("health").currentValue === 0;
    }

    Player.prototype.isAlive = function() {
        return this.getComponent("health").currentValue > 0;
    }


    // Adding punishmnet methods to the Player prototype

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
    }

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
    }

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
    }
}