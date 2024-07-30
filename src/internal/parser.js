import { generateCustomId } from "../lib/utils";
import { listeners } from "./collector";

// TODO: fazer as polls

function parseIntrinsicElement(element) {
	switch (element.type) {
		case "container": {
			const { isMessage, isInteraction, ...container } = element.props;

			container.embeds = [];
			container.components = [];

			const btnActionRow = { type: 1, components: [] };
			const selectMenuActionRow = { type: 1, components: [] };

			for (const child of element.children) {
				switch (true) {
					case child.$symbol == Symbol.for("embed"): {
						container.embeds.push(child);

						break;
					}
					case child.type == 2: {
						btnActionRow.components.push(child);

						break;
					}
					case child.type == 3:
					case child.type >= 5 && child.type <= 8: {
						selectMenuActionRow.components.push(child);

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

		case "title":
		case "description":
		case "image":
		case "thumbnail":
		case "fields": return { prop: element.type, value: element.children.join('') }
		case "author": return { prop: element.type, value: { name: element.children.join(''), url: element.props.url, iconURL: element.props.iconURL }}
		case "footer": return { prop: element.type, value: { text: element.children.join(''), iconURL: element.props.iconURL }}
		case "embed": {
			const embed = element.props;
			embed.$symbol = Symbol.for("embed");

			for (const child of element.children) {
				embed[child.prop] = child.value;
			}

			return embed;
		}

		case "string":
		case "boolean":
		case "channel":
		case "user":
		case "role":
		case "mentionable":
		case "attachment": {
			const { optional, max, min, ...option } = element.props;

			option.required = optional ? !optional : true;
			max && (option.max_length = max);
			min && (option.min_length = min);

			return option;
		}

		case "number":
		case "integer": {
			const { optional, max, min, ...option } = element.props;

			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}
		
		case "command": {
			const { localizations, ...command } = element.props;
			if (!command.description) command.description = " ";
			command.options = [];

			if (localizations) {
				command.name_localizations = localizations.name;
				command.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				if (typeof child == "function") {
					command.run = child;

					continue;
				}

				command.options.push(child);
			}

			return command;
		}
		case "subcommand": {
			const { localizations, ...subcommand } = element.props;
			if (!subcommand.description) subcommand.description = " ";
			subcommand.options = [];

			if (localizations) {
				subcommand.name_localizations = localizations.name;
				subcommand.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				if (typeof child == "function") {
					subcommand.run = child;

					continue;
				}

				subcommand.options.push(child);
			}

			return subcommand;
		}
		case "group": {
			const group = element.props;
			if (!group.description) subcommand.description = " ";
			group.options = [];

			if (group.localizations) {
				group.name_localizations = group.localizations.name;
				group.description_localizations = group.localizations.description;
			}

			for (const child of element.children) {
				group.options.push(child);
			}

			return group;
		}
		case "button": {
			const {
				isPrimary, isSecondary, isDanger, isSuccess, isLink, isPremium,
				onClick, id, ...button
			} = element.props;

			button.custom_id = id ? id : generateCustomId('button');
			button.type = 2;

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
				listeners.set(button.custom_id, onClick);
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

			selectmenu.custom_id = id ? id : generateCustomId('selectmenu');
			max && (selectmenu.max_values = max);
			min && (selectmenu.min_values = min);
			defaultValues && (selectmenu.default_values = defaultValues);
			channelTypes && (selectmenu.channel_types = channelTypes);

			listeners.set(selectmenu.custom_id, onSelect);

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
		case "option": {
			return element;
		}
		case "textinput": {
			const { isParagraph, isShort, max, min, id, ...textinput } = element.props;

			textinput.custom_id = id ? id : generateCustomId('textinput');
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

			modal.custom_id = id ? id : generateCustomId('modal');
			modal.components = [];

			const textRow = { type: 1, components: [] };

			for (const child of element.children) {
				textRow.components.push(child);
			}

			if (textRow.components.length > 0) {
				modal.components.push(textRow);
			}

			return modal;
		}
		default:
			throw new Error("Unknown element on render " + element.type);
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

	throw new Error("Unknown element on render " + element.type);
}
