function parseEmbedElement(element) {
    switch (element.type) {
        case "title":
		case "description":
		case "thumbnail":
		case "fields": return { prop: element.type, value: element.children.join('') }
		case "author": return { prop: element.type, value: { name: element.children.join(''), url: element.props.url, iconURL: element.props.iconURL } }
		case "footer": return { prop: element.type, value: { text: element.children.join(''), iconURL: element.props.iconURL } }
		case "embed": {
			const embed = element.props;
			embed.$symbol = Symbol.for("embed");
			
			for (const child of element.children) {
				embed[child.prop] = child.value;
			}
			
			return embed;
		}
		case "image": {
			const value = typeof element.children == 'object'
				? element
				: element.children.toString();

			return { prop: element.type, value }
		}
    }
}

export default parseEmbedElement;