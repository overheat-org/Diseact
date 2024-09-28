import { commandMap } from "../../internal/executor";

const EMPTY_DESCRIPTION = "empty"

function parseSlashCommandElement(element) {
    switch (element.type) {
        case "string": {
			const { optional, max, min, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 3;
			option.required = optional ? !optional : true;
			max && (option.max_length = max);
			min && (option.min_length = min);

			return option;
		}
		case "boolean": {
			const { optional, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 5;
			option.required = optional ? !optional : true;

			return option;
		}
		case "channel": {
			const { optional, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 7;
			option.required = optional ? !optional : true;

			return option;
		}
		case "user": {
			const { optional, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 6;
			option.required = optional ? !optional : true;

			return option;
		}
		case "role": {
			const { optional, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 8;
			option.required = optional ? !optional : true;

			return option;
		}
		case "mentionable": {
			const { optional, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 9;
			option.required = optional ? !optional : true;

			return option;
		}
		case "attachment": {
			const { optional, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 11;
			option.required = optional ? !optional : true;

			return option;
		}
		case "number": {
			const { optional, max, min, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 10;
			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}
		case "integer": {
			const { optional, max, min, ...option } = element.props;

			option.description ??= EMPTY_DESCRIPTION;
			option.type = 4;
			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}

		case "command": {
			const { localizations, ...command } = element.props;
			command.description ??= EMPTY_DESCRIPTION;
			command.options = [];
			command.type = 1;

			if (localizations) {
				command.name_localizations = localizations.name;
				command.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				if (typeof child == "function") {
					command.run = child;

					commandMap.set(command.name, command.run);

					continue;
				}

				switch (child.type) {
					case 1: {
						const { run, ...subcommand } = child;

						commandMap.set(`${command.name} ${subcommand.name}`, run);
						
						command.options.push(subcommand);

						break;
					}
					case 2: {
						const { ...group } = child;

						for (const { run, ...subcommand } of group.options) {
							commandMap.set(`${command.name} ${group.name} ${subcommand.name}`, run);
						}

						command.options.push(group);

						break;
					}
					default: {
						const option = child;

						command.options.push(option);
					}
				}
			}

			return command;
		}
		case "subcommand": {
			const { localizations, ...subcommand } = element.props;
			subcommand.description ??= EMPTY_DESCRIPTION;
			subcommand.options = [];
			subcommand.type = 1;

			if (localizations) {
				subcommand.name_localizations = localizations.name;
				subcommand.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				if (typeof child == "function") {
					subcommand.run = child;

					continue;
				}

				subcommand.options.push(child);
			}

			return subcommand;
		}
		case "group": {
			const { localizations, ...group } = element.props;
			group.description ??= EMPTY_DESCRIPTION;
			group.options = [];
			group.type = 2;

			if (localizations) {
				group.name_localizations = localizations.name;
				group.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				const subcommand = child;

				group.options.push(subcommand);
			}

			return group;
		}
    }
}

export default parseSlashCommandElement;