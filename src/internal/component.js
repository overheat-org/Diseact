import { renderComponent } from "../lib/render";
import { defer } from "../lib/utils";

let rerenderQueue = [];
let isProcessing = false;

export function enqueueRender(c) {
    rerenderQueue.push(c);
    defer(process);
}

async function process() {
    if (isProcessing) return;
    isProcessing = true;
    
    let c;
    while ((c = rerenderQueue.shift())) {
        await renderComponent(c);
    }

    isProcessing = false;
    process._rerenderCount = 0;
}

process._rerenderCount = 0;