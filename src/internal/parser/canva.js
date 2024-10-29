import { createCanvas } from "canvas";
import { concatenateTextElements } from "../../lib/utils";

function parseCanvaElement(element) {
    switch (element.type) {
        case 'canvas': {
			const { height, width, context, font, alpha, angle, pixel } = element.props;

			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext(context, { alpha, pixelFormat: pixel });

			font && (ctx.font = font);
			angle && ctx.rotate(angle);

			for (const child of element.children) {
				switch (child.$type) {
					case 'rectangle':
						if (child.style) {
							ctx.fillStyle = child.style;
						}

						ctx.fillRect(child.x, child.y, child.width, child.height);

						break;

					case 'circle':
						if (child.style) {
							ctx.fillStyle = child.style;
						}

						ctx.beginPath();
						ctx.arc(child.x, child.y, child.radius, child.startAngle ?? 0, child.endAngle ?? Math.PI * 2, child.clockwise);
						ctx.fill();

						break;

					case 'line':
						if (child.style) {
							ctx.strokeStyle = child.style;
						}

						if(child.width) {
							ctx.lineWidth = child.width;
						}

						ctx.beginPath();
						ctx.moveTo(...child.startPos);
						ctx.lineTo(...child.endPos);
						ctx.stroke();

						break;

					case 'img':
						const img = new Image();
						const imgData = typeof child.src == 'string' 
							? fs.readFileSync(child.src)
							: child.src;

						img.onload = () => {
							ctx.drawImage(img, child.x, child.y, child.width, child.height);
						};
						img.src = imgData;

						break;

					case 'path': 
						break;

					case 'gradient':
						const gradient = ctx.createLinearGradient(...child.startGradient, ...child.endGradient);

						for(let i = 0; i < child.colors.length; i++) {
							gradient.addColorStop(i, child.colors[i]);
						}

						ctx.fillRect(...child.startPos, ...child.endPos);
						
						break;
						
					case 'text':
						const opts = [];
						child.italic && opts.push('italic');
						child.bold && opts.push('bold');
						child.size && opts.push(child.size.toString().concat('px'));
						opts.push(child.font ?? 'sans-serif');

						if (opts.length > 0) ctx.font = opts.join(' ');

						child.style && (ctx.fillStyle = child.style);

						ctx.fillText(child.content, child.x, child.y, child.maxWidth);
						ctx.font = font;

						break;

					default:
						break;
				}
			}

			const buf = canvas.toBuffer();
			buf.$type = element.type;

			return buf;
		}
		case 'rectangle':
		case 'circle':
		case 'line':
		case 'img': {
			return {
				$type: element.type,
				...element.props
			}
		}
		case 'path': {
			return {
				$type: element.type,
				content: concatenateTextElements(element.children),
				...element.props
			};
		}
		case 'gradient': {
			return {
				$type: element.type,
				content: concatenateTextElements(element.children),
				...element.props
			};
		}
		case 'text': {
			return {
				$type: element.type,
				content: concatenateTextElements(element.children),
				...element.props
			};
		}
		
    }
}

export default parseCanvaElement;