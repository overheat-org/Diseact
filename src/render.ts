import { CommandInteraction, InteractionEditReplyOptions, InteractionReplyOptions, Message, MessageCreateOptions, MessageEditOptions, TextChannel } from "discord.js";
import { parseElement } from "./elements/parser";
import { Component } from "./components/entity";
import { flushEffects } from "./components/hooks";

export type Target = 
    | Message 
    | TextChannel 
    | CommandInteraction;

export async function evaluate(target: Target, content: ReturnType<typeof parseElement>, first: boolean) {
    switch (true) {
        case target instanceof TextChannel: {
            target = await target.send(content as MessageCreateOptions);
            break;
        }
        case target instanceof Message: {
            if (first) {
                target = await target.channel.send(content as MessageCreateOptions);
            } else {
                await target.edit(content as MessageEditOptions);
            }
            break;
        }
        case target instanceof CommandInteraction: {
            if (first) {
                await target.reply(content as InteractionReplyOptions);
            } else {
                if (target.ephemeral) {
                    throw new Error("Cannot edit an ephemeral interaction");
                }
                await target.editReply(content as InteractionEditReplyOptions);
            }
            break;
        }
        default:
            throw new Error(`Unexpected target: ${target}`);
    }

    return target;
}

export async function renderComponent(component: Component, first = false) {
    const prevProps = component.props;
    const prevState = component.state;

    let shouldUpdate = true;

    if (component.shouldUpdate) {
        shouldUpdate = component.shouldUpdate(component.props, component.state);
    }

    if (shouldUpdate) {
        component.willUpdate?.(component.props, component.state);

        component.prepareHooks();
        const renderedOutput = component.render();
		console.log('rerender comp')
        flushEffects();

        const content = parseElement(renderedOutput);

        try {
            const target = await evaluate(component.target, content, first);
            component.target = target;
            if (first) {
                component.didMount?.();
            } else {
                component.didUpdate?.(prevProps, prevState);
            }
        } catch (error) {
            throw new Error(`Error during evaluation: ${error}`);
        }
    }

    if (component._force) {
        component._force = false;
    }

    while (component._renderCallbacks.length) {
        const callback = component._renderCallbacks.pop();
        if (callback) callback();
    }
}

export async function render(target: Target, component: JSX.Element) {
    const root = parseElement(component);

    if (root instanceof Component) {
        root.target = target;
        await renderComponent(root, true);
    } else {
        await evaluate(target, root, true);
    }
}
