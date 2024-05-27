import data from "../../data/data";

/**
 * @name logs
 * @param {object} message - Message object
 */

export function logs(message) {
    // Validate the input
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    let logs = data.recentLogs;   

    player.sendMessage("§r§8- §uRosh Logs §8-");  

    for (let i = 0; i < logs.length; i++) {
        player.sendMessage(logs[i]);
    }
}