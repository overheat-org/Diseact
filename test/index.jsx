const fs = require('fs');
const { join: j } = require('path');
const Discord = require('discord.js');
const Diseact = require('diseact');

const Counter = require('./components/Counter');
const Select = require('./components/Select');
const ImageGen = require('./components/ImageGen');

const { TEST_CHANNEL, TEST_GUILD, TOKEN } = process.env;

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages'] });

client.on('interactionCreate', interaction => {
	if(!interaction.isCommand()) return;
	
	Diseact.CommandInteractionExecutor(interaction);
})

client.once('ready', async () => {
	/** @type {import('discord.js').TextChannel} */
	const channel = await client.channels.fetch(TEST_CHANNEL);
	const guild = await client.guilds.fetch(TEST_GUILD);

	// guild.commands.set(fs.readdirSync(j(__dirname, "commands")).map(p => require(j(__dirname, "commands", p))))

	Diseact.render(channel, <Counter />);
	// Diseact.render(channel, <Select />);
	// Diseact.render(channel, <ImageGen />);
});

client.login(TOKEN);