import { jsxs, jsx } from '@jsx-oh/discord/jsx-runtime';
import { useState } from '@jsx-oh/discord/hooks';

function Counter() {
    var _a = useState(0), count = _a[0], setCount = _a[1];
    var handleIncrement = function () {
        setCount(function (c) { return c + 1; });
    };
    var handleDecrement = function () {
        setCount(function (c) { return c - 1; });
    };
    return jsxs("message", { children: [jsxs("embed", { children: [jsx("title", { children: "Counter" }), jsxs("description", { children: ["Count: ", count] })] }), jsxs("row", { children: [jsx("button", { id: "counter-plus", success: true, label: '+', onClick: handleIncrement }), jsx("button", { id: "counter-minus", danger: true, label: '-', onClick: handleDecrement })] })] });
}

export { Counter as default };
