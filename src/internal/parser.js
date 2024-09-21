import { createCanvas } from "canvas";
import { generateCustomId } from "../lib/utils";
import { listeners } from "./collector";
import { commandMap } from "./executor";

// TODO: fazer as polls

function parseIntrinsicElement(element) {
	switch (element.type) {
		case "container": {
			const { isMessage, isInteraction, ...container } = element.props;

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


		/* Embed Parsing */
		case "title":
		case "description":
		case "thumbnail":
		case "fields": return { prop: element.type, value: element.children.join('') }
		case "author": return { prop: element.type, value: { name: element.children.join(''), url: element.props.url, iconURL: element.props.iconURL } }
		case "footer": return { prop: element.type, value: { text: element.children.join(''), iconURL: element.props.iconURL } }
		case "embed": {
			const embed = element.props;
			embed.$symbol = Symbol.for("embed");
			
			for (const child of element.children) {
				embed[child.prop] = child.value;
			}
			
			return embed;
		}
		case "image": {
			const value = typeof element.children == 'object'
				? element
				: element.children.toString();

			return { prop: element.type, value }
		}


		/* Slash Command Parsing */
		case "string": {
			const { optional, max, min, ...option } = element.props;

			option.type = 3;
			option.required = optional ? !optional : true;
			max && (option.max_length = max);
			min && (option.min_length = min);

			return option;
		}
		case "boolean": {
			const { optional, ...option } = element.props;

			option.type = 5;
			option.required = optional ? !optional : true;

			return option;
		}
		case "channel": {
			const { optional, ...option } = element.props;

			option.type = 7;
			option.required = optional ? !optional : true;

			return option;
		}
		case "user": {
			const { optional, ...option } = element.props;

			option.type = 6;
			option.required = optional ? !optional : true;

			return option;
		}
		case "role": {
			const { optional, ...option } = element.props;

			option.type = 8;
			option.required = optional ? !optional : true;

			return option;
		}
		case "mentionable": {
			const { optional, ...option } = element.props;

			option.type = 9;
			option.required = optional ? !optional : true;

			return option;
		}
		case "attachment": {
			const { optional, ...option } = element.props;

			option.type = 11;
			option.required = optional ? !optional : true;

			return option;
		}
		case "number": {
			const { optional, max, min, ...option } = element.props;

			option.type = 10;
			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}
		case "integer": {
			const { optional, max, min, ...option } = element.props;

			option.type = 4;
			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}

		case "command": {
			const { localizations, ...command } = element.props;
			if (!command.description) command.description = " ";
			command.options = [];
			command.type = 1;

			if (localizations) {
				command.name_localizations = localizations.name;
				command.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				if (typeof child == "function") {
					command.run = child;

					continue;
				}

				switch (child.type) {
					case 1: {
						const { run, ...subcommand } = child;

						commandMap.set(command.name + subcommand.name, run);
						command.options.push(subcommand);
					}
					case 2: {
						const { _run_map, ...group } = child;

						for (const option of group.options) {
							const run = _run_map[option.name];

							run && commandMap.set(command.name + group.name + option.name, run);
						}
						for (const run of Object.keys(_run_map)) {

						}

						command.options.push(group);
					}
				}

			}

			return command;
		}
		case "subcommand": {
			const { localizations, ...subcommand } = element.props;
			if (!subcommand.description) subcommand.description = " ";
			subcommand.options = [];
			command.type = 1;

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
			command.type = 2;

			if (group.localizations) {
				group.name_localizations = group.localizations.name;
				group.description_localizations = group.localizations.description;
			}

			for (const child of element.children) {
				const { run, ...subcommand } = child;

				group.options.push(subcommand);
				(group._run_map ??= {})[subcommand.name] = run;
			}

			return group;
		}


		/* Discord Component Parsing */
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


		/* Canvas Parsing */
		case 'canvas': {
			const { height, width, context, font, alpha, angle, pixel } = element.props;

			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext(context, { alpha, pixelFormat: pixel });

			font && (ctx.font = font);
			angle && ctx.rotate(angle);

			for (const child of element.children) {
				switch (child.type) {
					case 0:
						if (child.style) {
							ctx.fillStyle = child.style;
						}

						ctx.fillRect(child.x, child.y, child.width, child.height);

						break;

					case 1:
						if (child.style) {
							ctx.fillStyle = child.style;
						}

						ctx.beginPath();
						ctx.arc(child.x, child.y, child.radius, child.startAngle ?? 0, child.endAngle ?? Math.PI * 2, child.clockwise);
						ctx.fill();

						break;

					case 2:
						if (child.style) {
							ctx.strokeStyle = child.style;
						}

						if(child.width) {
							ctx.lineWidth = child.width;
						}

						ctx.beginPath();
						ctx.moveTo(...child.startPos);
						ctx.lineTo(...child.endPos);
						ctx.stroke();

						break;

					case 3:
						const img = new Image();
						const imgData = typeof child.src == 'string' 
							? fs.readFileSync(child.src)
							: child.src;

						img.onload = () => {
							ctx.drawImage(img, child.x, child.y, child.width, child.height);
						};
						img.src = imgData;

						break;

					case 4: 
						break;

					case 5:
						const gradient = ctx.createLinearGradient(...child.startGradient, ...child.endGradient);

						for(let i = 0; i < child.colors.length; i++) {
							gradient.addColorStop(i, child.colors[i]);
						}

						ctx.fillRect(...child.startPos, ...child.endPos);
						
						break;
						
					case 0:
						const opts = [];
						child.italic && opts.push('italic');
						child.bold && opts.push('bold');
						child.size && opts.push(child.size.toString().concat('px'));
						opts.push(child.font ?? 'sans-serif');

						if (opts.length > 0) ctx.font = opts.join(' ');

						child.style && (ctx.fillStyle = child.style);

						ctx.fillText(child.content, child.x, child.y, child.maxWidth);
						ctx.font = font;

						break;


					default:
						break;
				}
			}

			return canvas.toBuffer()
		}
		case 'rectangle': {
			return {
				type: 0,
				...element.props
			}
		}
		case 'circle': {
			return {
				type: 1,
				...element.props
			}
		}
		case 'line': {
			return {
				type: 2,
				...element.props
			}
		}
		case 'img': {
			return {
				type: 3,
				...element.props
			}
		}
		case 'path': {
			return {
				type: 4,
				content: element.children.toString(),
				...element.props
			}
		}
		case 'gradient': {
			return {
				type: 5,
				...element.props
			}
		}
		case 'text': {
			return {
				type: 0,
				content: element.children.toString(),
				...element.props
			}
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
