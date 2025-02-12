export const autocompleteMap = global.DISEACT_AUTOCOMPLETE_MAP ?? new Map();

class InteractionExecutor {
    /**
     * @param {import("discord.js").ChatInputCommandInteraction | import('discord.js').AutocompleteInteraction} interaction 
     */
    run(interaction) {
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
    
        (interaction.isChatInputCommand() ? commandMap : autocompleteMap)[path]?.(interaction);
    }
    
    putCommands(commandMap) {
        this.commandMap = commandMap;
    }
}

export default InteractionExecutor