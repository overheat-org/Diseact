import { concatenateTextElements } from "../../lib/utils";

function parseEmbedElement(element) {
    switch (element.type) {
        case "title":
		case "description":
		case "thumbnail":
		case "fields": {
			return { prop: element.type, value: concatenateTextElements(element.children) }
		}
		case "author": {
			return { 
				prop: element.type, 
				value: { 
					name: element.props.name ?? concatenateTextElements(element.children), 
					url: element.props.url, 
					iconURL: element.props.iconURL 
				}
			}
		}
		case "footer": {
			return {
				prop: element.type,
				value: {
					text: concatenateTextElements(element.children),
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
			if(text.type == 'TEXT_ELEMENT') {
				url = concatenateTextElements(element.children);
			} else {
				url = text;
			}

			return { prop: element.type, value: { url } }
		}
    }
}

export default parseEmbedElement;