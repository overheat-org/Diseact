import { createElement, Fragment } from '../lib/index';

const jsx = (type, _props) => {
    let { children, ...props } = _props;

    if(!Array.isArray(children)) {
        if(!children) {
            children = [];
        }
        else {
            children = [children];
        }
    } 

    return createElement(type, props, ...children);
}

export {
    Fragment,
    createElement,
    jsx,
    jsx as jsxs
}