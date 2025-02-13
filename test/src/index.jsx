import { readdirSync } from 'fs';
import { dirname, join as j } from 'path';
import { Client } from 'discord.js';
import { InteractionExecutor, render } from 'diseact';

import Counter from './components/Counter.js';
import Select from './components/Select.js';
import ImageGen from './components/ImageGen.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { TEST_CHANNEL, TEST_GUILD, TOKEN } = process.env;

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

const executor = new InteractionExecutor();

client.on('interactionCreate', interaction => {
	if(!interaction.isCommand()) return;
	
	executor.run(interaction);
});

client.once('ready', async () => {
	/** @type {import('discord.js').TextChannel} */
	const channel = await client.channels.fetch(TEST_CHANNEL);
	const guild = await client.guilds.fetch(TEST_GUILD);

	const commands = await Promise.all(
		readdirSync(j(__dirname, 'commands')).map(async (p) => {
			const commandPath = pathToFileURL(j(__dirname, 'commands', p)).href;
			const command = await import(commandPath);
		
			return command.default;
		})
	);


	executor.putCommands(commands);
	await guild.commands.set(commands);

	render(channel, Counter);
	// Diseact.render(channel, Select);
	// Diseact.render(channel, ImageGen);
});

client.login(TOKEN);