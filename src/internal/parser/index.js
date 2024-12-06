import parseSlashCommandElement from "./slashcommand.js";
import parseDiscordComponentElement from "./component.js";
import parseCanvaElement from "./canva.js";
import parseEmbedElement from "./embed.js"; 
import Component from "../../lib/component.js";

// TODO: fazer as polls

function parseIntrinsicElement(element) {
	switch (element.type) {
		case "embed":
		case "title":
		case "description":
		case "thumbnail":
		case "fields":
		case "author":
		case "footer":
		case "image":
			return parseEmbedElement(element);

		case "command":
		case "subcommand":
		case "group":
		case "string":
		case "boolean":
		case "channel":
		case "user":
		case "role":
		case "mentionable":
		case "attachment":
		case "number":
		case "integer":
			return parseSlashCommandElement(element);

		case "button":
		case "selectmenu":
		case "option":
		case "textinput":
		case "modal":
			return parseDiscordComponentElement(element);

		case 'canvas':
		case 'rectangle':
		case 'circle':
		case 'line':
		case 'img':
		case 'path':
		case 'gradient':
		case 'text':
			return parseCanvaElement(element);

		case 'message':
		case 'interaction':
		case "container": {
			const container = element.props;

			container.$type = element.type, 
			container.embeds = [];
			container.components = [];
			container.files = [];

			const btnActionRow = { type: 1, components: [] };
			const selectMenuActionRow = { type: 1, components: [] };

			for (const child of element.children) {
				switch (child.$type) {
					case 'embed': {
						container.embeds.push(child);

						break;
					}
					case 'button': {
						btnActionRow.components.push(child);

						break;
					}
					case 'selectmenu': {
						selectMenuActionRow.components.push(child);

						break;
					}
					case 'canva': {
						container.files.push({ attachment: child });

						break;
					}
					case 'TEXT_ELEMENT': {
						container.content += child.props.value;
						
						break;
					}
					default:
						throw new Error(`Cannot use element "${child.$type}" in opts`);
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

		default:
			throw new Error("Unknown element on render " + element.type);
	}
}

function parseComponent(element) {
	return element.type(element.props);
}

export function parseElement(element) {
	switch(typeof element.type) {
		case 'function':
			return parseComponent(element);

		case 'string':
			return parseIntrinsicElement(element);
			
		default:
			throw new Error("Unknown element on render " + element.type);
	}
}