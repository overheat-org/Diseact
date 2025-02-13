import { enqueueRender } from '../internal/render.js';

/** @type {{ component?: object, index: number }} */
export const globalHookState = globalThis.DISEACT_HOOK_STATE 
    ? new Proxy(globalThis.DISEACT_HOOK_STATE, {
        get(target, prop) {
            return target[prop];
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        }
    }) 
    : {
        component: undefined,
        index: 0
    };

function getHookState(index) {
    if (index >= globalHookState.component.hooks.list.length) {
        globalHookState.component.hooks.list.push({});
    }

    return globalHookState.component.hooks.list[index];
}

export function useState(initialState) {
    return useReducer(invokeOrReturn, initialState);
}

export function useReducer(reducer, initialState, init) {
    const component = globalHookState.component;
    const hookState = getHookState(globalHookState.index++);

    if (!hookState.initialized) {
        hookState.value = init ? init(initialState) : initialState;
        hookState.initialized = true;
    }
    

    const dispatch = (action) => {
        const currentValue = hookState.value;
        const nextValue = reducer(currentValue, action);

        if (nextValue !== currentValue) {
            hookState.value = nextValue;
            enqueueRender(component);
        }
    };

    return [hookState.value, dispatch];
}


function invokeCleanup(hook) {
    if (typeof hook.cleanup === 'function') {
        hook.cleanup();
    }
}

function invokeEffect(hook) {
    hook.cleanup = hook.value();
}

export function useEffect(callback, args) {
    const hookState = getHookState(hookState.index++);
    const hasChanged = !hookState.args || args.some((arg, i) => arg !== hookState.args[i]);

    if (hasChanged) {
        hookState.value = callback;
        hookState.args = args;
        hookState.component.hooks.pendingEffects.push(hookState);
    }
}

export function flushEffects() {
    const hooks = globalHookState.component.hooks;

    if (hooks) {
        hooks.pendingEffects.forEach(invokeCleanup);
        hooks.pendingEffects.forEach(invokeEffect);
        hooks.pendingEffects = [];
    }
}

function invokeOrReturn(arg, f) {
	return typeof f == 'function' ? f(arg) : f;
}