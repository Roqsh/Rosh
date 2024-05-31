import config from "../../data/config.js";

/**
 * @name about
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
*/

export function about(message, args) {
  
  if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
  if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

  const player = message.sender;
  const themecolor = config.themecolor;
  const moduleName = args[0];

  // Check if the module exists in the config file
  if (!config.modules[moduleName]) {
    return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that check.`);
  }

  // Check if the module has a description
  if (!config.modules[moduleName].description) {
    return player.sendMessage(`§r${themecolor}Rosh §j> §cThat check has no description.`);
  }

  const description = config.modules[moduleName].description;

  player.sendMessage(`§r${themecolor}Rosh §j> §aDescription of §8${moduleName}§a: §8${description}`);
}