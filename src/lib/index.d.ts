import '../jsx-runtime';
import { TextChannel, CommandInteraction, Interaction, Message } from "discord.js";

export type RenderTarget = 
	| Message
	| TextChannel 
	| CommandInteraction;

export function CommandInteractionExecutor(interaction: CommandInteraction): void

export function createElement(type: string, props: { [k: string]: unknown }, ...children: JSX.Element[]): JSX.Element;

export function render(target: RenderTarget, component: JSX.Component | JSX.Element): Promise<void>

export function JSX(e): any

type ExecutionFunction = (interaction: Interaction) => unknown;