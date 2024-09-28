import { enqueueRender } from '../internal/render';

/** @type {import('../lib/component').default} */
export let currentComponent, currentIndex = 0;

export const setCurrentIndex = index => currentIndex = index;

export const setCurrentComponent = component => currentComponent = component;

function getHookState(index) {
    if (index >= currentComponent.hooks.list.length) {
        currentComponent.hooks.list.push({});
    }

    return currentComponent.hooks.list[index];
}

export function useState(initialState) {
    return useReducer(invokeOrReturn, initialState);
}


export function useReducer(reducer, initialState, init) {
    const component = currentComponent;
    const hookState = getHookState(currentIndex++);

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
    const hookState = getHookState(currentIndex++);
    const hasChanged = !hookState.args || args.some((arg, i) => arg !== hookState.args[i]);

    if (hasChanged) {
        hookState.value = callback;
        hookState.args = args;
        currentComponent.hooks.pendingEffects.push(hookState);
    }
}

export function flushEffects() {
    const hooks = currentComponent.hooks;

    if (hooks) {
        hooks.pendingEffects.forEach(invokeCleanup);
        hooks.pendingEffects.forEach(invokeEffect);
        hooks.pendingEffects = [];
    }
}

function invokeOrReturn(arg, f) {
	return typeof f == 'function' ? f(arg) : f;
}