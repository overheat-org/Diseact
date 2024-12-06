import Diseact from 'diseact';
import Pokemon from '../components/Pokemon';
import { jsx as _jsx, jsxs as _jsxs } from "diseact/jsx-runtime";
export default _jsxs("command", {
  name: "pokemon",
  description: "Show a pokemon",
  children: [_jsx("string", {
    name: "id",
    description: "Your pokemon name or id",
    optional: true
  }), interaction => {
    const id = interaction.options.get('id')?.value ?? Math.floor(Math.random() * 1010) + 1;
    Diseact.render(interaction, _jsx(Pokemon, {
      id: id
    }));
  }]
});