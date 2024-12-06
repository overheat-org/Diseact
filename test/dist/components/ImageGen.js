import { useState } from 'diseact';
import { jsx as _jsx, jsxs as _jsxs } from "diseact/jsx-runtime";
function ImageGeneration() {
  const [option, setOption] = useState('square');
  const handleSelection = i => {
    setOption(i.values[0]);
  };
  return _jsxs("message", {
    children: [_jsx("canvas", {
      context: "2d",
      height: 200,
      width: 400,
      children: option == 'square' ? _jsx("rectangle", {
        x: 200,
        y: 100,
        height: 20,
        width: 20
      }) : _jsx("circle", {
        x: 200,
        y: 100,
        radius: 20
      })
    }), _jsxs("selectmenu", {
      isString: true,
      max: 1,
      placeholder: "Select",
      onSelect: handleSelection,
      children: [_jsx("option", {
        value: "square",
        children: "Square"
      }), _jsx("option", {
        value: "circle",
        children: "Circle"
      })]
    })]
  });
}
export default ImageGeneration;