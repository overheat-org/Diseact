import { enqueueRender } from '../internal/component';

export let currentComponent, currentIndex = 0;

export const setCurrentIndex = index => currentIndex = index;
export const setCurrentComponent = component => currentComponent = component;

function getHookState(index) {
    const hooks = currentComponent.__hooks ||= { _list: [], _pendingEffects: [] };

    if (index >= hooks._list.length) {
        hooks._list.push({});
    }

    return hooks._list[index];
}

export function useState(initialState) {
    return useReducer(invokeOrReturn, initialState);
}


export function useReducer(reducer, initialState, init) {
    const component = currentComponent;
    const hookState = getHookState(currentIndex++);

    if (!hookState._initialized) {
        hookState._value = init ? init(initialState) : initialState;
        hookState._initialized = true;
    }

    const dispatch = (action) => {
        const currentValue = hookState._value;
        const nextValue = reducer(currentValue, action);

        if (nextValue !== currentValue) {
            hookState._value = nextValue;
            enqueueRender(component);
        }
    };

    return [hookState._value, dispatch];
}


function invokeCleanup(hook) {
    if (typeof hook._cleanup === 'function') {
        hook._cleanup();
    }
}

function invokeEffect(hook) {
    hook._cleanup = hook._value();
}

export function useEffect(callback, args) {
    const hookState = getHookState(currentIndex++);
    const hasChanged = !hookState._args || args.some((arg, i) => arg !== hookState._args[i]);

    if (hasChanged) {
        hookState._value = callback;
        hookState._args = args;
        currentComponent.__hooks._pendingEffects.push(hookState);
    }
}

export function flushEffects() {
    const hooks = currentComponent.__hooks;

    if (hooks) {
        hooks._pendingEffects.forEach(invokeCleanup);
        hooks._pendingEffects.forEach(invokeEffect);
        hooks._pendingEffects = [];
    }
}

function invokeOrReturn(arg, f) {
	return typeof f == 'function' ? f(arg) : f;
}