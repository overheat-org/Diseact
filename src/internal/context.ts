import { AsyncLocalStorage } from 'node:async_hooks';
import { IComponent } from './component';
import { handleProcess } from './renderer';

export interface HookState {
    component?: IComponent,
    index: number
}

interface RenderState {
    hook: HookState
    effects: any[]
    queue: any[]
    processing: boolean
}

export class RenderContext {
    protected storage = new AsyncLocalStorage<RenderState>();

    run(store: RenderState, callback: () => unknown) {
        return this.storage.run(store, callback);
    }

    getHooksState() {
        console.log('store: ', this.storage.getStore())

        return this.storage.getStore()?.hook;
    }

    getQueueState() {
        return this.storage.getStore()?.queue;
    }

    init(callback: (context) => unknown) {
        return this.run(
            {
                hook: {
                    index: 0,
                    component: undefined
                },
                effects: [],
                queue: [],
                processing: false
            }, 
            () => callback(this)
        );
    }

    get processing() {
        return this.storage.getStore().processing;
    }

    set processing(value: boolean) {
        this.storage.getStore().processing = value;
    }

    queueRender(component) {
        this.storage.getStore().queue.push(component);

        handleProcess(this);
    }

    recover(callback: (...args: any[]) => unknown) {
        const store = this.storage.getStore();

        return (...args: any[]) => {
            return this.run(store, () => callback(...args));
        };
    }
}

export const renderContext = new RenderContext();
