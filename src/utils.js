import chalk from "chalk";
import util from "util";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

/**
 * @enum {number}
 */
export const SelectMenuVariant = {
    String: 0,
    User: 1,
    Channel: 2,
    Role: 3,
    Mentionable: 4,
};

export const defer = Promise.prototype.then.bind(Promise.resolve());

export class CommandBuilder extends SlashCommandBuilder {
	setExecution(fn) {
		this.execution = fn;

		return this;
	}
}

export class SubCommandBuilder extends SlashCommandSubcommandBuilder {
	setExecution(fn) {
		this.execution = fn;

		return this;
	}
}

export class SubCommandGroupBuilder extends SlashCommandSubcommandGroupBuilder { }