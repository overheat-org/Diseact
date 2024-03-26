import { Embed, Command, SubCommand, Group, Modal, TextInput, SelectMenu, Row, Button, Title, Description, Author, Thumbnail, Footer, Field, Fields, Option, Image } from "./elements";
import { ComponentElements } from "./builders/component";

declare global {
    namespace JSX {
		type EmbedPropsElements<E extends keyof IntrinsicElements> = { 
			e: E, 
			p: IntrinsicElements[E]
			c: Element | string
		}
        // type Element<E extends keyof IntrinsicElements = any> = ComponentElements<E> extends null 
		// 	? EmbedPropsElements<E> 
		// 	: ComponentElements<E>
		type Element = any

        type IntrinsicElement<T> = T;
        interface IntrinsicElements {
            // "command": IntrinsicElement<Command>;
            // "subcommand": IntrinsicElement<Subcommand>;
            // "group": IntrinsicElement<Group>;
            "modal": IntrinsicElement<Modal>;
            "textinput": IntrinsicElement<TextInput>;
            "option": IntrinsicElement<Option>;
            "selectmenu": IntrinsicElement<SelectMenu>;
            "row": IntrinsicElement<Row>;
            "button": IntrinsicElement<Button>;
            "embed": IntrinsicElement<Embed>;
            "title": IntrinsicElement<Title>;
            "description": IntrinsicElement<Description>;
            "author": IntrinsicElement<Author>;
            "image": IntrinsicElement<Image>;
            "thumbnail": IntrinsicElement<Thumbnail>;
            "footer": IntrinsicElement<Footer>;
            "field": IntrinsicElement<Field>;
            "fields": IntrinsicElement<Fields>;
        }
    }
}

