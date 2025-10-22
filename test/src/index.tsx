import { readdirSync } from 'fs';
import { dirname, join as j } from 'path';
import { Client } from 'discord.js';
import Counter from './counter';
import { fileURLToPath, pathToFileURL } from 'url';
import { render, CommandMap } from '@jsx-oh/discord';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { TEST_CHANNEL, TEST_GUILD, TOKEN } = process.env;

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });
let commands: CommandMap;

client.on('interactionCreate', interaction => {
    if (!interaction.isChatInputCommand()) return;

    console.log(interaction.commandName)
    const command = commands.get(interaction);
    console.log({command})
    command?.(interaction);
});

client.once('ready', async () => {
    /** @type {import('discord.js').TextChannel} */
    const channel = await client.channels.fetch(TEST_CHANNEL);
    const guild = await client.guilds.fetch(TEST_GUILD);

    console.log(j(__dirname, 'commands'));

    const commandsList = await Promise.all(
        readdirSync(j(__dirname, 'commands')).map(async (p) => {
            const commandPath = pathToFileURL(j(__dirname, 'commands', p)).href;
            const command = await import(commandPath);

            return command.default;
        })
    );

    console.log({commandsList})

    commands = new CommandMap(commandsList);

    console.log({commands})
    await guild.commands.set(commandsList);

    <Counter />
    // render(channel, Counter);
    // Diseact.render(channel, Select);
    // Diseact.render(channel, ImageGen);
});

client.login(TOKEN);
