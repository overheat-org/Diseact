import { AnyComponentBuilder, ActionRowBuilder, ButtonBuilder, UserSelectMenuBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, MentionableSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, ButtonStyle } from "discord.js";
import { Button, ChannelSelectMenu, MentionableSelectMenu, RoleSelectMenu, SelectMenu, UserSelectMenu } from "../elements";

export enum SelectMenuVariant {
	User,
	Channel,
	Role,
	Mentionable,
	String
}

export function ActionRowElement(props, children) {
	const components = new Array<AnyComponentBuilder>();

	for(const child of children) {
		components.push(child)
	}

	return new ActionRowBuilder().setComponents(components);
}

export function ButtonElement(props: Button, children) {
	const btn = new ButtonBuilder()
		.setLabel(props.label ?? children.toString())
		.setStyle(props.variant);

	if(props.disabled != undefined) {
		btn.setDisabled(props.disabled);
	}

	if(props.emoji) {
		btn.setEmoji(props.emoji);
	}

	if(props.variant == ButtonStyle.Link) {
		btn.setURL(props.url)
	} else {
		btn.setCustomId(props.id)
	}

	return btn;
}

export function SelectMenuElement(props: SelectMenu, children: ReturnType<typeof OptionElement>[]) {
	const selectMenu = {
		[SelectMenuVariant.User]: () => new UserSelectMenuBuilder()
			.setDefaultUsers((props as UserSelectMenu).defaultUsers),

		[SelectMenuVariant.Channel]: () => new ChannelSelectMenuBuilder()
			.setChannelTypes((props as ChannelSelectMenu).channelTypes)
			.setDefaultChannels((props as ChannelSelectMenu).defaultChannel),

		[SelectMenuVariant.Role]: () => new RoleSelectMenuBuilder()
			.setDefaultRoles((props as RoleSelectMenu).defaultRoles),

		[SelectMenuVariant.Mentionable]: () => new MentionableSelectMenuBuilder()
			.setDefaultValues((props as MentionableSelectMenu).defaultValues),
			
		[SelectMenuVariant.String]: () => new StringSelectMenuBuilder()
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

export function OptionElement(props: JSX.IntrinsicElements['option'], children) {
	return new StringSelectMenuOptionBuilder({ ...props, label: props.label ?? children.toString() });
}

export function ModalElement(props: JSX.IntrinsicElements['modal'], children: ReturnType<typeof ActionRowElement>[]) {
	const modal = new ModalBuilder({ ...props })

	for(const child of children) {
		modal.addComponents(child as ActionRowBuilder<TextInputBuilder>)
	}

	return modal;
}

export function TextInputElement(props: JSX.IntrinsicElements['textinput'], children) {
	return new TextInputBuilder({ ...props, label: props.label ?? children.toString() });
}

type ComponentElementsMap = { 
	'row': ReturnType<typeof ActionRowElement>
	'button': ReturnType<typeof ButtonElement>
	'selectmenu': ReturnType<typeof SelectMenuElement>
	'option': ReturnType<typeof OptionElement>
	'modal': ReturnType<typeof ModalElement>
	'textinput': ReturnType<typeof TextInputElement>
}
export type ComponentElements<E> = E extends keyof ComponentElementsMap ? ComponentElementsMap[E] : null