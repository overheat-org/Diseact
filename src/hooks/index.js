import { enqueueRender } from '../internal/render';

export const currentState = global.DISEACT_CURRENT_STATE_HOOK ?? {
    /** @type {import('../lib/component').default} */
    component: undefined,
    index: 0
}

export const setCurrentIndex = index => currentState.index = index;

export const setCurrentComponent = component => currentState.component = component;

function getHookState(index) {
    if (index >= currentState.component.hooks.list.length) {
        currentState.component.hooks.list.push({});
    }

    return currentState.component.hooks.list[index];
}

export function useState(initialState) {
    return useReducer(invokeOrReturn, initialState);
}


export function useReducer(reducer, initialState, init) {
    const component = currentState.component;
    const hookState = getHookState(currentState.index++);

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
    const hookState = getHookState(currentState.index++);
    const hasChanged = !hookState.args || args.some((arg, i) => arg !== hookState.args[i]);

    if (hasChanged) {
        hookState.value = callback;
        hookState.args = args;
        currentState.component.hooks.pendingEffects.push(hookState);
    }
}

export function flushEffects() {
    const hooks = currentState.component.hooks;

    if (hooks) {
        hooks.pendingEffects.forEach(invokeCleanup);
        hooks.pendingEffects.forEach(invokeEffect);
        hooks.pendingEffects = [];
    }
}

function invokeOrReturn(arg, f) {
	return typeof f == 'function' ? f(arg) : f;
}