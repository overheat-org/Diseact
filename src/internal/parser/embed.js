import { concatenateTextElements } from "../../lib/utils.js";

function parseEmbedElement(element) {
    switch (element.type) {
        case "title":
		case "description":
		case "thumbnail":
		case "fields": {
			return { 
				$type: element.type, 
				prop: element.type, 
				value: concatenateTextElements(element.children)
			}
		}
		case "author": {
			return {
				$type: element.type, 
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
				$type: element.type, 
				prop: element.type,
				value: {
					text: concatenateTextElements(element.children),
					iconURL: element.props.iconURL
				}
			};
		}
		case "embed": {
			const embed = element.props;
			embed.$type = element.type;
			
			for (const child of element.children) {
				embed[child.$type] = child.value;
			}
			
			return embed;
		}
		case "image": {
			let url;
			
			if(element.$type == 'TEXT_ELEMENT') {
				url = concatenateTextElements(element.children);
			} else {
				url = element;
			}

			return {
				$type: element.type, 
				value: { url } 
			}
		}
    }
}

export default parseEmbedElement;