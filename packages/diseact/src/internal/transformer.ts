import * as collector from "./collector";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonStyle, ComponentType } from "discord.js";
import { render } from "./renderer";
import { randomBytes } from "node:crypto";
import { EMPTY_DESCRIPTION, TEXT_ELEM } from "./constants";

type Elem = {
    type: string,
    props: any,
    children: any
}

const transformerMap = {
    [TEXT_ELEM]: transformText,
    title:       transformTitle,
    description: transformDescription,
    thumbnail:   transformThumbnail,
    fields:      transformFields,
    author:      transformAuthor,
    footer:      transformFooter,
    image:       transformImage,
    embed:       transformEmbed,
    command:     transformCommand,
    subcommand:  transformSubCommand,
    group:       transformGroup,
    string:      transformString,
    boolean:     transformBoolean,
    channel:     transformChannel,
    user:        transformUser,
    role:        transformRole,
    mentionable: transformMentionable,
    attachment:  transformAttachment,
    number:      transformNumber,
    integer:     transformInteger,
    button:      transformButton,
    modal:       transformModal,
    selectmenu:  transformSelectMenu,
    separator:   transformSeparator,
    file:        transformFile,
    container:   transformContainer,
    content:     transformContent,
    row:         transformRow,
    message:     transformMessageOrInteraction,
    interaction: transformMessageOrInteraction,
    section:     transformSection,
    gallery:     transformGallery,
    media:       transformMedia,
}

/**
  * Transforms jsx to discord object
  */
function transform(elem: Elem) {
    console.log({elem})
    if(typeof elem.type == 'function') return;
    if(Array.isArray(elem)) return elem.forEach(transform);

    const selected = transformerMap[elem.type];
    if(!selected) throw new Error(`Invalid jsx element '${elem.type}'`);

    return selected(elem);
}

function transformTitle(elem: Elem) {
    return {
        $type: elem.type,
        prop: elem.type,
        value: transformText(elem.children)
    }
}

function transformDescription(elem: Elem) {
    return {
        $type: elem.type,
        prop: elem.type,
        value: transformText(elem.children)
    }
}

function transformThumbnail(elem: Elem) {
    return {
        $type: elem.type,
        prop: elem.type,
        value: transformText(elem.children)
    }
}

function transformFields(elem: Elem) {
    return {
        $type: elem.type,
        prop: elem.type,
        value: transformText(elem.children)
    }
}

function transformAuthor(elem: Elem) {
    return {
        $type: elem.type,
        prop: elem.type,
        value: {
            name: elem.props.name ?? transformText(elem.children),
            url: elem.props.url,
            iconURL: elem.props.iconURL
        }
    }
}

function transformFooter(elem: Elem) {
    return {
        $type: elem.type, 
        prop: elem.type,
        value: {
            text: transformText(elem.children),
            iconURL: elem.props.iconURL
        }
    };
}

function transformEmbed(elem: Elem) {
    const embed = elem.props;
    embed.$type = elem.type;

    const c = child => embed[child.$type] = child.value;
    Array.isArray(elem.children) ? elem.children.forEach(c) : c(elem.children);

    return embed;
}

function transformImage(elem: Elem) {
    let url;
    
    if(elem.type == TEXT_ELEM) {
        url = transformText(elem.children);
    } else {
        url = elem;
    }

    return {
        $type: elem.type, 
        value: { url } 
    }
}

function transformCommand(elem: Elem) {
    const { localizations, ...command } = elem.props;

    const handlers = {};
    
    command.$type = elem.type; 
    command.description ??= EMPTY_DESCRIPTION;
    command.options = [];
    command.type = ApplicationCommandType.ChatInput;
    command.__handlers__ = handlers;

    if (localizations) {
        command.name_localizations = localizations.name;
        command.description_localizations = localizations.description;
    }

    const handleChildren = child => {
        console.log({child})
        if (typeof child == "function") {
            command.run = i => render(i, child);

            handlers[command.name] = command.run;

            return;
        }

        switch (child.type) {
            case ApplicationCommandOptionType.Subcommand: {
                const { run, ...subcommand } = child;

                handlers[`${command.name} ${subcommand.name}`] = run;
                
                command.options.push(subcommand);

                break;
            }
            case ApplicationCommandOptionType.SubcommandGroup: {
                const { ...group } = child;

                for (const { run, ...subcommand } of group.options) {
                    handlers[`${command.name} ${group.name} ${subcommand.name}`] = run;
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

    Array.isArray(elem.children) ? elem.children.forEach(handleChildren) : handleChildren(elem.children);

    console.log(elem.children)

    return command;
}

function transformSubCommand(elem: Elem) {
    const { localizations, ...subcommand } = elem.props;

    subcommand.$type = elem.type; 
    subcommand.description ??= EMPTY_DESCRIPTION;
    subcommand.options = [];
    subcommand.type = ApplicationCommandOptionType.Subcommand;

    if (localizations) {
        subcommand.name_localizations = localizations.name;
        subcommand.description_localizations = localizations.description;
    }

    const handleChildren = child => {
        if (typeof child == "function") {
            subcommand.run = i => render(i, child);

            return;
        }

        subcommand.options.push(child);
    }

    Array.isArray(elem.children) ? elem.children.forEach(handleChildren) : handleChildren(elem.children);

    return subcommand;
}

function transformGroup(elem: Elem) {
    const { localizations, ...group } = elem.props;

    group.$type = elem.type; 
    group.description ??= EMPTY_DESCRIPTION;
    group.options = [];
    group.type = ApplicationCommandOptionType.SubcommandGroup;

    if (localizations) {
        group.name_localizations = localizations.name;
        group.description_localizations = localizations.description;
    }

    const handleChildren = child => {
        const subcommand = child;

        group.options.push(subcommand);
    }

    Array.isArray(elem.children) ? elem.children.forEach(handleChildren) : handleChildren(elem.children);

    return group;
}

function transformString(elem: Elem) {
    const { optional, max, min, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.String;
    option.required = !optional;
    max && (option.max_length = max);
    min && (option.min_length = min);

    return option;
}

function transformBoolean(elem: Elem) {
    const { optional, ...option } = elem.props;
    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Boolean;
    option.required = !optional;

    return option;
}

function transformChannel(elem: Elem) {
    const { optional, ...option } = elem.props;
    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Channel;
    option.required = !optional;

    return option;
}

function transformUser(elem: Elem) {
    const { optional, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.User;
    option.required = !optional;

    return option;
}

function transformRole(elem: Elem) {
    const { optional, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Role;
    option.required = !optional;

    return option;
}

function transformMentionable(elem: Elem) {
    const { optional, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Mentionable;
    option.required = !optional;

    return option;
}

function transformAttachment(elem: Elem) {
    const { optional, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Attachment;
    option.required = !optional;

    return option;
}

function transformNumber(elem: Elem) {
    const { optional, max, min, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Number;
    option.required = !optional;
    max && (option.max_value = max);
    min && (option.min_value = min);

    return option;
}

function transformInteger(elem: Elem) {
    const { optional, max, min, ...option } = elem.props;

    option.$type = elem.type; 
    option.description ??= EMPTY_DESCRIPTION;
    option.type = ApplicationCommandOptionType.Integer;
    option.required = !optional;
    max && (option.max_value = max);
    min && (option.min_value = min);

    return option;
}

const buttonStyleMap = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
    premium: ButtonStyle.Premium,
}

function transformButton(elem: Elem) {
    const { onClick, id, ...button } = elem.props;

    button.$type = elem.type; 
    button.type = ComponentType.Button;
    if(!button.label && elem.children) button.label = transformText(elem.children); 
    button.custom_id = id ? id : generateIdTo(button);

    const styleKey = Object.keys(buttonStyleMap).find(x => x in button);
    if(!styleKey) throw new Error('Button style not found');

    button.style = buttonStyleMap[styleKey];

    if (button.style != ButtonStyle.Link) {
        collector.on(button, onClick);
    }

    return button;
}

function transformModal(elem: Elem) {
    const { onSubmit, id, ...modal } = elem.props;
    
    modal.$type = elem.type;
    modal.type = 9999;
    modal.custom_id = id ? id : generateIdTo(modal);

    collector.on(modal, onSubmit);
}

const selectMenuTypeMap = {
    user: ComponentType.UserSelect,
    channel: ComponentType.ChannelSelect,
    role: ComponentType.RoleSelect,
    mentionable: ComponentType.MentionableSelect,
    string: ComponentType.StringSelect,
}

function transformSelectMenu(elem: Elem) {
    const { onSelect, id, ...selectmenu } = elem.props;

    selectmenu.$type = elem.type;
    selectmenu.type = getBySharedKey(selectmenu, selectMenuTypeMap);
    selectmenu.custom_id = id ? id : generateIdTo(selectmenu);
    
    collector.on(selectmenu, onSelect);

    return selectmenu;
}

function transformSeparator(elem: Elem) {
    return {
        $type: elem.type,
        type: ComponentType.Separator,
        divider: elem.props.divider,
        spacing: elem.props.spacing
    }
}

function transformFile(elem: Elem) {
    return {
        $type: elem.type,
        type: ComponentType.File,
        file: {
            url: elem.props.url
        },
        spoiler: elem.props.spoiler
    }
}

function transformContainer(elem: Elem) {
    const { color, ...container } = elem.props;

    container.$type = elem.type;
    container.type = ComponentType.Container;
    if(color) container.accent_color = color;

    const components = [];

    const handleChildren = c => components.push(c); 
    Array.isArray(elem.children) ? elem.children.forEach(handleChildren) : handleChildren(elem.children);

    container.components = components;

    return container;
}

function transformContent(elem: Elem) {
    return {
        $type: elem.type,
        type: ComponentType.TextDisplay,
        content: transformText(elem)
    }
}

function transformRow(elem: Elem) {
    return {
        $type: elem.type,
        type: ComponentType.ActionRow,
        components: Array.isArray(elem.children) ? elem.children : [elem.children]
    }
}

function transformSection(elem: Elem) {
    return {
        $type: elem.type,
        type: ComponentType.Section,
        accessory: elem.props.accessory,
        components: Array.isArray(elem.children) ? elem.children : [elem.children]
    }
}

function transformGallery(elem: Elem) {
    return {
        $type: elem.type,
        type: ComponentType.MediaGallery,
        items: []
    }
}

function transformMedia(elem: Elem) {
    return {
        $type: elem.type,
        media: {
            url: elem.props.url
        },
        description: elem.props.description,
        spoiler: elem.props.spoiler
    }
}

function transformMessageOrInteraction(elem: Elem) {
    const { ...container } = elem.props;

    container.$type = elem.type;
    container.embeds = [];
    container.components = [];
    container.files = [];

    const handleChildren = (children) => {
        switch (children.$type) {
            case 'embed':
                container.embeds.push(children);
                break;

            case 'row':
                container.components.push(children);
                break;

            case TEXT_ELEM:
                container.content += children.props.value;
                break;
        }
    }

    Array.isArray(elem.children) ? elem.children.forEach(handleChildren) : handleChildren(elem.children);

    return container;
}

function transformText(element: Elem | Elem[]) {
    const c = (el: Elem) => el.type === TEXT_ELEM ? el.props.value : '';

    if(Array.isArray(element)) {
        return element.map(c).join('');
    }

    return c(element);
}

function generateIdTo(elem) {
    return `${elem.type}-${randomBytes(6).toString('hex')}`;
}

function getBySharedKey<T extends object, O extends Record<string, any>>(object: O, object2: T): O[keyof O] | undefined {
    const key = Object.keys(object).find(x => x in object2);
    
    return object[key];
}

export default transform;
