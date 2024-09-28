import parseSlashCommandElement from "./slashcommand";
import parseDiscordComponentElement from "./component";
import parseCanvaElement from "./canva";
import parseEmbedElement from "./embed"; 
import Component from "../../lib/component";

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

			container.embeds = [];
			container.components = [];
			container.files = [];

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
					case Buffer.isBuffer(child): {
						container.files.push({ attachment: child });

						break;
					}
					case child.type == 'TEXT_ELEMENT': {
						container.content += child.props.value;
						
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

		default:
			throw new Error("Unknown element on render " + element.type);
	}
}

function parseComponent(element) {
	const component = new Component(element.type);

	component.props = element.props;
	
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
