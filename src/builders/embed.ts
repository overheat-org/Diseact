import { EmbedBuilder } from "discord.js";
import { Title, Description, Author, Thumbnail, Footer, Field, Fields, Image } from "../elements";

export type EmbedElements =
	| Title
	| Description 
	| Author
	| Image
	| Thumbnail
	| Footer
	| Field
	| Fields

export function EmbedElement(props: JSX.IntrinsicElements['embed'], children) {
	const embed = new EmbedBuilder();

	const acceptedTypes = {
		title: child => embed.setTitle(child.c),
		description: child => embed.setDescription(child.c),
		author: child => embed.setAuthor({ name: child.c, iconURL: child.p.iconURL, url: child.p.url }),
		image: child => embed.setImage(child.c),
		thumbnail: child => embed.setThumbnail(child.c),
		fields: child => embed.setFields(child.c),
		footer: child => embed.setFooter({ text: child.c, iconURL: child.p.iconURL })
	} satisfies { [key: string]: (child: { c: any, p: any }) => any }

	for(const child of children) {
		const selectedType = child!.e as keyof typeof acceptedTypes;
		acceptedTypes[selectedType](child);
	}

	if(props && 'color' in props) embed.setColor(props.color!);
	if(props && 'timestamp' in props) embed.setTimestamp(props.timestamp);

	return embed;
}

export function TitleElement(props, children) {
	return { e: "title", c: children.toString() }
}

export function DescriptionElement(props, children) {
	return { e: "description", c: children.toString() }
}

export function AuthorElement(props, children) {
	return { e: "author", c: children.toString(), p: props }
}

export function ImageElement(props, children) {
	return { e: "image", c: children.toString() }
}

export function ThumbnailElement(props, children) {
	return { e: "thumbnail", c: children.toString() }
}

export function FieldsElement(props, children) {
	const fields = new Array(); 
	
	for(const child of children) {
		fields.push(child.c);
	}

	return { e: "fields", c: fields };
}

export function FieldElement(props, children) {
	return { e: "field", c: { name: props.name, value: children.toString(), inline: props.inline } }
}

export function FooterElement(props, children) {
	return { e: "footer", c: children.toString(), p: props }
}