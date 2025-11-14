import { randomBytes } from 'node:crypto';

export interface IHook {
    initialized: boolean;
    value: any;
    args: readonly unknown[];
    cleanup?: () => unknown
}

export interface IComponent {
    hooks: {
        list: IHook[]
        pendingEffects: IHook[]
    }
}

class ComponentBuilder {
    setTarget(target) {
        this.assign({ target });

        return this;
    }

    setRenderer(renderer) {
        this.assign({ render: () => renderer(this.fn) });

        return this;
    }

    setProps(props) {
        this.assign({ props });

        return this;
    }

    private assign(prop) {
        Object.assign(this.fn, prop);
    }

    constructor(private fn: (...args) => unknown) {
        Object.assign(this.fn, { 
            id: randomBytes(2).toString('hex'),
            hooks: { list: [], pendingEffects: [] },
            renderCount: 0
        });
    }
}

export default ComponentBuilder;
