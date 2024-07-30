require('dotenv/config');
const fs = require('fs');
const { join: j } = require('path');
const Discord = require('discord.js');
const Diseact = require('diseact');

const Counter = require('./components/Counter');
const Select = require('./components/Select');

const { TEST_CHANNEL, TOKEN } = process.env;

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages'] });

for(const filePath of fs.readdirSync(j(__dirname, "commands"))) {
	const file = require(j(__dirname, "commands", filePath));

	console.log(file)
}

client.once('ready', async () => {
	const channel = await client.channels.fetch(TEST_CHANNEL);

	Diseact.render(channel, <Counter />);
	Diseact.render(channel, <Select />);
});

client.login(TOKEN);