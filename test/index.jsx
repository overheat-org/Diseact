require('dotenv/config');
const Discord = require('discord.js');
const Diseact = require('diseact');
const Counter = require('./components/Counter');
const Select = require('./components/Select');

const { TEST_CHANNEL, TOKEN } = process.env;

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages'] });

client.once('ready', async () => {
	const channel = await client.channels.fetch(TEST_CHANNEL);

	// Diseact.render(channel, <Counter />);
	Diseact.render(channel, <Select />);
});

client.login(TOKEN);