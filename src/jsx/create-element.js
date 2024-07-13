export function createElement(type, props, ...children) {
	if(typeof children[0] == 'string') {
		children = [children.join('')];
	}

	return {
		type,
		props: {
			children: [...children],
			...props
		}
	}
}

export function Fragment(props) {
	return props.children;
}