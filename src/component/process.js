import { renderComponent } from "../render";
import { defer } from "../utils";

let rerenderQueue = new Array();

export function enqueueRender(c) {
    if (!c._dirty && !process._rerenderCount++) {
        c._dirty = true;
        rerenderQueue.push(c);
        defer(process);
    }
}

function process() {
    let c;
    while ((c = rerenderQueue.shift())) {
        if (c._dirty) {
            renderComponent(c);
        }
    }
    process._rerenderCount = 0;
}

process._rerenderCount = 0;