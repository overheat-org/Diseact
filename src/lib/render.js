import util from 'util';
import { DISEACT_DEV } from "../internal/debug";
import { flushEffects, currentState } from "../hooks";
import * as collector from '../internal/collector';
import { randomBytes } from 'crypto';
import { enqueueRender } from '../internal/render';
import Component from './component';

function objectInspect(prop) {
    return util.inspect(prop, { colors: true, depth: 3 });
}

export async function evaluate(target, content, first) {
    switch (true) {
        case target.constructor.name == 'TextChannel': {
            target = await target.send(content);
            
            break;
        }
        case target.constructor.name == 'ChatInputCommandInteraction': {
            if (first) {
                await target.reply(content);
            } else {
                if (target.ephemeral) {
                    throw new Error("Cannot edit an ephemeral interaction");
                }
                await target.editReply(content);
            }
            break;
        }
        case target.constructor.name == 'Message': {
            if (first) {
                target = await target.channel.send(content);
            } else {
                target = await target.edit(content);
            }
            break;
        }
        default:
            throw new Error(`Unexpected target: ${target}`);
    }

    return target;
}

/** @param {Component} component  */
export async function renderComponent(component) {
    currentState.index = 0;
    currentState.component = component;
    component.render = 1 + (component.render ?? -1);
    
    if(DISEACT_DEV) console.log(`${component.render} [${component.name} : ${component.id}]:\n\tprops: ${objectInspect(component.props)}\n\thooks: ${objectInspect(component.hooks)}`);
    
    const content = component.run(component.props);

    if(DISEACT_DEV) console.log(`\n\tcontent: ${objectInspect(content)}`)

    flushEffects();

    try {
        const target = await evaluate(component.target, content, component.render == 1);
        component.target = target;
    } catch (error) {
        throw error;
    }
}

export async function render(target, component) {
    if(!collector.isConnected) {
        collector.Run(target.client);
    }

    if (component.constructor.name == Component.name) {
        component.target = target;
        component.id = randomBytes(2).toString('hex');
        enqueueRender(component);
    } else {
        await evaluate(target, component, true);
    }
}