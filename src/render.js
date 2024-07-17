import { CommandInteraction, Message, TextChannel } from "discord.js";
import { parseElement } from "./elements/parser";
import { flushEffects, setCurrentComponent, setCurrentIndex } from "./component/hooks";
import * as collector from './collector';

/**
 * @param {Target} target 
 * @param {ReturnType<typeof parseElement>} content 
 * @param {boolean} first 
 */
export async function evaluate(target, content, first) {
    switch (true) {
        case target instanceof TextChannel: {
            target = await target.send(content);

            break;
        }
        case target instanceof Message: {
            if (first) {
                target = await target.channel.send(content);
            } else {
                await target.edit(content);
            }
            break;
        }
        case target instanceof CommandInteraction: {
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

/**
 * @param {JSX.Component} component 
 */
export async function renderComponent(component, first = false) {
    setCurrentIndex(0);
    setCurrentComponent(component);

    const renderedOutput = component(component.props);
    flushEffects();

    const content = parseElement(renderedOutput);

    try {
        const target = await evaluate(component._target, content, first);
        component._target = target;
    } catch (error) {
        throw error;
    }

    if (component._force) {
        component._force = false;
    }

    component._dirty = false;
}

export async function render(target, component) {
    if(!collector.isConnected) {
        collector.Run(target.client);
    }

    const root = parseElement(component);

    if (typeof root == 'function') {
        root._target = target;
        await renderComponent(root, true);
    } else {
        await evaluate(target, root, true);
    }
}
