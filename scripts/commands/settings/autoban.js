
/**
 * @name autoban
 * @param {object} message - Message object
*/

export function autoban(message) {
    
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    player.runCommandAsync("function settings/autoban");
}