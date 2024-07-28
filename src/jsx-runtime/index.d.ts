import {
	Embed,
	Command,
	SubCommandGroup,
	Modal,
	TextInput,
	SelectMenu,
	Button,
	Title,
	Description,
	Author,
	Thumbnail,
	Footer,
	Field,
	Fields,
	Image,
	String,
	Number,
	Boolean,
	Integer,
	Channel,
	User,
	Role,
	Mentionable,
	Attachment,
	Option,
	SubCommand,
	Container,
} from "../src/entities";

declare global {
	namespace JSX {
		type Component = (...args: unknown[]) => Element
		type Element = { 
			type: string, 
			props: any, 
		};
		type Node = Element[];
		type IntrinsicElement<T> = T;

		interface IntrinsicElements {
			modal: IntrinsicElement<Modal>;
			textinput: IntrinsicElement<TextInput>;
			option: IntrinsicElement<Option>;
			selectmenu: IntrinsicElement<SelectMenu>;
			button: IntrinsicElement<Button>;
			embed: IntrinsicElement<Embed>;
			title: IntrinsicElement<Title>;
			description: IntrinsicElement<Description>;
			author: IntrinsicElement<Author>;
			image: IntrinsicElement<Image>;
			thumbnail: IntrinsicElement<Thumbnail>;
			footer: IntrinsicElement<Footer>;
			field: IntrinsicElement<Field>;
			fields: IntrinsicElement<Fields>;
			command: IntrinsicElement<Command>;
			subcommand: IntrinsicElement<SubCommand>;
			group: IntrinsicElement<SubCommandGroup>;
			string: IntrinsicElement<String>;
			boolean: IntrinsicElement<Boolean>;
			channel: IntrinsicElement<Channel>;
			integer: IntrinsicElement<Integer>;
			number: IntrinsicElement<Number>;
			user: IntrinsicElement<User>;
			role: IntrinsicElement<Role>;
			mentionable: IntrinsicElement<Mentionable>;
			attachment: IntrinsicElement<Attachment>;
			container: IntrinsicElement<Container>;
			// TODO: Do poll on JSX
		}
	}
}