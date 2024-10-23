import '../jsx-runtime';
import { TextChannel, CommandInteraction, Interaction, Message, User, GuildMember } from "discord.js";

export type RenderTarget = 
    | Message
    | User
    | GuildMember
    | TextChannel 
    | CommandInteraction;

export function CommandInteractionExecutor(interaction: CommandInteraction): void

export function createElement(type: string, props: { [k: string]: unknown }, ...children: JSX.Element[]): JSX.Element;

export function render(target: RenderTarget, component: JSX.Component | JSX.Element): Promise<void>

export function JSX(e): any

type Defer = { type: symbol, value: unknown }
export const useDefer: (value: unknown) => Defer ;

export * from '../hooks/index';

type ExecutionFunction = (interaction: Interaction) => unknown;
