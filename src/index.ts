import DJS from 'discord.js';
import './jsx';

namespace Diseact {
	export enum SelectMenuVariant {
		User,
		Channel,
		Role,
		Mentionable,
		String
	}
	
	interface BaseSelectMenu {
		id: string
		placeholder: string
		disabled?: boolean
		min?: number
		max?: number
	}
	export interface UserSelectMenu extends BaseSelectMenu {
		variant: SelectMenuVariant.User, 
		defaultUsers: string[] 
	}
	export interface ChannelSelectMenu extends BaseSelectMenu { 
		variant: SelectMenuVariant.Channel,
		defaultChannel: string[], 
		channelTypes: DJS.ChannelType[]
	}
	export interface RoleSelectMenu extends BaseSelectMenu { 
		variant: SelectMenuVariant.Role, 
		defaultRoles: string[] 
	}
	export interface MentionableSelectMenu extends BaseSelectMenu { 
		variant: SelectMenuVariant.Mentionable,
		defaultValues: (DJS.APISelectMenuDefaultValue<DJS.SelectMenuDefaultValueType.Role> | DJS.APISelectMenuDefaultValue<DJS.SelectMenuDefaultValueType.User>)[] 
	}
	export interface StringSelectMenu extends BaseSelectMenu{ 
		variant: SelectMenuVariant.String,
		default?: string 
	}
	export type UnionSelectMenu =
		| UserSelectMenu
		| ChannelSelectMenu
		| RoleSelectMenu
		| MentionableSelectMenu
		| StringSelectMenu

	
	export function createElement<E extends keyof JSX.IntrinsicElements>(type: E, props: JSX.IntrinsicElements[E], ...children: any[]) {
		const acceptedElements = {
			/* Component */
			row: ActionRowElement,
			button: ButtonElement,
			selectmenu: SelectMenuElement,
			option: OptionElement,

			/* Modal */
			modal: ModalElement,
			textinput: TextInputElement,

			/* Embed */
			embed: EmbedElement,
			title: TitleElement,
			description: DescriptionElement,
			author: AuthorElement,
			image: ImageElement,
			thumbnail: ThumbnailElement,
			footer: FooterElement,
			field: FieldElement,
			fields: FieldsElement
		};
		
		return acceptedElements[type](props as any, children);
	}
	
	function ActionRowElement(props, children) {
		const components = new Array<DJS.AnyComponentBuilder>();

		for(const child of children) {
			components.push(child)
		}

		return new DJS.ActionRowBuilder().setComponents(components);
	}

	function ButtonElement(props, children) {
		const btn = new DJS.ButtonBuilder()
			.setCustomId(props.id)
			.setDisabled(props.disabled ?? false)
			.setLabel(props.label ?? children.toString())
			.setStyle(props.variant);

		if(props.emoji) {
			btn.setEmoji(props.emoji);
		}

		return btn;
	}

	function SelectMenuElement(props: JSX.IntrinsicElements['selectmenu'], children: ReturnType<typeof OptionElement>[]) {
		const selectMenu = {
			[SelectMenuVariant.User]: () => new DJS.UserSelectMenuBuilder()
				.setDefaultUsers((props as UserSelectMenu).defaultUsers),

			[SelectMenuVariant.Channel]: () => new DJS.ChannelSelectMenuBuilder()
				.setChannelTypes((props as ChannelSelectMenu).channelTypes)
				.setDefaultChannels((props as ChannelSelectMenu).defaultChannel),

			[SelectMenuVariant.Role]: () => new DJS.RoleSelectMenuBuilder()
				.setDefaultRoles((props as RoleSelectMenu).defaultRoles),

			[SelectMenuVariant.Mentionable]: () => new DJS.MentionableSelectMenuBuilder()
				.setDefaultValues((props as MentionableSelectMenu).defaultValues),
				
			[SelectMenuVariant.String]: () => new DJS.StringSelectMenuBuilder()
				.setOptions(children)
		}[props.variant]();

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

		return selectMenu;
	}

	function OptionElement(props: JSX.IntrinsicElements['option'], children) {
		return new DJS.StringSelectMenuOptionBuilder({ ...props, label: props.label ?? children.toString() });
	}

	function ModalElement(props: JSX.IntrinsicElements['modal'], children: ReturnType<typeof ActionRowElement>[]) {
		const modal = new DJS.ModalBuilder({ ...props })

		for(const child of children) {
			modal.addComponents(child as DJS.ActionRowBuilder<DJS.TextInputBuilder>)
		}

		return modal;
	}

	function TextInputElement(props: JSX.IntrinsicElements['textinput'], children) {
		return new DJS.TextInputBuilder({ ...props, label: props.label ?? children.toString() });
	}

	function EmbedElement(props: JSX.IntrinsicElements['embed'], children) {
		const embed = new DJS.EmbedBuilder();

		const acceptedTypes = {
			title: child => embed.setTitle(child.c),
			description: child => embed.setDescription(child.c),
			author: child => embed.setAuthor({ name: child.c, iconURL: child.p.iconURL, url: child.p.url }),
			image: child => embed.setImage(child.c),
			thumbnail: child => embed.setThumbnail(child.c),
			fields: child => embed.setFields(child.c),
			footer: child => embed.setFooter({ text: child.c, iconURL: child.p.iconURL })
		} satisfies { [key: string]: (child: { c: any, p: any }) => any }

		for(const child of children) {
			const selectedType = child!.e as keyof typeof acceptedTypes;
			acceptedTypes[selectedType](child);
		}

		if(props && 'color' in props) embed.setColor(props.color!);
		if(props && 'timestamp' in props) embed.setTimestamp(props.timestamp);

		return embed;
	}

	function TitleElement(props, children) {
		return { e: "title", c: children.toString() }
	}

	function DescriptionElement(props, children) {
		return { e: "description", c: children.toString() }
	}

	function AuthorElement(props, children) {
		return { e: "author", c: children.toString(), p: props }
	}

	function ImageElement(props, children) {
		return { e: "image", c: children.toString() }
	}

	function ThumbnailElement(props, children) {
		return { e: "thumbnail", c: children.toString() }
	}

	function FieldsElement(props, children) {
		const fields = new Array(); 
		
		for(const child of children) {
			fields.push(child.c);
		}

		return { e: "fields", c: fields };
	}

	function FieldElement(props, children) {
		return { e: "field", c: { name: props.name, value: children.toString(), inline: props.inline } }
	}

	function FooterElement(props, children) {
		return { e: "footer", c: children.toString(), p: props }
	}
}

export default Diseact;
export const SelectMenuVariant = Diseact.SelectMenuVariant;
export type UnionSelectMenu = Diseact.UnionSelectMenu;