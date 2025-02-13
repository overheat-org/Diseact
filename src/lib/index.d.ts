import '../jsx-runtime/index.d.ts';
import { TextChannel, CommandInteraction, Interaction, Message, User, GuildMember } from "discord.js";

export type RenderTarget = 
    | Message
    | User
    | GuildMember
    | TextChannel 
    | CommandInteraction;

export class InteractionExecutor {
    run(interaction: Interaction): void;

    putCommands(commands: JSX.Element[]): void;
}

export function createElement(type: string, props: { [k: string]: unknown }, ...children: JSX.Element[]): JSX.Element;

export function render(target: RenderTarget, component: JSX.Component | JSX.Element): Promise<void>

export function JSX(e): any

type Defer = { type: symbol, value: unknown }
export const useDefer: (value: unknown) => Defer ;

type ExecutionFunction = (interaction: Interaction) => unknown;

export * from '../hooks/index.d.ts';