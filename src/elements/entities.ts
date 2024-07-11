import {
	APISelectMenuDefaultValue,
	AutocompleteInteraction,
	BitFieldResolvable,
	ButtonStyle,
	ChannelType,
	ColorResolvable,
	CommandInteraction,
	LocalizationMap,
	MessageFlags,
	MessageFlagsString,
	MessageMentionOptions,
	SelectMenuDefaultValueType,
	TextInputStyle,
} from "discord.js";
import { SelectMenuVariant } from "..";

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
}

export interface TextInput extends ComponentBased {
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
	variant:
	| ButtonStyle.Success
	| ButtonStyle.Danger
	| ButtonStyle.Primary
	| ButtonStyle.Secondary;
}

export type Button = OtherButton | LinkButton;

interface BaseSelectMenu extends ComponentBased {
	placeholder: string;
	disabled?: boolean;
	min?: number;
	max?: number;
}

export interface UserSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.User;
	defaultUsers: string[];
}

export interface ChannelSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.Channel;
	defaultChannel: string[];
	channelTypes: ChannelType[];
}

export interface RoleSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.Role;
	defaultRoles: string[];
}

export interface MentionableSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.Mentionable;
	defaultValues: (
		| APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>
		| APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>
	)[];
}

export interface StringSelectMenu extends BaseSelectMenu {
	variant: SelectMenuVariant.String;
	default?: string;
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

export interface Row { }

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
export type Opts = MessageOpts | InteractionOpts;
