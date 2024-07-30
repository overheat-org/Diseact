module.exports =
<command name="command">
    <subcommand name="subcommand">
        {(interaction) => {
            interaction.reply("subcommand");
        }}
    </subcommand>

    <subcommand name="with-args">
        <string name="my-string" />

        {(interaction) => {
            const str = interaction.options.get("my-string");

            interaction.reply(str);
        }}
    </subcommand>
</command>