import { Fragment } from "../functions/create-element";
import { Target, renderComponent } from "../render";
import { assign, defer } from "../utils";
import { setCurrentComponent, setCurrentIndex } from "./hooks";

let rerenderQueue = new Array();

export function enqueueRender(c) {
    if (
        (!c._dirty &&
            (c._dirty = true) &&
            rerenderQueue.push(c) &&
            !process._rerenderCount++
		)
    ) {
        defer(process);
    }
}

const depthSort = (a, b) => a._vnode._depth - b._vnode._depth;

function process() {
    let c;
    rerenderQueue.sort(depthSort);
    while ((c = rerenderQueue.shift())) {
        if (c._dirty) {
            let renderQueueLength = rerenderQueue.length;
            renderComponent(c);
            if (rerenderQueue.length > renderQueueLength) {
                rerenderQueue.sort(depthSort);
            }
        }
    }
    process._rerenderCount = 0;
}

process._rerenderCount = 0;