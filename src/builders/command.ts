import { LocalizationMap, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { Command, SubCommandGroup, SubCommand, ElementType } from "../elements";

export type Localization = { name: LocalizationMap, description: LocalizationMap }

export function CommandElement(props: Command, children: CommandElementChildren) {
	const data = new SlashCommandBuilder()
		.setName(props.name)
		.setDescription(props.description ?? ' ')
		.setNSFW(props.nsfw ?? false);

	const MAIN_FN = '0';
	const runMap = new Map<string, CommandRun>();
		
	if(props.localization) {
		data.setNameLocalizations(props.localization.name);
		data.setDescriptionLocalizations(props.localization.description);
	}

	for(const child of children) {
		if(typeof child == 'function') {
			runMap.set(MAIN_FN, child)
			
			continue;
		}
		
		switch (child._e) {
			case ElementType.SubCommand:
				data.addSubcommand(child.data);
				runMap.set(child.data.name, child.run);
				break;
			
			// case ElementType.Group:
			// 	data.addSubcommandGroup(child.data);
			// 	for(const groupChild of child.children) {
					
			// 	}
			// 	break;
		}
	}

	function run() {}

	return { _e: ElementType.Command as const, data, run }
}

export function SubCommandElement(props: SubCommand, children) {
	const data = new SlashCommandSubcommandBuilder()
		.setName(props.name)
		.setDescription(props.description ?? ' ');
	
	let run: CommandRun | undefined = undefined;
	
	if(props.localization) {
		data.setNameLocalizations(props.localization.name);
		data.setDescriptionLocalizations(props.localization.description);
	}

	for(const child of children) {
		if(typeof child == 'function') {
			run = child;
		}
	}

	return { _e: ElementType.SubCommand as const, data, run: run! }
}

export function SubCommandGroupElement(props: SubCommandGroup, children) {
	const data = new SlashCommandSubcommandGroupBuilder()

	return { _e: ElementType.Group as const }
}

type CommandRun = () => any
type CommandElementChildren = (
	ReturnType<typeof SubCommandElement | typeof SubCommandGroupElement>
	| CommandRun
)[]