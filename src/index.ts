import './jsx';
// import { CommandElement, SubCommandElement, SubCommandGroupElement } from './builders/command';
import { ActionRowElement, ButtonElement, SelectMenuElement, OptionElement, ModalElement, TextInputElement } from './builders/component';
import { EmbedElement, TitleElement, DescriptionElement, AuthorElement, ImageElement, ThumbnailElement, FooterElement, FieldElement, FieldsElement } from './builders/embed';

export function createElement<E extends keyof JSX.IntrinsicElements>(type: E, props: JSX.IntrinsicElements[E], ...children: JSX.Element | string): JSX.Element {
	const acceptedElements = {
		/* Command */
		// command: CommandElement,
		// subcommand: SubCommandElement,
		// group: SubCommandGroupElement,

		/* Component */
		row: ActionRowElement,
		button: ButtonElement,
		selectmenu: SelectMenuElement,
		option: OptionElement,

		/* Modal */
		modal: ModalElement,
		textinput: TextInputElement,

		/* Embed */
		embed: EmbedElement,
		title: TitleElement,
		description: DescriptionElement,
		author: AuthorElement,
		image: ImageElement,
		thumbnail: ThumbnailElement,
		footer: FooterElement,
		field: FieldElement,
		fields: FieldsElement
	};
	
	return acceptedElements[type](props, children);
}

export * from './builders/command';
export * from './builders/component';
export * from './builders/embed';
export * as default from './index';