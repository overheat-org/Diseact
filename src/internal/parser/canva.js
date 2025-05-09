const UNLOADED = Symbol();

// loader.js
let createCanvas = UNLOADED, Image = UNLOADED;
import('@napi-rs/canvas').then(mod => {
	createCanvas = mod.createCanvas;
	Image = mod.Image;
	return true;
});

function parseCanvaElement(element) {
	while (createCanvas == UNLOADED) {}

	if(!createCanvas) throw new Error('install "@napi-rs/canvas" to use canvas elements')

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
						child.style && (ctx.fillStyle = child.style);
						ctx.fillRect(child.x, child.y, child.width, child.height);
						break;
					case 'circle':
						child.style && (ctx.fillStyle = child.style);
						ctx.beginPath();
						ctx.arc(child.x, child.y, child.radius, child.startAngle ?? 0, child.endAngle ?? Math.PI * 2, child.clockwise);
						ctx.fill();
						break;
					case 'line':
						child.style && (ctx.strokeStyle = child.style);
						child.width && (ctx.lineWidth = child.width);
						ctx.beginPath();
						ctx.moveTo(...child.startPos);
						ctx.lineTo(...child.endPos);
						ctx.stroke();
						break;
					case 'img': {
						const img = new Image();
						const imgData = typeof child.src === 'string' ? fs.readFileSync(child.src) : child.src;
						img.onload = () => ctx.drawImage(img, child.x, child.y, child.width, child.height);
						img.src = imgData;
						break;
					}
					case 'gradient': {
						const gradient = ctx.createLinearGradient(...child.startGradient, ...child.endGradient);
						child.colors.forEach((c, i) => gradient.addColorStop(i, c));
						ctx.fillStyle = gradient;
						ctx.fillRect(...child.startPos, child.endPos[0], child.endPos[1]);
						break;
					}
					case 'text': {
						const opts = [];
						child.italic && opts.push('italic');
						child.bold && opts.push('bold');
						child.size && opts.push(`${child.size}px`);
						opts.push(child.font ?? 'sans-serif');
						ctx.font = opts.join(' ');
						child.style && (ctx.fillStyle = child.style);
						ctx.fillText(child.content, child.x, child.y, child.maxWidth);
						ctx.font = font;
						break;
					}
				}
			}

			const buf = canvas.toBuffer();
			buf.$type = element.type;
			return buf;
		}

		case 'rectangle':
		case 'circle':
		case 'line':
		case 'img':
			return { $type: element.type, ...element.props };

		case 'path':
		case 'gradient':
		case 'text':
			return { $type: element.type, content: concatenateTextElements(element.children), ...element.props };
	}
}

export default parseCanvaElement;
