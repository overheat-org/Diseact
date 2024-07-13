import {
	APISelectMenuDefaultValue,
	AutocompleteInteraction,
	BitFieldResolvable,
	ButtonInteraction,
	ButtonStyle,
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
import { SelectMenuVariant } from "../types";

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

export interface Command extends CommandBased {
	nsfw?: boolean;
	children?: (
		| JSX.Element
		| ((interaction: CommandInteraction<"cached">) => unknown)
	)[];
}

export interface SubCommand extends CommandBased {
	children?: (
		| JSX.Element
		| ((interaction: CommandInteraction<"cached">) => unknown)
	)[];
}

export interface SubCommandGroup extends CommandBased {
	children?: JSX.Element[];
}

export interface OptionBased extends Omit<CommandBased, "children"> {
	optional?: boolean;
}

export interface CanCompleteOption extends OptionBased {
	autocomplete?: (interaction: AutocompleteInteraction) => unknown;
}

export interface String extends CanCompleteOption {
	maxLength?: number;
	minLength?: number;
}

export interface Boolean extends OptionBased { }

export interface Number extends OptionBased {
	maxValue?: number;
	minValue?: number;
}

export interface Integer extends OptionBased {
	maxValue?: number;
	minValue?: number;
}

export interface Channel extends OptionBased { }
export interface User extends OptionBased { }
export interface Role extends OptionBased { }
export interface Mentionable extends OptionBased { }
export interface Attachment extends OptionBased { }

interface ComponentBased {
	id: string;
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
	minLength?: number;
	maxLength?: number;
	value?: string;
	required?: boolean;
}

interface BaseButton {
	children?: string;
	disabled?: boolean;
	emoji?: string;
	label?: string;
}

interface LinkButton extends BaseButton {
	variant: ButtonStyle.Link;
	url: string;
}

interface OtherButton extends ComponentBased, BaseButton {
	onClick?(interaction: ButtonInteraction): unknown
	variant: Exclude<ButtonStyle, ButtonStyle.Link>
}

export type Button = OtherButton | LinkButton;

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
	defaultChannel: string[];
	channelTypes: ChannelType[];
	onSelect?(interaction: ChannelSelectMenuInteraction): unknown
}

export interface RoleSelectMenu extends BaseSelectMenu {
	isRole: true
	defaultRoles: string[];
	onSelect?(interaction: RoleSelectMenuInteraction): unknown
}

export interface MentionableSelectMenu extends BaseSelectMenu {
	isMentionable: true
	defaultValues: (
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

export interface MessageOpts extends OptsBase {
	isMessage: true;
	isInteraction?: never;
	nonce?: string | number;
	enforceNonce?: boolean;
}

export interface InteractionOpts extends OptsBase {
	isInteraction: true;
	isMessage?: never;
	ephemeral?: boolean;
	fetchReply?: boolean;
}

export type Container = MessageOpts | InteractionOpts;