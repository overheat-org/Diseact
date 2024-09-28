import { rerenderQueue } from "../internal/render";
import { renderComponent } from "../lib/render";

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