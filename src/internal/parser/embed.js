function parseEmbedElement(element) {
    switch (element.type) {
        case "title":
		case "description":
		case "thumbnail":
		case "fields": {
			const [text] = element.children;

			if(text.type != 'TEXT_ELEMENT') {
				throw new Error('Expected a text of child on element')
			}
			
			return { prop: element.type, value: text.props.value }
		}
		case "author": {
			const [text] = element.children;
	
			if(text.type != 'TEXT_ELEMENT') {
				throw new Error('Expected a text of child on element')
			}
			
			return { 
				prop: element.type, 
				value: { 
					name: text.props.value, 
					url: element.props.url, 
					iconURL: element.props.iconURL 
				}
			}
		}
		case "footer": {
			const [text] = element.children;
		
			if (text.type != 'TEXT_ELEMENT') {
				throw new Error('Expected a text of child on element');
			}
			
			return {
				prop: element.type,
				value: {
					text: text.props.value,
					iconURL: element.props.iconURL
				}
			};
		}
		case "embed": {
			const embed = element.props;
			embed.$symbol = Symbol.for("embed");
			
			for (const child of element.children) {
				embed[child.prop] = child.value;
			}
			
			return embed;
		}
		case "image": {
			let url = '';
			const [text] = element.children;
	
			if(text.type == 'TEXT_ELEMENT') {
				url = text.props.value;
			} else {
				url = text;
			}

			return { prop: element.type, value: { url } }
		}
    }
}

export default parseEmbedElement;