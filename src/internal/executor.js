/**
 * @type {Map<string, Function>}
 */
export const commandMap = new Map();

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

    let name = commandName;

    if(groupName) {
        name += groupName + subcommandName;
    }
    else if(subcommandName) {
        name += subcommandName;
    }

    commandMap.get(name)?.(interaction);
}