import { parseElement } from '../internal/parser';

const EMPTY_ARRAY = Object.freeze([]);

export function createElement(type, props, ...children) {
	return parseElement({ 
		type, 
		props, 
		children: children.map(c =>
			typeof c == 'object' ? c : createTextElement(c)
		) ?? EMPTY_ARRAY
	});
}

function createTextElement(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			value: text
		},
		children: EMPTY_ARRAY
	}
}

export function Fragment(props) {
	return props.children;
}