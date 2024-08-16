import { currentComponent } from "../hooks/index";

export const defer = Promise.prototype.then.bind(Promise.resolve());

const acceptedTypes = {
    "button": 1,
    "selectmenu": 2,
    "textinput": 3,
    "modal": 4
}

let component_id;
let component_render_index;
let type_cache = new Map();

export const generateCustomId = (type) => {
    if(component_id != currentComponent._id || component_render_index != currentComponent._render) {
        type_cache.clear();
    }

    component_id = currentComponent._id;
    component_render_index = currentComponent._render;

    let n = type_cache.get(type) ?? 0;
    n += 1;

    type_cache.set(type, n);

    return `${component_id}${acceptedTypes[type]}${n}`;
}