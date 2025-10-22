import { __awaiter, __generator } from './node_modules/tslib/tslib.es6.js';
import { jsx } from '@jsx-oh/discord/jsx-runtime';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { Client } from 'discord.js';
import Counter from './counter.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { CommandMap } from '@jsx-oh/discord';

var __dirname = dirname(fileURLToPath(import.meta.url));
var _a = process.env, TEST_CHANNEL = _a.TEST_CHANNEL, TEST_GUILD = _a.TEST_GUILD, TOKEN = _a.TOKEN;
var client = new Client({ intents: ['Guilds', 'GuildMessages'] });
var commands;
client.on('interactionCreate', function (interaction) {
    if (!interaction.isChatInputCommand())
        return;
    console.log(interaction.commandName);
    var command = commands.get(interaction);
    console.log({ command: command });
    command === null || command === void 0 ? void 0 : command(interaction);
});
client.once('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var guild, commandsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.channels.fetch(TEST_CHANNEL)];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.guilds.fetch(TEST_GUILD)];
            case 2:
                guild = _a.sent();
                console.log(join(__dirname, 'commands'));
                return [4 /*yield*/, Promise.all(readdirSync(join(__dirname, 'commands')).map(function (p) { return __awaiter(void 0, void 0, void 0, function () {
                        var commandPath, command;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    commandPath = pathToFileURL(join(__dirname, 'commands', p)).href;
                                    return [4 /*yield*/, import(commandPath)];
                                case 1:
                                    command = _a.sent();
                                    return [2 /*return*/, command.default];
                            }
                        });
                    }); }))];
            case 3:
                commandsList = _a.sent();
                console.log({ commandsList: commandsList });
                commands = new CommandMap(commandsList);
                console.log({ commands: commands });
                return [4 /*yield*/, guild.commands.set(commandsList)];
            case 4:
                _a.sent();
                jsx(Counter, {});
                return [2 /*return*/];
        }
    });
}); });
client.login(TOKEN);
