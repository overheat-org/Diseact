import { rerenderQueue } from "../internal/render.js";
import { renderComponent } from "../lib/render.js";

let isProcessing = false;

export async function process() {
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