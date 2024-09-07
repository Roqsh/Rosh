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
}