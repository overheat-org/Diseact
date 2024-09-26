import { createCanvas } from "canvas";

function parseCanvaElement(element) {
    switch (element.type) {
        case 'canvas': {
			const { height, width, context, font, alpha, angle, pixel } = element.props;

			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext(context, { alpha, pixelFormat: pixel });

			font && (ctx.font = font);
			angle && ctx.rotate(angle);

			for (const child of element.children) {
				switch (child.type) {
					case 0:
						if (child.style) {
							ctx.fillStyle = child.style;
						}

						ctx.fillRect(child.x, child.y, child.width, child.height);

						break;

					case 1:
						if (child.style) {
							ctx.fillStyle = child.style;
						}

						ctx.beginPath();
						ctx.arc(child.x, child.y, child.radius, child.startAngle ?? 0, child.endAngle ?? Math.PI * 2, child.clockwise);
						ctx.fill();

						break;

					case 2:
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

					case 3:
						const img = new Image();
						const imgData = typeof child.src == 'string' 
							? fs.readFileSync(child.src)
							: child.src;

						img.onload = () => {
							ctx.drawImage(img, child.x, child.y, child.width, child.height);
						};
						img.src = imgData;

						break;

					case 4: 
						break;

					case 5:
						const gradient = ctx.createLinearGradient(...child.startGradient, ...child.endGradient);

						for(let i = 0; i < child.colors.length; i++) {
							gradient.addColorStop(i, child.colors[i]);
						}

						ctx.fillRect(...child.startPos, ...child.endPos);
						
						break;
						
					case 0:
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

			return canvas.toBuffer()
		}
		case 'rectangle': {
			return {
				type: 0,
				...element.props
			}
		}
		case 'circle': {
			return {
				type: 1,
				...element.props
			}
		}
		case 'line': {
			return {
				type: 2,
				...element.props
			}
		}
		case 'img': {
			return {
				type: 3,
				...element.props
			}
		}
		case 'path': {
			return {
				type: 4,
				content: element.children.toString(),
				...element.props
			}
		}
		case 'gradient': {
			return {
				type: 5,
				...element.props
			}
		}
		case 'text': {
			return {
				type: 0,
				content: element.children.toString(),
				...element.props
			}
		}
    }
}

export default parseCanvaElement;