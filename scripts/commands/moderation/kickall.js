export function kickall(message) {
   
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    const player = message.sender;
    player.runCommandAsync("event entity @a[tag=!op] scythe:kick");
}