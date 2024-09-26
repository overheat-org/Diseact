import { generateCustomId } from "../../lib/utils";

function parseDiscordComponentElement(element) {
    switch (element.type) {
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
				selectmenu.options.push(child);
			}

			return selectmenu;
		}
		case "option": {
			return { ...element.props, label: element.children.toString() ?? element.props.label };
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
    }
}

export default parseDiscordComponentElement;