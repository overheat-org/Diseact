import { useState } from "diseact";
import { jsx as _jsx, jsxs as _jsxs } from "diseact/jsx-runtime";
function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => {
    setCount(c => c + 1);
  };
  const handleDecrement = () => {
    setCount(c => c - 1);
  };
  return _jsxs("message", {
    children: [_jsxs("embed", {
      children: [_jsx("title", {
        children: "Counter"
      }), _jsxs("description", {
        children: ["Count: ", count]
      })]
    }), _jsx("button", {
      isSuccess: true,
      label: "+",
      onClick: handleIncrement
    }), _jsx("button", {
      isDanger: true,
      label: "-",
      onClick: handleDecrement
    })]
  });
}
export default Counter;