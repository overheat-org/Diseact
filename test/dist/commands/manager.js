import { ChannelType } from "discord.js";
import { jsx as _jsx, jsxs as _jsxs } from "diseact/jsx-runtime";
export default _jsx("command", {
  name: "manage",
  children: _jsxs("group", {
    name: "channel",
    children: [_jsxs("subcommand", {
      name: "create",
      children: [_jsx("string", {
        name: "name"
      }), interaction => {
        const name = interaction.options.get('name', true).value;
        interaction.guild.channels.create({
          name,
          type: ChannelType.GuildText
        });
        interaction.reply('created');
      }]
    }), _jsxs("subcommand", {
      name: "delete",
      children: [_jsx("channel", {
        name: "channel"
      }), async interaction => {
        const {
          channel
        } = interaction.options.get('channel', true);
        await channel.delete();
        interaction.reply('deleted');
      }]
    })]
  })
});