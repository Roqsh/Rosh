import config from "../../data/config.js";

/**
 * @name about
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function about(message, args) {
  // Validate the input
  if (typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
  if (typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

  const player = message.sender;
  const themecolor = config.themecolor;
  const moduleName = args[0];

  // Check if the module exists in the config file
  if (!config.modules[moduleName]) {
    return player.sendMessage(`§r${themecolor}Rosh §j> §cCouldn't find that check.`);
  }

  const module = config.modules[moduleName];

  // Check if the module has a description
  if (!module.description) {
    return player.sendMessage(`§r${themecolor}Rosh §j> §cThat check has no description.`);
  }

  const description = module.description;
  const check = args[0].replace(/([A-Z])/g, '/$1').replace(/^./, str => str.toUpperCase());

  player.sendMessage(`§r${themecolor}Rosh §j> §aDescription of §8${check}§a: §8${description}`);
}