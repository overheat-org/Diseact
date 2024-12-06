import { readdirSync } from 'fs';
import { join as j } from 'path';
import { Client } from 'discord.js';
import { CommandInteractionExecutor, render } from 'diseact';

import Counter from './components/Counter.js';
import Select from './components/Select.js';
import ImageGen from './components/ImageGen.js';

const { TEST_CHANNEL, TEST_GUILD, TOKEN } = process.env;

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

console.log(<embed></embed>)

client.on('interactionCreate', interaction => {
	if(!interaction.isCommand()) return;
	
	CommandInteractionExecutor(interaction);
})

client.once('ready', async () => {
	/** @type {import('discord.js').TextChannel} */
	const channel = await client.channels.fetch(TEST_CHANNEL);
	const guild = await client.guilds.fetch(TEST_GUILD);

	guild.commands.set(readdirSync(j(__dirname, "commands")).map(p => require(j(__dirname, "commands", p)).default))

	render(channel, Counter);
	// Diseact.render(channel, Select);
	// Diseact.render(channel, ImageGen);
});

client.login(TOKEN);