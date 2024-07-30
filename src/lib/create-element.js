import { parseElement } from '../internal/parser';

export function createElement(type, props, ...children) {
	return parseElement({ type, props, children });
}

export function Fragment(props) {
	return props.children;
}