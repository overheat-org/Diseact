import { process } from "./process.js";
import { defer } from "../lib/utils.js";

export let rerenderQueue = [];

export function enqueueRender(c) {
    rerenderQueue.push(c);
    defer(process);
}