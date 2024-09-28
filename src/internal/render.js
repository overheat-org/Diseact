import { process } from "./process";
import { defer } from "../lib/utils";

export let rerenderQueue = [];

export function enqueueRender(c) {
    rerenderQueue.push(c);
    defer(process);
}