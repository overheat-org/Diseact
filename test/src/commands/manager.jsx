import { ChannelType } from "discord.js";

export default (
    <command name="manage">
        <group name="channel">
            <subcommand name="create">
                <string name="name" />
                
                {interaction => {
                    const name = interaction.options.get('name', true).value;

                    interaction.guild.channels.create({ name, type: ChannelType.GuildText });
                    
                    interaction.reply('created')
                }}
            </subcommand>
            <subcommand name="delete">
                <channel name="channel" />
                
                {async interaction => {
                    const { channel } = interaction.options.get('channel', true);

                    await channel.delete()
                    
                    interaction.reply('deleted')
                }}
            </subcommand>
        </group>
    </command>
)