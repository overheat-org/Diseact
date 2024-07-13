import './jsx/type';
import { TextChannel, CommandInteraction, SlashCommandBuilder, Interaction, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

export enum SelectMenuVariant {
	String,
	User,
	Channel,
	Role,
	Mentionable
}

export type RenderTarget = 
	| TextChannel 
	| CommandInteraction;

export function render(target: RenderTarget, component: JSX.Component | JSX.Element): Promise<void>

export type Dispatch<A> = (value: A) => void;
export type StateUpdater<S> = S | ((prevState: S) => S);

export function useState<S>(
	initialState: S | (() => S)
): [S, Dispatch<StateUpdater<S>>];

export function useState<S = undefined>(): [
	S | undefined,
	Dispatch<StateUpdater<S | undefined>>
];

export function useEffect(effect: () => void | (() => void), inputs?: ReadonlyArray<unknown>): void;

type ExecutionFunction = (interaction: Interaction) => unknown;

export class CommandBuilder extends SlashCommandBuilder {
	execution: ExecutionFunction

	setExecution(fn: ExecutionFunction): void
} 

export class SubCommandBuilder extends SlashCommandSubcommandBuilder {
	execution: ExecutionFunction

	setExecution(fn: ExecutionFunction): void
}

export class SubCommandGroupBuilder extends SlashCommandSubcommandGroupBuilder {}