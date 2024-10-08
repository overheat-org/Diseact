export const defer = Promise.prototype.then.bind(Promise.resolve());

export const JSX = (e) => e;

export function concatenateTextElements(elements) {
    return elements
        .map(el => (el.type === 'TEXT_ELEMENT' ? el.props.value : ''))
        .join('');
}

export const _deferred = Symbol();
export const useDefer = (returns) => ({ type: _deferred, value: returns });