import { Embed } from "./Embed.js";

/**
 * A class for sending messages or embeds via Discord webhooks.
 */
export class Webhook {

    /**
     * Sends a webhook message to Discord.
     * @param {string} webhookUri - The Discord webhook URL.
     * @param {object} payload - The webhook payload.
     * @param {string} [payload.content] - The plain text content of the message.
     * @param {Array<object>} [payload.embeds] - An array of embed objects or `Embed` instances.
     * @example
     * const embed = new Embed();
     * embed.setTitle("Test Embed");
     * embed.setDescription("This is a test.");
     * Webhook.sendWebhook("<your-webhook-url>", { content: "Hello, World!", embeds: [embed] });
     * @credits https://github.com/m0lc14kk/WebhookAPI <3
     */
    static async sendWebhook(webhookUri, { content = "", embeds = [] }) {

        const webhookContent = {
            content,
            embeds: embeds.map(embed => embed instanceof Embed ? embed.toJSON() : embed),
        };

        try {
            const { http, HttpHeader, HttpRequestMethod, HttpRequest } = await import("@minecraft/server-net");

            await http.request(
                new HttpRequest(webhookUri)
                    .setBody(JSON.stringify(webhookContent))
                    .setHeaders([
                        new HttpHeader("Content-Type", "application/json"),
                        new HttpHeader("Accept", "application/json"),
                    ])
                    .setMethod(HttpRequestMethod.Post),
            );
        } catch (error) {
            console.error(`Failed to send webhook: ${error}${error.stack}`);
        }
    }
}