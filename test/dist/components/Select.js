import { useState } from "diseact";
import { jsx as _jsx, jsxs as _jsxs } from "diseact/jsx-runtime";
function Select() {
  const [option, setOption] = useState(null);
  const handleSelection = i => {
    setOption(i.values[0]);
  };
  return _jsxs("message", {
    children: [_jsxs("embed", {
      children: [_jsx("title", {
        children: "Options"
      }), _jsx("description", {
        children: option ? `Selected: ${option}` : 'Nothing'
      })]
    }), _jsxs("selectmenu", {
      isString: true,
      max: 1,
      placeholder: "Select",
      onSelect: handleSelection,
      children: [_jsx("option", {
        value: "cat",
        label: "Cat",
        children: "It's a cat"
      }), _jsx("option", {
        value: "dog",
        label: "Dog",
        children: "It's a dog"
      })]
    })]
  });
}
export default Select;