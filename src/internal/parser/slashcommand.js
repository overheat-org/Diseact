function parseSlashCommandElement(element) {
    switch (element.type) {
        case "string": {
			const { optional, max, min, ...option } = element.props;

			option.type = 3;
			option.required = optional ? !optional : true;
			max && (option.max_length = max);
			min && (option.min_length = min);

			return option;
		}
		case "boolean": {
			const { optional, ...option } = element.props;

			option.type = 5;
			option.required = optional ? !optional : true;

			return option;
		}
		case "channel": {
			const { optional, ...option } = element.props;

			option.type = 7;
			option.required = optional ? !optional : true;

			return option;
		}
		case "user": {
			const { optional, ...option } = element.props;

			option.type = 6;
			option.required = optional ? !optional : true;

			return option;
		}
		case "role": {
			const { optional, ...option } = element.props;

			option.type = 8;
			option.required = optional ? !optional : true;

			return option;
		}
		case "mentionable": {
			const { optional, ...option } = element.props;

			option.type = 9;
			option.required = optional ? !optional : true;

			return option;
		}
		case "attachment": {
			const { optional, ...option } = element.props;

			option.type = 11;
			option.required = optional ? !optional : true;

			return option;
		}
		case "number": {
			const { optional, max, min, ...option } = element.props;

			option.type = 10;
			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}
		case "integer": {
			const { optional, max, min, ...option } = element.props;

			option.type = 4;
			option.required = optional ? !optional : true;
			max && (option.max_value = max);
			min && (option.min_value = min);

			return option;
		}

		case "command": {
			const { localizations, ...command } = element.props;
			if (!command.description) command.description = " ";
			command.options = [];
			command.type = 1;

			if (localizations) {
				command.name_localizations = localizations.name;
				command.description_localizations = localizations.description;
			}

			for (const child of element.children) {
				if (typeof child == "function") {
					command.run = child;

					continue;
				}

				switch (child.type) {
					case 1: {
						const { run, ...subcommand } = child;

						commandMap.set(command.name + subcommand.name, run);
						command.options.push(subcommand);
					}
					case 2: {
						const { _run_map, ...group } = child;

						for (const option of group.options) {
							const run = _run_map[option.name];

							run && commandMap.set(command.name + group.name + option.name, run);
						}
						for (const run of Object.keys(_run_map)) {

						}

						command.options.push(group);
					}
				}

			}

			return command;
		}
		case "subcommand": {
			const { localizations, ...subcommand } = element.props;
			if (!subcommand.description) subcommand.description = " ";
			subcommand.options = [];
			command.type = 1;

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
			const group = element.props;
			if (!group.description) subcommand.description = " ";
			group.options = [];
			command.type = 2;

			if (group.localizations) {
				group.name_localizations = group.localizations.name;
				group.description_localizations = group.localizations.description;
			}

			for (const child of element.children) {
				const { run, ...subcommand } = child;

				group.options.push(subcommand);
				(group._run_map ??= {})[subcommand.name] = run;
			}

			return group;
		}
    }
}

export default parseSlashCommandElement;