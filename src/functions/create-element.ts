export function createElement<P>(type: P, props, children): JSX.Element
export function createElement<P>(type: P, props, children): JSX.Element
export function createElement<P extends keyof JSX.IntrinsicElements>(type: P, props: JSX.IntrinsicElements[P], children: JSX.Element | string): JSX.Element
export function createElement(type: unknown, props: unknown, ...children: unknown[]): unknown {	
	if(!props) props = {};
	if(!children) props = [];

	return {
		type,
		props,
		children
	}
}

export function Fragment(props) {
	return props.children;
}