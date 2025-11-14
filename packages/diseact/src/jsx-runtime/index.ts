import transformElement from '@internal/transformer';

function jsx(type, _props) {
    let { children, ...props } = _props;

    const handleChildren = c => {
        switch (typeof c) {
            case 'object':
            case 'function':
                return c;

            default:
                return createTextElement(c);
        }
    }

    children = Array.isArray(children) ? children.map(handleChildren) : handleChildren(children);
 
    return transformElement({ type, props, children });
}

function createElement(type, props, ...children: unknown[]) {
    children = children.map(c => {
        switch (typeof c) {
            case 'object':
            case 'function':
                return c;

            default:
                return createTextElement(c);
        }
    });

    return transformElement({ type, props, children });
}

function createTextElement(text) {
	return {
		type: "TEXT_ELEM",
		props: {
			value: text
		},
		children: undefined
	}
}

function Fragment(props) {
	return props.children;
}

export {
    Fragment,
    createElement,
    jsx,
    jsx as jsxs,
    jsx as jsxDEV
}
