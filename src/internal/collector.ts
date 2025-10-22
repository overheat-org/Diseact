import { Client, Interaction } from "discord.js";
import { renderContext } from "./context";

let connected = false;
const states = new Map();

export function on(target, callback: (interaction: Interaction) => unknown) {
    states.set(target.custom_id, renderContext.recover(callback));
}

export function handle(target) {
    if(connected) return;

    if('client' in target) {
        listen(target.client);
    }
}

function listen(client: Client) {
    connected = true;

    client.on('interactionCreate', async interaction => {
        if(!interaction.isMessageComponent()) return;

        const fn = states.get(interaction.customId);
        if(!fn) return;
        let res = fn(interaction);

        if(res instanceof Promise) res = await evalPromise(res);
        
        switch (typeof res) {
            case 'string':
            case 'object':
                interaction.reply(res);
                break;

            case 'undefined':
                interaction.deferUpdate();
        }

        async function evalPromise(res: Promise<unknown>) {
            if('deferReply' in interaction) {
                interaction.deferReply();
            }

            return await res;
        }
    });
}
