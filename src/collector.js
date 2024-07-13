export let isConnected = false;

/**
 * @type {Map<string, Function>}
 */
export const listeners = new Map();

/**
 * @param {import('discord.js').Client} client 
 */
export function Run(client) {
    isConnected = true;

    client.on('interactionCreate', interaction => {
        if(!interaction.isMessageComponent()) return;

        listeners.get(interaction.customId)?.(interaction);
    })
}