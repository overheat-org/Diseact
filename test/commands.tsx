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
		<subcommand name="">
			{(interaction: CommandInteraction) => {
				interaction
			}}
		</subcommand>
	</command>
)