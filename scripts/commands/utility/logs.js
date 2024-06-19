import data from "../../data/data";
import config from "../../data/config.js";

/**
 * Displays logged information.
 * @name logs
 * @param {object} message - The message object containing the sender's information.
 * @param {array} args - Additional arguments provided, with the first argument being the target player's name.
 * @throws {TypeError} If the message is not an object or if args is not an array.
 */
export function logs(message, args = []) {
    // Validate the input
    if (typeof message !== "object" || !message.sender) {
        throw new TypeError(`message is type of ${typeof message}. Expected "object" with "sender" property.`);
    }
    if (!Array.isArray(args)) {
        throw new TypeError(`args is type of ${typeof args}. Expected "array".`);
    }

    const player = message.sender;
    const themecolor = config.themecolor;

    // Determine the page or set it to 1 if no page is specified
    let page = args[0] ? parseInt(args[0]) : 1;

    // Check if page is less than 1 and send an error message
    if (isNaN(page) || page < 1) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cPage number must be at least 1.`);
        return;
    }

    const LinesPerPage = config.logSettings.linesPerPage;
    const logs = data.recentLogs;
    const totalPages = Math.ceil(logs.length / LinesPerPage);
    
    // Check if page number exceeds total pages
    if (page > totalPages) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cPage number exceeds total pages (${totalPages}).`);
        return;
    }

    const start = (page - 1) * LinesPerPage;
    const end = start + LinesPerPage;
    const pageLogs = logs.slice(start, end);

    // Handle empty pageLogs
    if (pageLogs.length === 0) {
        player.sendMessage(`§r${themecolor}Rosh §j> §cNo logs available on this page.`);
        return;
    }

    const text = pageLogs.join("\n");

    player.sendMessage(`§r${themecolor}Logs §j> §aPage ${page}/${totalPages}`);
    player.sendMessage(text);
}