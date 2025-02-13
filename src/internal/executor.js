export const autocompleteMap = globalThis.DISEACT_AUTOCOMPLETE_MAP ?? new Map();

export class InteractionExecutor {
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
    
        (interaction.isChatInputCommand() ? this.commandMap : autocompleteMap)[path]?.(interaction);
    }
    
    /** 
     * @param {{ __map__: { [key: string]: Function } }[]} commands 
     */
    putCommands(commands) {
        let map = {}
        
        for(const command of commands) {

            map = { ...map, ...command.__map__ }
        }
        
        this.commandMap = map;
    }
}
