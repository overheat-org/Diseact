import util from 'util';
import { DISEACT_DEV } from "../internal/debug";
import { flushEffects, setCurrentComponent, setCurrentIndex } from "../hooks";
import * as collector from '../internal/collector';
import { randomBytes } from 'crypto';
import { enqueueRender } from '../internal/component';

function objectInspect(prop) {
    return util.inspect(prop, { colors: true, depth: 3 });
}

export async function evaluate(target, content, first) {
    switch (true) {
        case 'send' in target: {
            target = await target.send(content);

            break;
        }
        case 'channel' in target: {
            if (first) {
                target = await target.channel.send(content);
            } else {
                await target.edit(content);
            }
            break;
        }
        case 'reply' in target: {
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
        default:
            throw new Error(`Unexpected target: ${target}`);
    }

    return target;
}

export async function renderComponent(component) {
    setCurrentIndex(0);
    setCurrentComponent(component);
    component._render = 1 + (component._render ?? -1);
    
    if(DISEACT_DEV) console.log(`${component._render} [${component.name} : ${component._id}]:\n\tprops: ${objectInspect(component.props)}\n\thooks: ${objectInspect(component.__hooks)}`);
    
    const content = component(component.props);
    
    if(DISEACT_DEV) console.log(`\n\tcontent: ${objectInspect(content)}`)

    flushEffects();

    try {
        const target = await evaluate(component._target, content, component._render == 0);
        component._target = target;
    } catch (error) {
        throw error;
    }

    if (component._force) {
        component._force = false;
    }
}

export async function render(target, component) {
    if(!collector.isConnected) {
        collector.Run(target.client);
    }

    if (typeof component == 'function') {
        component._target = target;
        component._id = randomBytes(2).toString('hex');
        enqueueRender(component);
    } else {
        await evaluate(target, component, true);
    }
}