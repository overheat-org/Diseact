import { enqueueRender } from '../internal/component';

/** @type {import('../internal/component').Component} */
export let currentComponent, currentIndex = 0;

export const setCurrentIndex = index => currentIndex = index;
export const setCurrentComponent = component => currentComponent = component;

function getHookState(index) {
    const hooks = currentComponent.__hooks || (currentComponent.__hooks = { _list: [], _pendingEffects: [] });

    if (index >= hooks._list.length) {
        hooks._list.push({});
    }

    return hooks._list[index];
}

export function useState(initialState) {
    const hookState = getHookState(currentIndex++);
    hookState._value = hookState._value || initialState;
    const setState = (newValue) => {
        if(typeof newValue == 'function') {
            newValue = newValue(hookState._value);
        }

        hookState._value = newValue;
        enqueueRender(currentComponent);
    };

    return [hookState._value, setState];
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
