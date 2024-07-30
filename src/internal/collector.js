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

        const fn = listeners.get(interaction.customId)
        if(!fn) return;

        const response = fn(interaction);

        switch (typeof response) {
            case 'object':
            case 'string': 
                interaction.reply(response);
                break;

            case 'undefined':
                interaction.deferUpdate();
                break;
        }
    })
}