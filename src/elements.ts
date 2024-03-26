import { APISelectMenuDefaultValue, ButtonStyle, ChannelType, ColorResolvable, SelectMenuDefaultValueType, TextInputStyle } from "discord.js";
import { Localization } from "./builders/command";
import { SelectMenuVariant } from "./builders/component";

export enum ElementType {
	Command,
	SubCommand,
	Group,
	Modal,
	TextInput,
	Button,
	SelectMenu,
	Option,
	Row,
	Embed,
	Title,
	Description,
	Author,
	Image,
	Thumbnail,
	Footer,
	Fields,
	Field
}

interface CommandBased {
	name: string;
	description?: string;
	localization?: Localization
}

export interface Command extends CommandBased {
	nsfw?: boolean;
}

export interface SubCommand extends CommandBased { }

export interface SubCommandGroup extends CommandBased { }


interface ComponentBased {
	id: string
}

export interface Modal extends ComponentBased {
	title: string
}

export interface TextInput extends ComponentBased {
	label?: string
	style: TextInputStyle
	placeholder?: string
	minLength?: number
	maxLength?: number
	value?: string
	required?: boolean
}

interface BaseButton {
	disabled?: boolean
	emoji?: string
	label?: string
}

interface LinkButton extends BaseButton {
	variant: ButtonStyle.Link
	url: string
}

interface OtherButton extends ComponentBased, BaseButton {
	variant: ButtonStyle.Success | ButtonStyle.Danger | ButtonStyle.Primary | ButtonStyle.Secondary
}

export type Button = OtherButton | LinkButton

interface BaseSelectMenu extends ComponentBased {
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
	channelTypes: ChannelType[]
}

export interface RoleSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.Role,
	defaultRoles: string[]
}

export interface MentionableSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.Mentionable,
	defaultValues: (APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role> | APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>)[]
}

export interface StringSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.String,
	default?: string
}

export type SelectMenu =
	| UserSelectMenu
	| ChannelSelectMenu
	| RoleSelectMenu
	| MentionableSelectMenu
	| StringSelectMenu;

export interface Option {
	value: string
	description?: string
	label?: string
	emoji?: string
	default?: boolean
}

export interface Row {
}


export interface Embed {
	color?: ColorResolvable
	timestamp?: Date | number
}

export interface Title {}

export interface Description {}

export interface Author {
	url?: string
	iconURL?: string
}

export interface Image {}

export interface Thumbnail {}

export interface Footer {
	iconURL?: string
}

export interface Field {
	name: string
	inline?: boolean
}

export interface Fields {
}
