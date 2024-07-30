import { renderComponent } from "../lib/render";
import { defer } from "../lib/utils";

let rerenderQueue = [];

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