import { jsx as _jsx } from "diseact/jsx-runtime";
export default _jsx("command", {
  name: "ping",
  description: "Pong!",
  children: interaction => {
    interaction.reply('pong!');
  }
});