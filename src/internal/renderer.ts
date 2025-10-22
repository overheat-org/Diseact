import evaluateElement from './evaluation';
import { RenderContext, renderContext } from './context';
import ComponentBuilder from './component';
import { flushEffects } from '../hooks';
import evaluate from './evaluation';
import { SlashCommandInteractionAdapter } from './adapters';
import * as collector from './collector';

export async function render(target, elem) {
    collector.handle(target);

    return await renderContext.init(async context => {
        if(typeof elem != 'function') return await evaluateElement(target, elem, true);

        const builder = new ComponentBuilder(elem)
            .setTarget(target)
            .setRenderer(renderComponent);

        if(target.constructor.name == 'ChatInputCommandInteraction') {
            builder.setProps(new SlashCommandInteractionAdapter(target));
        }
        else {
            // TODO: Props are wrong
            builder.setProps(elem);
        }

        context.queueRender(elem);
    });
}

async function renderComponent(component) {
    const hooksState = renderContext.getHooksState();

    hooksState.index = 0;
    hooksState.component = component;
    component.renderCount++;

    const content = component(component.props);

    flushEffects();

    try {
        const target = await evaluate(component.target, content, component.renderCount == 1);
        component.target = target;
    } catch (error) {
        throw error;
    }
}

export async function handleProcess(renderContext: RenderContext) {
    if(renderContext.processing) return;

    const queue = renderContext.getQueueState();
    renderContext.processing = true;

    let c;
    while ((c = queue.shift())) {
        await c.render();
    }

    renderContext.processing = false;
    handleProcess._rerenderCount = 0;
}

handleProcess._rerenderCount = 0;
