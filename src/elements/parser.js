import { InteractionReplyOptions, MessageCreateOptions, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, BaseSelectMenuBuilder, UserSelectMenuBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, MentionableSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { CommandBuilder, SelectMenuVariant, SubCommandBuilder, SubCommandGroupBuilder } from "../utils";
import { listeners } from "../collector";

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
		case 'container': {
			const props = element.props;

			/** @type {InteractionReplyOptions | MessageCreateOptions} */
			const obj = { embeds: [], components: [] };

			for(const p of Object.keys(props)) {
				if(['isMessage', 'isInteraction', 'children'].includes(p)) continue;

				obj[p] = props[p];
			}

			const btnActionRow = new ActionRowBuilder();
			const selectMenuActionRow = new ActionRowBuilder();

			for (const child of props.children) {
				const evaluated = parseElement(child);

				switch (true) {
					case evaluated instanceof EmbedBuilder: {
						obj.embeds.push(evaluated);

						break;
					}
					case evaluated instanceof ButtonBuilder: {
						btnActionRow.addComponents(evaluated);

						if(evaluated.data.style != ButtonStyle.Link) {
							const data = evaluated.data;
							listeners.set(data.custom_id, data.onClick);
						}

						break;
					}
					case evaluated instanceof BaseSelectMenuBuilder: {
						selectMenuActionRow.addComponents(evaluated);

						console.log(evaluated.data.onSelect);

						listeners.set(evaluated.data.custom_id, evaluated.data.onSelect);

						break;
					}
					default: throw new Error(`Cannot use element "${child.type}" in opts`)
				}
			}

			if(btnActionRow.components.length > 0) {
				obj.components.push(btnActionRow);
			}

			if(selectMenuActionRow.components.length > 0) {
				obj.components.push(selectMenuActionRow);
			}

			return obj;
		}
		case 'embed': {
			const props = element.props;

			const embed = new EmbedBuilder();

			if (props.color) embed.setColor(props.color);
			if (props.timestamp) embed.setTimestamp(props.timestamp);

			for (const child of props.children) {
				switch (child.type) {
					case 'title': embed.setTitle(child.props.children[0]); break;
					case 'description': embed.setDescription(child.props.children[0]); break;
					case 'author': embed.setAuthor({ 
						name: child.props.children[0],
						url: child.props.url,
						iconURL: child.props.iconURL
					}); break;
					case 'image': embed.setImage(child.props.children[0]); break;
					case 'thumbnail': embed.setThumbnail(child.props.children[0]); break;
					case 'fields': embed.setFields(child.props.children[0]); break;
					case 'footer': embed.setFooter({
						text: child.props.children[0],
						iconURL: child.props.iconURL
					}); break;
				}
			}

			return embed;
		}
		case 'command': {
			const props = element.props;

			const data = new CommandBuilder()
				.setName(props.name)
				.setDescription(props.description ?? ' ')
				.setNSFW(props.nsfw ?? false);

			if (props.localizations) {
				data.setNameLocalizations(props.localizations.name);
				data.setDescriptionLocalizations(props.localizations.description);
			}

			for (const child of props.children) {
				if(typeof child == 'function') {
					data.setExecution(child);

					continue;
				}

				const parsed = parseElement(child);

				switch (child.type) {
					case "subcommand": {
						data.addSubcommand(parsed);
						break;
					}
					case "group": {
						data.addSubcommandGroup(parsed);
						break;
					}
					default: {
						parseCommandOptions(child.type, data, child);
					}
				}
			}

			return data;
		}
		case 'subcommand': {
			const props = element.props;

			const data = new SubCommandBuilder()
				.setName(props.name)
				.setDescription(props.description ?? ' ');

			if(props.localizations) {
				data.setNameLocalizations(props.localizations.name);
				data.setDescriptionLocalizations(props.localizations.description);
			}

			for(const child of props.children) {
				if(typeof child == 'function') {
					data.setExecution(child);
				} 
				else {
					parseCommandOptions(child.type, data, child);
				}
			}

			return data;
		}
		case 'group': {
			const props = element.props;

			const data = new SubCommandGroupBuilder()
				.setName(props.name)
				.setDescription(props.description ?? ' ');

			if(props.localizations) {
				data.setNameLocalizations(props.localizations.name);
				data.setDescriptionLocalizations(props.localizations.description);
			}

			for(const child of props.children) {
				data.addSubcommand(parseElement(child));
			}

			return data;
		}
		case 'button': {
			const props = element.props;
			const btn = new ButtonBuilder()
				.setLabel(props.label ?? props.children)
				.setStyle(props.variant);
		
			if(props.disabled != undefined) {
				btn.setDisabled(props.disabled);
			}
		
			if(props.emoji) {
				btn.setEmoji(props.emoji);
			}
			
			if(props.variant != ButtonStyle.Link) {
				Object.assign(btn.data, { onClick: props.onClick });
			}
		
			if(props.variant == ButtonStyle.Link) {
				btn.setURL(props.url);
			} else {
				btn.setCustomId(props.id);
			}
		
			return btn;
		}
		case 'selectmenu': {
			const props = element.props;

			const selectMenu = (() => {
				switch (true) {
					case props.isUser: return new UserSelectMenuBuilder()
						.setDefaultUsers(props.defaultUsers)

					case props.isChannel: return new ChannelSelectMenuBuilder()
						.setChannelTypes(props.channelTypes)
						.setDefaultChannels(props.defaultChannel)

					case props.isRole: return new RoleSelectMenuBuilder()
						.setDefaultRoles(props.defaultRoles)

					case props.isMentionable: return new MentionableSelectMenuBuilder()
						.setDefaultValues(props.defaultValues)
						
					case props.isString: return new StringSelectMenuBuilder()

					default: throw new Error('Select Menu variant invalid')
				}
			})();

			for(const child of props.children) {
				if(child.type != 'option') {
					throw new Error(`Cannot use ${child.type} inside a selectmenu`);
				}
				else {
					const props = child.props;
					const data = new StringSelectMenuOptionBuilder({ ...child.props, label: child.props.label ?? child.children })
					
					data.setDescription(props.description ?? props.children[0])
						.setLabel(props.label)
						.setValue(props.value);

					if(props.default) data.setDefault(props.default);
					if(props.emoji) data.setEmoji(props.emoji);

					selectMenu.addOptions(data);
				}
			}

			selectMenu
				.setCustomId(props.id)
				.setDisabled(props.disabled ?? false)
				.setPlaceholder(props.placeholder);

			if(props.max) {
				selectMenu.setMaxValues(props.max);
			}

			if(props.min) {
				selectMenu.setMinValues(props.min);
			}

			
			Object.assign(selectMenu.data, { onSelect: props.onSelect });

			return selectMenu;
		}
		case 'textinput': {
			const props = element.props;

			return new TextInputBuilder({ ...props, label: props.label ?? props.children });
		}
		case 'modal': {
			const modal = new ModalBuilder({ ...props })

			// TODO: MAKE THIS
			// for(const child of children) {
			// 	modal.addComponents(child as ActionRowBuilder<TextInputBuilder>)
			// }

			return modal;
		}
		default: throw new Error('Unknown element on render');
	}
}

function parseComponent(element) {
	const component = element.type;
	Object.assign(component, { props: element.props });

	return component;
}

export function parseElement(element) {
	if (typeof element.type === 'function') {
		return parseComponent(element);
	}

	if (typeof element.type == 'string') {
		return parseIntrinsicElement(element);
	}

	throw new Error('Unknown element on render');
}