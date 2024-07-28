import { listeners } from "./collector";

// TODO: fazer os comandos
// TODO: adicionar o children nas props mapeadas
// TODO: fazer as polls

function parseCommandOptions(type, data, child) {
	switch (type) {
		case "string":
			data.addStringOption(child.data);
			break;
		case "boolean":
			data.addBooleanOption(child.data);
			break;

		case "channel":
			data.addChannelOption(child.data);
			break;

		case "integer":
			data.addIntegerOption(child.data);
			break;

		case "number":
			data.addNumberOption(child.data);
			break;

		case "user":
			data.addUserOption(child.data);
			break;

		case "role":
			data.addRoleOption(child.data);
			break;

		case "mentionable":
			data.addMentionableOption(child.data);
			break;

		case "attachment":
			data.addAttachmentOption(child.data);
			break;
	}
}

/**
 * @param {JSX.Element} element
 * @returns
 */
function parseIntrinsicElement(element) {
	switch (element.type) {
		case "container": {
			const { isMessage, isInteraction, ...container } = element.props;

			container.embeds = [];
			container.components = [];

			const btnActionRow = { type: 1, components: [] };
			const selectMenuActionRow = { type: 1, components: [] };

			for (const child of element.children) {
				const evaluated = parseElement(child);

				switch (true) {
					case evaluated.$symbol == Symbol.for("embed"): {
						container.embeds.push(evaluated);

						break;
					}
					case evaluated.type == 2: {
						btnActionRow.components.push(evaluated);

						break;
					}
					case evaluated.type == 3:
					case evaluated.type >= 5 && evaluated.type <= 8: {
						selectMenuActionRow.components.push(evaluated);

						break;
					}
					default:
						throw new Error(`Cannot use element "${child.type}" in opts`);
				}
			}

			if (btnActionRow.components.length > 0) {
				container.components.push(btnActionRow);
			}

			if (selectMenuActionRow.components.length > 0) {
				container.components.push(selectMenuActionRow);
			}

			return container;
		}
		case "embed": {
			const embed = element.props;
			embed.$symbol = Symbol.for("embed");

			for (const child of element.children) {
				switch (child.type) {
					case "title":
						embed.title = child.children.join('');
						break;
					case "description":
						embed.description = child.children.join('');
						break;
					case "author":
						embed.author = {
							name: child.children.join(''),
							url: child.props.url,
							iconURL: child.props.iconURL,
						};
						break;
					case "image":
						embed.image = child.children.join('');
						break;
					case "thumbnail":
						embed.thumbnail = child.children.join('');
						break;
					case "fields":
						embed.fields = child.children.join('');
						break;
					case "footer":
						embed.footer = {
							text: child.children.join(''),
							iconURL: child.props.iconURL,
						};
						break;
				}
			}

			return embed;
		}
		// case "command": {
		// 	const props = element.props;

		// 	const data = new CommandBuilder()
		// 		.setName(props.name)
		// 		.setDescription(props.description ?? " ")
		// 		.setNSFW(props.nsfw ?? false);

		// 	if (props.localizations) {
		// 		data.setNameLocalizations(props.localizations.name);
		// 		data.setDescriptionLocalizations(props.localizations.description);
		// 	}

		// 	for (const child of props.children) {
		// 		if (typeof child == "function") {
		// 			data.setExecution(child);

		// 			continue;
		// 		}

		// 		const parsed = parseElement(child);

		// 		switch (child.type) {
		// 			case "subcommand": {
		// 				data.addSubcommand(parsed);
		// 				break;
		// 			}
		// 			case "group": {
		// 				data.addSubcommandGroup(parsed);
		// 				break;
		// 			}
		// 			default: {
		// 				parseCommandOptions(child.type, data, child);
		// 			}
		// 		}
		// 	}

		// 	return data;
		// }
		// case "subcommand": {
		// 	const props = element.props;

		// 	const data = new SubCommandBuilder()
		// 		.setName(props.name)
		// 		.setDescription(props.description ?? " ");

		// 	if (props.localizations) {
		// 		data.setNameLocalizations(props.localizations.name);
		// 		data.setDescriptionLocalizations(props.localizations.description);
		// 	}

		// 	for (const child of props.children) {
		// 		if (typeof child == "function") {
		// 			data.setExecution(child);
		// 		} else {
		// 			parseCommandOptions(child.type, data, child);
		// 		}
		// 	}

		// 	return data;
		// }
		// case "group": {
		// 	const props = element.props;

		// 	const data = new SubCommandGroupBuilder()
		// 		.setName(props.name)
		// 		.setDescription(props.description ?? " ");

		// 	if (props.localizations) {
		// 		data.setNameLocalizations(props.localizations.name);
		// 		data.setDescriptionLocalizations(props.localizations.description);
		// 	}

		// 	for (const child of props.children) {
		// 		data.addSubcommand(parseElement(child));
		// 	}

		// 	return data;
		// }
		case "button": {
			const { 
				isPrimary, isSecondary, isDanger, isSuccess, isLink, isPremium,
				onClick, id, ...button 
			} = element.props;
			
			id && (button.custom_id = id);

			switch (true) {
				case isPrimary:
					button.style = 1;
					break;
				case isSecondary:
					button.style = 2;
					break;
				case isSuccess:
					button.style = 3;
					break;
				case isDanger:
					button.style = 4;
					break;
				case isLink:
					button.style = 5;
					break;
				case isPremium:
					button.style = 6;
					break;
				default: throw new Error('Button style not found');
			}

			if (button.style != 5) {
				listeners.set(id, onClick);
			}

			return button;
		}
		case "selectmenu": {
			const { 
				isUser, isChannel, isRole, isMentionable, isString,
				defaultUsers, defaultChannels, defaultRoles, defaultMentionables,
				channelTypes, onSelect, max, min, id, ...selectmenu
			} = element.props;
			const defaultValues = defaultUsers ?? defaultChannels ?? defaultRoles ?? defaultMentionables;

			id && (selectmenu.custom_id = id);
			max && (selectmenu.max_values = max);
			min && (selectmenu.min_values = min);
			defaultValues && (selectmenu.default_values = defaultValues);
			channelTypes && (selectmenu.channel_types = channelTypes);

			listeners.set(id, onSelect);

			switch (true) {
				case isString:
					selectmenu.type = 3; 
					selectmenu.options = [];
					break;

				case isUser:
					selectmenu.type = 5; 
					break;

				case isRole:
					selectmenu.type = 6; 
					break;

				case isMentionable:
					selectmenu.type = 7; 
					break;

				case isChannel:
					selectmenu.type = 8; 
					break;

				default:
					throw new Error("Select Menu variant invalid");
			}

			for (const child of element.children) {
				if (child.type != "option") {
					throw new Error(`Cannot use ${child.type} inside a selectmenu`);
				} 

				const option = child.props;

				selectmenu.options.push(option);
			}

			return selectmenu;
		}
		case "textinput": {
			const { isParagraph, isShort, max, min, id, ...textinput } = element.props;

			id && (textinput.custom_id = id);
			max && (textinput.max_length = max);
			min && (textinput.min_length = min);

			switch (true) {
				case isShort:
					textinput.style = 1;
					break;
				case isParagraph:
					textinput.style = 2;
					break;
				default: throw new Error('TextInput style not found');
			}

			return textinput;
		}
		case "modal": {
			const { id, ...modal } = element.props;

			modal.components = [];

			const textRow = { type: 1, components: [] };

			for(const child of element.children) {
				const evaluated = parseElement(child);

				textRow.components.push(evaluated);
			}

			if (textRow.components.length > 0) {
				modal.components.push(textRow);
			}

			return modal;
		}
		default:
			throw new Error("Unknown element on render");
	}
}

function parseComponent(element) {
	const component = element.type;
	Object.assign(component, { props: element.props });

	return component;
}

export function parseElement(element) {
	if (typeof element.type === "function") {
		return parseComponent(element);
	}

	if (typeof element.type == "string") {
		return parseIntrinsicElement(element);
	}

	throw new Error("Unknown element on render");
}
