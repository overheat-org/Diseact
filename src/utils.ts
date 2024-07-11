import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

declare global {
	type Fn = (...args: any[]) => any
}

export function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return /** @type {O & P} */ (obj);
}

export const defer = Promise.prototype.then.bind(Promise.resolve())

export class CommandBuilder extends SlashCommandBuilder {
	execution?: Fn;

	setExecution(fn: Fn) {
		this.execution = fn;

		return this;
	}
}

export class SubCommandBuilder extends SlashCommandSubcommandBuilder {
	execution?: Fn;

	setExecution(fn: Fn) {
		this.execution = fn;

		return this;
	}
}

export class SubCommandGroupBuilder extends SlashCommandSubcommandGroupBuilder {}