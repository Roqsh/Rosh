

/**
 * A class representing a Discord embed object for rich messages.
 */
export class Embed {

    constructor() {
        this.title = null;
        this.description = null;
        this.url = null;
        this.timestamp = null;
        this.color = 0x7289DA; // Default color (Discord blue)
        this.image = null;
        this.thumbnail = null;
        this.video = null;
        this.author = null;
        this.footer = null;
        this.fields = [];
    }

    /**
     * Sets the title of the embed.
     * @param {string} title - The title text.
     * @example
     * const embed = new Embed();
     * embed.setTitle("Welcome to the Server!");
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Sets the description of the embed.
     * @param {string|string[]} description - The description text or an array of lines.
     * @example
     * const embed = new Embed();
     * embed.setDescription("This is a single-line description.");
     *
     * // Or use multiple lines:
     * embed.setDescription([
     *   "Line 1: Welcome to the server!",
     *   "Line 2: Here are the rules...",
     * ]);
     */
    setDescription(description) {
        this.description = Array.isArray(description)
            ? description.filter(line => line !== null).join("\n")
            : description;
    }

    /**
     * Sets the URL for the embed (turns the title into a clickable link).
     * @param {string} url - The URL to set.
     * @example
     * const embed = new Embed();
     * embed.setURL("https://example.com");
     */
    setURL(url) {
        this.url = url;
    }

    /**
     * Sets the color of the embed.
     * @param {number} color - The color in decimal format (e.g., 0xFF0000 for red).
     * @example
     * const embed = new Embed();
     * embed.setColor(0x00FF00); // Set color to green
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Sets the timestamp of the embed.
     * @param {Date|string|null} timestamp - A Date object, ISO8601 string, or null to unset.
     * @example
     * const embed = new Embed();
     * embed.setTimestamp(new Date()); // Current timestamp
     */
    setTimestamp(timestamp) {
        this.timestamp = timestamp instanceof Date ? timestamp.toISOString() : timestamp;
    }

    /**
     * Sets the image for the embed.
     * @param {string|object} image - The image URL or image object.
     * @example
     * const embed = new Embed();
     * embed.setImage("https://example.com/image.png");
     */
    setImage(image) {
        this.image = typeof image === "string" ? { url: image } : image;
    }

    /**
     * Sets the thumbnail for the embed.
     * @param {string|object} thumbnail - The thumbnail URL or thumbnail object.
     * @example
     * const embed = new Embed();
     * embed.setThumbnail("https://example.com/thumbnail.png");
     */
    setThumbnail(thumbnail) {
        this.thumbnail = typeof thumbnail === "string" ? { url: thumbnail } : thumbnail;
    }

    /**
     * Sets the video for the embed.
     * @param {string|object} video - The video URL or video object.
     * @example
     * const embed = new Embed();
     * embed.setVideo("https://example.com/video.mp4");
     */
    setVideo(video) {
        this.video = typeof video === "string" ? { url: video } : video;
    }

    /**
     * Sets the author for the embed.
     * @param {object} author - The author object with properties `name`, `iconURL`, and `url`.
     * @example
     * const embed = new Embed();
     * embed.setAuthor({ name: "Bot", iconURL: "https://example.com/icon.png", url: "https://example.com" });
     */
    setAuthor(author) {
        this.author = author;
    }

    /**
     * Sets the footer for the embed.
     * @param {object} footer - The footer object with properties `text` and `iconURL`.
     * @example
     * const embed = new Embed();
     * embed.setFooter({ text: "Powered by Bot", iconURL: "https://example.com/icon.png" });
     */
    setFooter(footer) {
        this.footer = footer;
    }

    /**
     * Adds multiple fields to the embed (up to 25 fields).
     * @param {...object} fields - Field objects with `name`, `value`, and `inline` properties.
     * @example
     * const embed = new Embed();
     * embed.addFields(
     *   { name: "Field 1", value: "Value 1", inline: true },
     *   { name: "Field 2", value: "Value 2", inline: false }
     * );
     */
    addFields(...fields) {
        this.fields.push(...fields);
    }

    /**
     * Replaces all fields in the embed with new ones.
     * @param {...object} fields - Field objects with `name`, `value`, and `inline` properties.
     * @example
     * const embed = new Embed();
     * embed.setFields({ name: "New Field", value: "New Value", inline: true });
     */
    setFields(...fields) {
        this.fields = fields;
    }

    /**
     * Converts the embed to a JSON-compatible object for Discord.
     * @returns {object} The JSON representation of the embed.
     * @example
     * const embed = new Embed();
     * embed.setTitle("Test Title").setDescription("Test Description");
     * console.log(embed.toJSON());
     */
    toJSON() {
        return {
            type: "rich",
            title: this.title,
            description: this.description,
            color: this.color,
            fields: this.fields.map(({ name, value, inline }) => ({
                name,
                value: Array.isArray(value) ? value.filter(line => line !== null).join("\n") : value,
                inline: inline ?? false,
            })),
            author: this.author ? {
                name: this.author.name,
                icon_url: this.author.iconURL,
                url: this.author.url,
            } : null,
            footer: this.footer ? {
                text: this.footer.text,
                icon_url: this.footer.iconURL,
            } : null,
            video: this.video,
            thumbnail: this.thumbnail,
            image: this.image,
            url: this.url,
            timestamp: this.timestamp,
        };
    }
}