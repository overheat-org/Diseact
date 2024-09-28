export let isConnected = false;

/**
 * @type {{ listeners: Map<string, Function> }}
 */
export const collectorState = global.DISEACT_COLLECTOR_STATE
    ? new Proxy(global.DISEACT_COLLECTOR_STATE, {
        get(target, prop) {
            return target[prop];
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        }
    })
    : {
        listeners: new Map,
    }

/**
 * @param {import('discord.js').Client} client 
 */
export function Run(client) {
    isConnected = true;

    client.on('interactionCreate', interaction => {
        if(!interaction.isMessageComponent()) return;

        const fn = collectorState.listeners.get(interaction.customId)
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