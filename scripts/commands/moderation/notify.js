export function notify(message) {
   
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;

    if(player.hasTag("notify")) {
        player.removeTag("notify");
        player.sendMessage("§r§uRosh §j> §cYou will no longer receive notifications.");
    } else {
        player.addTag("notify");
        player.sendMessage("§r§uRosh §j> §aYou will now receive notifications.");
    }
}