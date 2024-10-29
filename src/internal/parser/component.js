import { concatenateTextElements } from "../../lib/utils";
import Component from "../../lib/component";
import { collectorState } from "../collector";

function parseDiscordComponentElement(element) {
	switch (element.type) {
		case "button": {
			const {
				isPrimary, isSecondary, isDanger, isSuccess, isLink, isPremium,
				onClick, id, ...button
			} = element.props;

			if (id) {
				if (typeof id == 'number') button.custom_id = id.toString();
				else button.custom_id = id;
			}
			else button.custom_id = Component.generateId('button');

			button.$type = element.type; 
			button.type = 2;
			if(!button.label && element.children) button.label = concatenateTextElements(element.children); 

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
				collectorState.listeners.set(button.custom_id, onClick);
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

			if (id) {
				if (typeof id == 'number') selectmenu.custom_id = id.toString();
				else selectmenu.custom_id = id;
			}
			else selectmenu.custom_id = Component.generateId('selectmenu');

			if(max) selectmenu.max_values = max;
			if(min) selectmenu.min_values = min;
			if(defaultValues) selectmenu.default_values = defaultValues;
			if(channelTypes) selectmenu.channel_types = channelTypes;
			selectmenu.$type = element.type; 

			collectorState.listeners.set(selectmenu.custom_id, onSelect);

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
			return {
				...element.props,
				label: text ? concatenateTextElements(element.children) : element.props.label
			};
		}

		case "textinput": {
			const { isParagraph, isShort, max, min, id, ...textinput } = element.props;

			if (id) {
				if (typeof id == 'number') textinput.custom_id = id.toString();
				else textinput.custom_id = id;
			}
			else textinput.custom_id = Component.generateId('textinput');

			if(!textinput.label && element.children) textinput.label = concatenateTextElements(element.children); 
			if(max) textinput.max_length = max;
			if(min) textinput.min_length = min;
			textinput.$type = element.type;

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

			if (id) {
				if (typeof id == 'number') textinput.custom_id = id.toString();
				else textinput.custom_id = id;
			}
			
			modal.components = [];
			modal.$type = element.type; 

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