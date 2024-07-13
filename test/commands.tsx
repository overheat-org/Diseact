import { CommandInteraction } from "discord.js";
import Diseact from "..";

const localization = {
	name: {
		"pt-BR": "membro"
	},
	description: {
		"pt-BR": "membro"
	}
}


export default (
	<command name="member" description="" localizations={localization}>
		<subcommand name="add">
			<string name="myString " autocomplete={() => {}} optional/>
			{(interaction) => {
				interaction.reply("adding")
			}}
		</subcommand>
		<subcommand name="remove">
			{(interaction) => {
				interaction.reply("removing")
			}}
		</subcommand>
	</command>
)