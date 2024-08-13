module.exports =
<command name="command" description="command">
    <subcommand name="subcommand" description="subcommand">
        {(interaction) => {
            interaction.reply("subcommand");
        }}
    </subcommand>

    <subcommand name="with-args" description="have args">
        <string name="my-string" description="your string" />

        {(interaction) => {
            const str = interaction.options.get("my-string");

            interaction.reply(str);
        }}
    </subcommand>
</command>