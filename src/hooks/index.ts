import { IHook } from '@internal/component';
import { renderContext } from '@internal/context';

export type Dispatch<A> = (value: A) => void;
export type StateUpdater<S> = S | ((prevState: S) => S);

function getHookState(index: number) {
    const storedHookState = renderContext.getHooksState();

    console.log(`Getting HookState: ${storedHookState}`);

    if (index >= storedHookState.component.hooks.list.length) {
        storedHookState.component.hooks.list.push({ initialized: false, value: undefined, args: [] });
    }

    return storedHookState.component.hooks.list[index] as IHook;
}

export function useState<S>(initialState: S | (() => S)) {
    return useReducer<S>(invokeOrReturn, initialState);
}

function useReducer<S>(reducer, initialState, init?) {
    const storedHookState = renderContext.getHooksState();
    const component = storedHookState.component;
    const hookState = getHookState(storedHookState.index++);

    if (!hookState.initialized) {
        hookState.value = init ? init(initialState) : initialState;
        hookState.initialized = true;
    }
    
    const dispatch: Dispatch<StateUpdater<S | undefined>> = (action) => {
        const currentValue = hookState.value;
        const nextValue = reducer(currentValue, action);

        if (nextValue !== currentValue) {
            hookState.value = nextValue;
            renderContext.queueRender(component);
        }
    };

    return [hookState.value, dispatch] as [S, Dispatch<StateUpdater<S>>];
}

function invokeCleanup(hook: IHook) {
    if (typeof hook.cleanup === 'function') {
        hook.cleanup();
    }
}

function invokeEffect(hook: IHook) {
    hook.cleanup = hook.value();
}

export function useEffect(callback: () => void, args?: ReadonlyArray<unknown>) {
    const storedHookState = renderContext.getHooksState();
    const hookState = getHookState(storedHookState.index++);
    const hasChanged = !hookState.args || args.some((arg, i) => arg !== hookState.args[i]);

    if (hasChanged) {
        hookState.value = callback;
        hookState.args = args;
        storedHookState.component.hooks.pendingEffects.push(hookState);
    }
}

export function flushEffects() {
    const storedHookState = renderContext.getHooksState();
    const hooks = storedHookState.component.hooks;

    if (hooks) {
        hooks.pendingEffects.forEach(invokeCleanup);
        hooks.pendingEffects.forEach(invokeEffect);
        hooks.pendingEffects = [];
    }
}

function invokeOrReturn(arg, f) {
	return typeof f == 'function' ? f(arg) : f;
}
