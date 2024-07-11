import { InteractionReplyOptions, MessageCreateOptions, EmbedBuilder } from "discord.js";
import { Opts, Command, SubCommand, SubCommandGroup, Embed } from "./entities";
import { CommandBuilder, SubCommandBuilder, SubCommandGroupBuilder } from "../utils";
import { Component } from "../components/entity";

function parseCommandOptions(type: string, data: CommandBuilder | SubCommandBuilder, child: any) {
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

function parseIntrinsicElement(element: JSX.Element) {
	switch (element.type) {
		case 'opts': {
			const props = element.props as Opts;
			const children = element.children as JSX.Element[];

			const obj: InteractionReplyOptions | MessageCreateOptions = {};
			
			for(const p of Object.keys(props)) {
				if(p == 'isMessage' || p == 'isInteraction') continue;

				props[p] = obj[p];
			}

			for (const child of children) {
				const evaluated = parseElement(child);

				switch (true) {
					case evaluated instanceof EmbedBuilder: {
						if('embeds' in obj && Array.isArray(obj.embeds)) {
							obj.embeds.push(evaluated);
						} 
						else {
							Object.assign(obj, { embeds: [evaluated] });
						}
						
						break;
					}
					default: throw new Error(`Cannot use element "${child.type}" in opts`)
				}
			}

			return obj;
		}
		case 'embed': {
			const props = element.props as Embed;
			const children = element.children ?? [] as Embed['children'];

			const embed = new EmbedBuilder();

			if (props.color) embed.setColor(props.color);
			if (props.timestamp) embed.setTimestamp(props.timestamp);

			for (const child of children) {
				switch (child.type) {
					case 'title': embed.setTitle(child.children.join('')); break;
					case 'description': embed.setDescription(child.children.join('')); break;
					case 'author': embed.setAuthor({ 
						name: child.children.join(''),
						url: child.props.url,
						iconURL: child.props.iconURL
					}); break;
					case 'image': embed.setImage(child.children.join('')); break;
					case 'thumbnail': embed.setThumbnail(child.children.join('')); break;
					case 'fields': embed.setFields(child.children); break;
					case 'footer': embed.setFooter({
						text: child.children.join(''),
						iconURL: child.props.iconURL
					}); break;
				}
			}

			return embed;
		}
		case 'command': {
			const props = element.props as Command;
			const children = element.children ?? [] as Command['children'];

			const data = new CommandBuilder()
				.setName(props.name)
				.setDescription(props.description ?? ' ')
				.setNSFW(props.nsfw ?? false);

			if (props.localizations) {
				data.setNameLocalizations(props.localizations.name);
				data.setDescriptionLocalizations(props.localizations.description);
			}

			for (const child of children) {
				if(typeof child == 'function') {
					data.setExecution(child);

					continue;
				}

				const evaluated = parseElement(child);

				switch (child.type) {
					case "subcommand": {
						data.addSubcommand(
							(evaluated as SubCommandBuilder)
						);
						break;
					}
					case "group": {
						data.addSubcommandGroup(
							(evaluated as SubCommandGroupBuilder)
						);
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
			const props = element.props as SubCommand;
			const children = element.children as SubCommand['children'] ?? [];

			const data = new SubCommandBuilder()
				.setName(props.name)
				.setDescription(props.description ?? ' ');

			if(props.localizations) {
				data.setNameLocalizations(props.localizations.name);
				data.setDescriptionLocalizations(props.localizations.description);
			}

			for(const child of children) {
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
			const props = element.props as SubCommandGroup;
			const children = element.children ?? [] as SubCommandGroup['children'];

			const data = new SubCommandGroupBuilder()
				.setName(props.name)
				.setDescription(props.description ?? ' ');

			if(props.localizations) {
				data.setNameLocalizations(props.localizations.name);
				data.setDescriptionLocalizations(props.localizations.description);
			}

			for(const child of children) {
				data.addSubcommand(
					(parseElement(child) as SubCommandBuilder)
				);
			}

			return data;
		}
		default: throw new Error('Unknown element on render');
	}
}

function parseComponent(element: { type: typeof Component | Fn, props: object }) {
	if (element.type.prototype?.render) {
		const type = element.type as typeof Component;
		return new type(element.props);
	} 
	else {
		const type = element.type as Fn;
		const instance = new Component(element.props);
		instance.render = type;
		
		return instance;
	}
}


type IsComponent = { type: Fn | typeof Component, props }

export function parseElement(element: JSX.Element | IsComponent) {
	if (typeof element.type === 'function') {
		return parseComponent(element as IsComponent);
	}

	if (typeof element.type == 'string') {
		return parseIntrinsicElement(element as JSX.Element);
	}

	throw new Error('Unknown element on render');
}