export default (
    <command name="ping" description="Pong!">
        {(interaction) => {
            interaction.reply('pong!')
        }}
    </command>
)