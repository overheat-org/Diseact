import { _deferred } from '../lib/utils.js';

export let isConnected = false;

/**
 * @type {{ listeners: Map<string, Function> }}
 */
export const collectorState = globalThis.DISEACT_COLLECTOR_STATE
    ? new Proxy(globalThis.DISEACT_COLLECTOR_STATE, {
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

        const handleResponse = (response) => {
            switch (typeof response) {
                case 'object':
                    if(response.type == _deferred) {
                        handleResponse(response.value);
                        collectorState.listeners.delete(interaction.customId);

                        break;
                    }
    
                case 'string':
                    interaction.reply(response);
                    break;
    
                case 'undefined':
                    interaction.deferUpdate();
                    break;
            }
        }

        handleResponse(response);
    })
}