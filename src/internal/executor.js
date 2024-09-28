/**
 * @type {Map<string, Function>}
 */
export const commandMap = global.DISEACT_COMMAND_MAP ?? new Map();

/**
 * @param {import("discord.js").CommandInteraction} interaction 
 */
export function CommandInteractionExecutor(interaction) {
    const commandName = interaction.commandName;
    let groupName = undefined;
    let subcommandName = undefined;

    try {
        groupName = interaction.options.getSubcommandGroup();
        subcommandName = interaction.options.getSubcommand(); 
    } catch {}

    let path;

    if(groupName) {
        path = `${commandName} ${groupName} ${subcommandName}`;
    }
    else if(subcommandName) {
        path = `${commandName} ${subcommandName}`;
    }
    else {
        path = commandName;
    }

    commandMap.get(path)?.(interaction);
}