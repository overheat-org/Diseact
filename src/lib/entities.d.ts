import type { NodeCanvasRenderingContext2DSettings } from "canvas";
import {
	APISelectMenuDefaultValue,
	AutocompleteInteraction,
	BitFieldResolvable,
	ButtonInteraction,
	ChannelSelectMenuInteraction,
	ChannelType,
	ColorResolvable,
	CommandInteraction,
	LocalizationMap,
	MentionableSelectMenuInteraction,
	MessageFlags,
	MessageFlagsString,
	MessageMentionOptions,
	ModalSubmitInteraction,
	RoleSelectMenuInteraction,
	SelectMenuDefaultValueType,
	StringSelectMenuInteraction,
	TextInputStyle,
	UserSelectMenuInteraction,
} from "discord.js";

export type Localization = {
	name: LocalizationMap;
	description: LocalizationMap;
};

interface CommandBased {
	name: string;
	description?: string;
	localizations?: Localization;
	children?: unknown;
}

type CommandBasedChildren = JSX.Element | ((interaction: CommandInteraction<"cached">) => unknown);

export interface Command extends CommandBased {
	nsfw?: boolean;
	children?: CommandBasedChildren | CommandBasedChildren[];
}

export interface SubCommand extends CommandBased {
	children?: CommandBasedChildren | CommandBasedChildren[];
}

export interface SubCommandGroup extends CommandBased {
	children?: JSX.Element[];
}

export interface OptionBased extends Omit<CommandBased, "children"> {
	optional?: boolean;
}

export interface String extends OptionBased {
	max?: number;
	min?: number;
	autocomplete?: (interaction: AutocompleteInteraction) => unknown;
}

export interface Boolean extends OptionBased { }

export interface Number extends OptionBased {
	max?: number;
	min?: number;
}

export interface Integer extends OptionBased {
	max?: number;
	min?: number;
}

export interface Channel extends OptionBased { }
export interface User extends OptionBased { }
export interface Role extends OptionBased { }
export interface Mentionable extends OptionBased { }
export interface Attachment extends OptionBased { }

interface ComponentBased {
	/**
	 * A Custom Id to track this component. If isn't passed, id will be autogenerated
	 */
	id?: string;
}

export interface Modal extends ComponentBased {
	title: string;
	onSubmit?: (interaction: ModalSubmitInteraction) => unknown;
}

export interface TextInput extends ComponentBased {
	children?: string;
	label?: string;
	style: TextInputStyle;
	placeholder?: string;
	min?: number;
	max?: number;
	value?: string;
	required?: boolean;
}

interface ButtonBased {
	children?: string;
	disabled?: boolean;
	emoji?: string;
	label?: string;
}

interface LinkButton extends ButtonBased {
	isLink: true;
	url: string;
}

interface PrimaryButton extends ButtonBased, ComponentBased {
	isPrimary: true;
	onClick?(interaction: ButtonInteraction): unknown
}

interface SecondaryButton extends ButtonBased, ComponentBased {
	isSecondary: true;
	onClick?(interaction: ButtonInteraction): unknown
}

interface SuccessButton extends ButtonBased, ComponentBased {
	isSuccess: true;
	onClick?(interaction: ButtonInteraction): unknown
}

interface DangerButton extends ButtonBased, ComponentBased {
	isDanger: true;
	onClick?(interaction: ButtonInteraction): unknown
}

interface PremiumButton extends ButtonBased, ComponentBased {
	isPremium: true;
	onClick?(interaction: ButtonInteraction): unknown
}

export type Button = 
	| LinkButton
	| PrimaryButton
	| SecondaryButton
	| SuccessButton
	| DangerButton
	| PremiumButton;

interface BaseSelectMenu extends ComponentBased {
	placeholder: string;
	disabled?: boolean;
	min?: number;
	max?: number;
}

export interface UserSelectMenu extends BaseSelectMenu {
	isUser: true
	defaultUsers: string[];
	onSelect?(interaction: UserSelectMenuInteraction): unknown
}

export interface ChannelSelectMenu extends BaseSelectMenu {
	isChannel: true
	defaultChannels: string[]
	channelTypes: ChannelType[]
	onSelect?(interaction: ChannelSelectMenuInteraction): unknown
}

export interface RoleSelectMenu extends BaseSelectMenu {
	isRole: true
	defaultRoles: string[]
	onSelect?(interaction: RoleSelectMenuInteraction): unknown
}

export interface MentionableSelectMenu extends BaseSelectMenu {
	isMentionable: true
	defaultMentionables: (
		| APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>
		| APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>
	)[];
	onSelect?(interaction: MentionableSelectMenuInteraction): unknown
}

export interface StringSelectMenu extends BaseSelectMenu {
	isString: true
	default?: string
	onSelect?(interaction: StringSelectMenuInteraction): unknown
}

export type SelectMenu =
	| UserSelectMenu
	| ChannelSelectMenu
	| RoleSelectMenu
	| MentionableSelectMenu
	| StringSelectMenu;

export interface Option {
	value: string;
	description?: string;
	label?: string;
	emoji?: string;
	default?: boolean;
}

export interface Embed {
	color?: ColorResolvable;
	timestamp?: Date | number;
	children?: JSX.Element[];
}

export interface Title { }

export interface Description { }

export interface Author {
	name?: string
	url?: string;
	iconURL?: string;
}

export interface Image { }

export interface Thumbnail { }

export interface Footer {
	iconURL?: string;
}

export interface Field {
	name: string;
	inline?: boolean;
}

export interface Fields { }

export interface OptsBase {
	flags?: BitFieldResolvable<
	  Extract<MessageFlagsString, 'Ephemeral' | 'SuppressEmbeds' | 'SuppressNotifications'>,
	  MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds | MessageFlags.SuppressNotifications
	>;
	tts?: boolean;
	content?: string;
	allowedMentions?: MessageMentionOptions;
	children?: JSX.Node
}

export interface Message extends OptsBase {
	isMessage: true;
	nonce?: string | number;
	enforceNonce?: boolean;
}

export interface Interaction extends OptsBase {
	isInteraction: true;
	ephemeral?: boolean;
	fetchReply?: boolean;
}

export type Container = Message | Interaction;

export interface Canvas {
	width: number
	height: number
	context: '2d'
	font?: string
	alpha?: boolean
	angle?: number
	pixel?: NodeCanvasRenderingContext2DSettings['pixelFormat']
}

export interface Rectangle {
	x: number
	y: number
	height: number
	width: number
	style?: string
}

export interface Circle {
	x: number
	y: number
	radius: number
	startAngle?: number
	endAngle?: number
	style?: string
	clockwise?: boolean
}

export interface Line {
	startPos: [number, number]
	endPos: [number, number]
	style?: string
	width?: number
}

export interface Img {
	x: number
	y: number
	src: string | Buffer
	width?: number
	height?: number
}

export interface Path {
	x: number
	y: number
}

export interface Gradient {
	startPos: [number, number]
	endPos: [number, number]
	colors: string[]
	style?: string
	startGradient: [number, number]
	endGradient: [number, number]
}

export interface Text {
	x: number
	y: number
	size?: number
	font?: string
	bold?: boolean
	italic?: boolean
	style?: string
	maxWidth?: number
}