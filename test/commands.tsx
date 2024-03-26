import Diseact, { Localization } from "../types";

const localization: Localization = {
	name: {
		"pt-BR": "membro"
	},
	description: {
		"pt-BR": "membro"
	}
}


export default (
	<command name="member" description="" localization={localization}>
		<subcommand name="add">
			<string id="hi" />

			{(interaction) => {
				interaction
			}}
		</subcommand>
	</command>
)