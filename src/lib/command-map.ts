import { AutocompleteInteraction, ChatInputCommandInteraction, CommandInteractionOption } from "discord.js";

type FunctionLike = (...args) => any;
type CommandObject = {
    __handlers__: Record<string, FunctionLike>
}

export class CommandMap {
    private __map__: Map<string, FunctionLike>;

    set(command: CommandObject): this {
        Object.entries(command.__handlers__).forEach(([k, v]) => this.__map__.set(k, v));

        return this;
    }

    get(interaction: ChatInputCommandInteraction | AutocompleteInteraction): FunctionLike | undefined {
        const parts = [interaction.commandName, ...extractPath(interaction.options.data)];

        if (interaction.isAutocomplete()) {
            const focused = interaction.options.getFocused(true);
            parts.push(focused.name);
        }

        const key = parts.join(' ');

        return this.__map__.get(key) as FunctionLike;
    }

    constructor(commands: CommandObject[] = []) {
        console.log('vish ', {commands})
        console.log(
            commands.flatMap(cmd =>
                Object.entries(cmd.__handlers__)
            )
        )
        this.__map__ = new Map(
            commands.flatMap(cmd =>
                Object.entries(cmd.__handlers__)
            )
        );
    }
}

function extractPath(data: ReadonlyArray<CommandInteractionOption<'cached'>> = []): string[] {
    if (!data.length) return [];

    const [current] = data;

    const path = [current.name];

    if (current.options) {
        return path.concat(extractPath(current.options));
    }

    return path;
}
